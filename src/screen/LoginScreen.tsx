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
    animation: string;
    transform: string;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      animation: '',
      transform: ''
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

  componentDidMount(){
    setTimeout(()=>{
      this.setState({
        animation: 'slide-left .5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
        transform: 'translateX(0)'
      })
    }, 500);
  }

  render() {
    return (
      <div className="login-container">
        {/* <img src={require('../assets/mentor-UX-get-started.webp')} alt=""/> */}
        <img src={require('../assets/people.gif')} alt=""/>
        <div className="form-login" style={{ animation: this.state.animation, transform: this.state.transform }}>
          {this.renderMutationLogin()}
        </div>
      </div>
    )
  }

  renderMutationLogin() {
    return (
      <Mutation mutation={LOGIN} onCompleted={this.onMutationComplete}>
        {
          (update: MutationFunction) => (
            <form onSubmit={(e) => this.onSubmite(e, update)}>
              <h3>Welcome Back!</h3>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem perferendis.</p>
              <div className="form-group">
                <input className="form-control" type="text" placeholder="username" name="username" value={this.state.username} onChange={this.onInputChange} />
              </div>
              <div className="form-group">
                <input className="form-control" type="password" placeholder="password" name="password" value={this.state.password} onChange={this.onInputChange} />
              </div>
              <button className="btn btn-primary btn-block" type="submit">Login</button>
              <button type="button" className="btn btn-link btn-block" style={{ marginTop: '10%' }}>Create new account</button>
            </form>
          )
        }
      </Mutation>
    )
  }
}