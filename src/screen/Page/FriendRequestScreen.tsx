import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import moment from 'moment';

const QUERY_FRIEND_LIST = gql`
query getFriendList{
  getFriendList{
    user{
      first_name,
      last_name,
      picture
    },
    approved,
    created_at,
    updated_at
  }
}
`

export class FriendRequestScreen extends React.Component{
  render(){
    return(
      <div className="friendRequest">
        <p>Friend Request</p>
        <Query query={QUERY_FRIEND_LIST} fetchPolicy="network-only">
          {this.renderQueryFriend}
        </Query>
      </div>
    )
  }

  renderQueryFriend = ({loading, data}: any) => {
    if(loading) return <div>Loading...</div>
    return (
      <div className="friendRequest-list">
        {
          data.getFriendList.map((x: any, i: number) => {
            if(!x.approved){
              return(
                <div className="display-row" key={i}>
                  <img src={x.user.picture} alt=""/>
                  <div>
                    <p>{x.user.first_name} {x.user.last_name}</p>
                    <sub>{moment(new Date(x.created_at * 1)).fromNow()}</sub>
                  </div>
                  <div className="link">
                    <span className="btn-link">confirm</span>
                    <span className="btn-link">cancel</span>
                  </div>
                </div>
              )
            }
            return <div key={i}></div>;
          })
        }
      </div>
    )
  }
}