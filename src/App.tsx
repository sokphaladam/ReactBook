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

const QUERY_ME = gql`
  query me{
    me{
      id, first_name, last_name, gender, username, picture
    }
  }
`;

const BASE_URL = 'http://104.248.156.237:4000/';

export default class App extends React.Component{
  
  state: {
    token: string | null;
    client: ApolloClient<any>;
    isUpdate: boolean;
  }

  constructor(props: any){
    super(props);

    const TOKEN = localStorage.getItem('token');

    this.state = {
      token: TOKEN,
      client: this.renderApolloClient(TOKEN),
      isUpdate: false
    }
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
      uri: `ws://104.248.156.237:4000/graphql`,
      options: {
        reconnect: true
      }
    });
    const link = split(
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
      link,
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
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
            ({loading, data}: any) => {
              if(loading) return <div>Loading....</div>
              if(data.me === null){
                this.logout();
                return <LoginScreen saveToken={this.saveToken}/>
              }
              return(
                <DesktopComponent>
                    <MenuComponent menuItems={MenuItem} username={data.me.username} image={data.me.picture} hasChange={this.state.isUpdate}/>
                    <div className="Desktop-Menu">
                      <Route exact path="/page" render={ (props) => <PageScreen  {...props} hasChange={this.state.isUpdate}/> }/>
                      <Route exact path="/notification" render={ (props) => <NotificationScreen {...props} hasChange={this.state.isUpdate}/> }/>
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
      client: this.renderApolloClient(token)
    })

    localStorage.setItem('token', token);

  }

  logout = () => {
    this.setState({ token: '' });
    localStorage.removeItem('token');
  }

}
