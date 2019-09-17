import React from 'react';
import { gql } from 'apollo-boost';
import moment from 'moment';
import { Query } from 'react-apollo';

const QUERY_USER = gql`
query getUserList{
  getUserList{
    id
    first_name,
    last_name,
    picture,
    friends{
      id
    },
    created_at
  }
}
`;

const QUERY_MESSAGE = gql`
query getMessage($id: Int!, $to: Int!){
  getMessage(sender: $id, receiver: $to){
    sender,
    receiver,
    content,
  	type
  }
} 
`;

type Props = {
  hasChange: any;
  id: number;
}

export class MessageScreen extends React.Component<Props> {

  state: {
    user: any;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      user: {}
    }
  }

  onClickUser = (x: any) => {
    this.setState({
      user: x
    })
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-9">
          <div className="card" style={{ position: "fixed", width: 'calc(100% - 40%)', height: '90%' }}>
            {this.renderHeader()}
            {this.renderBody()}
            {this.renderFooter()}
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body friendRequest" style={{ marginTop: 0 }}>
              <p>Friends</p>
              <Query query={QUERY_USER} fetchPolicy="network-only">
                {this.renderQueryFriend}
              </Query>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderQueryFriend = ({ loading, data }: any) => {
    if (loading) return <div>Loading...</div>
    return (
      <div className="friendRequest-list">
        {
          data.getUserList.map((x: any) => {
            if (x.id !== this.props.id) {
              return (
                <div className="display-row cu" key={x.id} onClick={() => this.onClickUser(x)}>
                  <img src={x.picture} alt="" />
                  <div>
                    <p>{x.first_name} {x.last_name}</p>
                    <sub>{moment(new Date(x.created_at * 1)).fromNow()}</sub>
                  </div>
                </div>
              )
            }
          })
        }
      </div>
    )
  }

  renderQueryMessage = ({ loading, data, refetch }: any) => {
    if (loading) return <div>loading...</div>
    if (this.props.hasChange) refetch();
    console.log(data)
    return (
      <div className="chat">
        {
          data.getMessage.map((x: any, i: number) => {
            if (x.sender == this.props.id) {
              return (
                <div key={i} className="me">
                  <span>{x.content}</span>
                </div>
              )
            }
            else {
              return (
                <div key={i} className="you">
                  <span>{x.content}</span>
                </div>
              )
            }
          })
        }
      </div>
    )
  }

  renderHeader() {
    if (this.state.user.id != undefined) {
      return (
        <div className="card-header text-light" style={{ backgroundColor: '#3737a5' }}>
          <div style={{ display: 'flex' }}>
            <img src={this.state.user.picture} alt="" style={{ width: 50, height: 50, borderRadius: '50%', marginRight: 20 }} />
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>{this.state.user.first_name} {this.state.user.last_name}</p>
              <sub style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{moment(new Date(this.state.user.created_at * 1)).fromNow()}</sub>
            </div>
          </div>
        </div>
      )
    }
  }

  renderBody() {
    if (this.state.user.id != undefined) {
      return (
        <div className="card-body">
          <Query query={QUERY_MESSAGE} fetchPolicy="network-only" variables={{ id: Number(this.props.id), to: Number(this.state.user.id) }}>
            {this.renderQueryMessage}
          </Query>
        </div>
      )
    }
  }

  renderFooter() {
    if (this.state.user.id != undefined) {
      return (
        <div className="card-footer">
          <form className="comment-form" style={{ display: 'flex', height: 'auto' }}>
            <input type="text" placeholder="Type a messages..." className="form-control" style={{ width: '95%' }} />
            <button type="submit" style={{ fontSize: 20, marginRight: 0 }}>
              <i className="fas fa-paper-plane" style={{ color: '#3737a5' }}></i>
            </button>
          </form>
        </div>
      )
    }
  }
}