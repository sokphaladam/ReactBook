import React from 'react';
import { ApolloProvider, Query } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import ApolloClient from 'apollo-client';
import { LoginScreen } from './screen/LoginScreen';
import { gql, split } from 'apollo-boost';
import './scss/main.scss';
import { DesktopComponent } from './components/DesktopComponent';
import { MenuComponent } from './components/MenuComponent';
import { MenuItem } from './MenuItem';
import { Route } from 'react-router-dom';
import { PageScreen } from './screen/Page/PageScreen';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { SubscriptionComponent } from './components/SubscriptionComponent';
import { NotificationScreen } from './screen/Notification/NotificationScreen';
import { ProfileScreen } from './screen/Profile/ProfileScreen';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloLink } from 'apollo-boost';
import { onError } from 'apollo-link-error';
import { MessageScreen } from './screen/Message/MessageScreen';

const QUERY_ME = gql`
  query me{
    me{
      id, first_name, last_name, gender, username, picture, created_at
    }
  }
`;

const BASE_URL = 'http://104.248.156.237:4000/';

export default class App extends React.Component{
  
  state: {
    token: string | null;
    client: ApolloClient<any>;
    isUpdate: boolean;
    isverifyToken: boolean;
  }

  constructor(props: any){
    super(props);

    const TOKEN = localStorage.getItem('token');

    this.state = {
      token: TOKEN,
      client: this.renderApolloClient(TOKEN),
      isUpdate: false,
      isverifyToken: false
    }

    this.verifyToken();
  }

  hasChange = (e: boolean) => {
    this.setState({ isUpdate: e })
  }

  render(){
    return(
      <ApolloProvider client={this.state.client}>
        <SubscriptionComponent hasChange={this.hasChange}/>
        {this.renderVerifyToken()}
      </ApolloProvider>
    )
  }

  renderApolloClient = (token: string | null) => {
    const CACHE = new InMemoryCache();
    const LINK = new HttpLink({
      uri: `${BASE_URL}playground?token=${token}`
    });
    const WSLINK = new WebSocketLink({
      uri: `ws://104.248.156.237:4000/graphql`
    });
    const linkWS = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      WSLINK,
      LINK,
    )
    const CLIENT = new ApolloClient({
      cache: CACHE,
      link: ApolloLink.from([ 
        onError(({ graphQLErrors, networkError }) => {
          if (graphQLErrors)
            graphQLErrors.map(({ message, locations, path }) =>
              console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
            );
          if (networkError) console.log(`[Network error]: ${networkError}`);
        }),
        createUploadLink({ uri: `${BASE_URL}playground?token=${token}` }),
        linkWS
      ]),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore'
        },
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all'
        },
        mutate: {
          errorPolicy: 'all'
        }
      }
    });

    return CLIENT;
  }

  renderVerifyToken(){
    if(this.state.token === null) return <LoginScreen saveToken={this.saveToken}/>
    else{
      return(
        <Query query={QUERY_ME} fetchPolicy="network-only">
          {
            ({loading, data, refetch}: any) => {
              if(loading) return <div>Loading....</div>
              if(this.state.isverifyToken === false) {
                return <LoginScreen saveToken={this.saveToken}/>
              }
              return(
                <DesktopComponent>
                    <MenuComponent 
                      menuItems={MenuItem}
                      hasChange={this.state.isUpdate}
                      data={data.me}
                      onLogout={()=>{
                        this.logout();
                        refetch();
                      }}
                    />
                    <div className="Desktop-Menu" style={{ padding: window.location.pathname  === '/messages' ? 0: 30 }}>
                      <Route exact path="/news" render={ (props) => <PageScreen  {...props} hasChange={this.state.isUpdate} picture={data.me.picture}/> }/>
                      <Route exact path="/notification" render={ (props) => <NotificationScreen {...props} hasChange={this.state.isUpdate}/> }/>
                      <Route exact path="/profile/:id" render={ (props) => <ProfileScreen {...props} hasChange={this.state.isUpdate}/> }/>
                      <Route exact path="/messages" render={(props) => <MessageScreen {...props} hasChange={this.state.isUpdate} id={data.me.id} client={this.state.client}/>}/>
                    </div>
                </DesktopComponent>
              )
            }
          }
        </Query>
      ) 
    }
  }

  saveToken = (token: string) => {
    this.setState({
      token,
      client: this.renderApolloClient(token),
      isverifyToken: true
    });
    localStorage.setItem('token', token);
  }

  logout = () => {
    this.setState({ token: '', isverifyToken: false });
    localStorage.removeItem('token');
  }

  verifyToken = async () => {
    const QRY = await this.state.client.query({
      query: gql`{ me { id, first_name, last_name, gender, username, picture, created_at }}`
    });

    const data = QRY.data;

    if(data.me === null) {
      localStorage.removeItem('token');
      this.setState({ 
        token: '',
        client: this.renderApolloClient(null),
        isverifyToken: false
      });
    }
    else {
      const token = localStorage.getItem('token');
      this.setState({
        token,
        client: this.renderApolloClient(token),
        isverifyToken: true
      })
    }
  }

}
