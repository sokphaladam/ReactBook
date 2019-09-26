import React from 'react';
import { gql } from 'apollo-boost';
import { Mutation, MutationFunction } from 'react-apollo';

const LOGIN = gql`
  mutation login($username: String!, $password: String!){
    login(username: $username, password: $password)
  }
`

type Props = {
  saveToken: (toke: string) => any
}

export class LoginScreen extends React.Component<Props>{

  state: {
    username: string;
    password: string;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }

  onInputChange = (e: any) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSubmite = (e: any, update: MutationFunction) => {
    e.preventDefault();
    update({
      variables: {
        username: this.state.username,
        password: this.state.password
      }
    })
  }

  onMutationComplete = (data: any) => {
    this.props.saveToken(data.login);
  }

  render() {
    return (
      <div>
        {/* {this.renderMutationLogin()} */}
      </div>
    )
  }

  renderMutationLogin() {
    return (
      <Mutation mutation={LOGIN} onCompleted={this.onMutationComplete}>
        {
          (update: MutationFunction) => (
            <form onSubmit={(e) => this.onSubmite(e, update)}>
              <input type="text" placeholder="username" name="username" value={this.state.username} onChange={this.onInputChange} />
              <input type="password" placeholder="password" name="password" value={this.state.password} onChange={this.onInputChange} />
              <button type="submit">login</button>
            </form>
          )
        }
      </Mutation>
    )
  }
}