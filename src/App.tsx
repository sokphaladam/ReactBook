import React from 'react';
import { ApolloProvider, Query } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import ApolloClient from 'apollo-client';
import { LoginScreen } from './screen/LoginScreen';
import { gql } from 'apollo-boost';
import './scss/main.scss';
import { DesktopComponent } from './components/DesktopComponent';
import { MenuComponent } from './components/MenuComponent';
import { MenuItem } from './MenuItem';
import { Route } from 'react-router-dom';
import { PageScreen } from './screen/Page/PageScreen';

const me = gql`
  query me{
    me{
      id, first_name, last_name, gender, username, picture
    }
  }
`

export default class App extends React.Component{
  
  state: {
    token: string | null;
    client: ApolloClient<any>;
  }

  constructor(props: any){
    super(props);

    const TOKEN = localStorage.getItem('token');

    this.state = {
      token: TOKEN,
      client: this.renderApolloClient(TOKEN)
    }
  }

  render(){
    return(
      <ApolloProvider client={this.state.client}>
        {this.renderVerifyToken()}
      </ApolloProvider>
    )
  }

  renderApolloClient = (token: string | null) => {
    const CACHE = new InMemoryCache();
    const LINK = new HttpLink({
      uri: `http://104.248.156.237:4000/playground?token=${token}`
    });
    const CLIENT = new ApolloClient({
      cache: CACHE,
      link: LINK,
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
        <Query query={me} fetchPolicy="network-only">
          {
            ({loading, data}: any) => {
              if(loading) return <div>Loading....</div>
              return(
                <DesktopComponent>
                    <MenuComponent menuItems={MenuItem} username={data.me.username} image={data.me.image}/>
                    <div className="Desktop-Menu">
                      <Route exact path="/page" component={PageScreen}/>
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

}
