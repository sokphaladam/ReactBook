import React from 'react';
import { Mutation, Query, MutationFunction } from 'react-apollo';
import { gql } from 'apollo-boost';

type Props = {
  hasChange: boolean;
}

const QUERY_NOTIFICATION_LIST = gql`
query getNotificationList{
  getNotificationList{
    id,
    type,
    status,
    book{
      title,
      picture
    },
    user{
      first_name,
      last_name,
      picture
    },
    created_at
  }
}
`;

const MUTATION_STATUS = gql`
mutation setStatus($id: Int!){
  setStatus(id: $id)
}
`;

export class NotificationScreen extends React.Component<Props>{

  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-6">
          <h5>Notification</h5>
          <hr />
          {this.renderQuery()}
        </div>
      </div>
    )
  }

  renderQuery() {
    return (
      <Query query={QUERY_NOTIFICATION_LIST} fetchPolicy="network-only">
        {this.renderQueryNotification}
      </Query>
    )
  }

  renderQueryNotification = ({ loading, data, refetch }: any) => {
    if (loading) return <div>Loading...</div>
    if (this.props.hasChange) refetch();
    return (
      <div className="card">
        <ul className="notification">
          {
            data.getNotificationList.map((e: any) => (
              <Mutation mutation={MUTATION_STATUS} key={e.id}>
                {
                  (update: MutationFunction)=> this.renderItem(e, update)
                }
              </Mutation>
            ))
          }
        </ul>
      </div>
    )
  }

  renderItem(e: any, update: MutationFunction) {
    return (
      <li className="sub-notification" key={e.id} onClick={() => update({ variables: { id: Number(e.id) } })} style={{ backgroundColor: e.status ? '': '#70a1ff' }}>
        <img src={e.user.picture} className="profile" alt="" />
        <p>
          <b>{e.user.first_name} {e.user.last_name}</b> is <b>{e.type}</b> on your post:
                  <br />
          <span>{e.book.title}</span>
        </p>
        <img src={e.book.picture} alt="" className="post" />
      </li>
    )
  }
}