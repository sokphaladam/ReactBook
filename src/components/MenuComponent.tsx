import React from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import ContentLoader from 'react-content-loader';

type Props = {
  menuItems: any[];
  hasChange: boolean;
  data: any;
  onLogout: () => any;
}

const IMAGE = 'https://lumiere-a.akamaihd.net/v1/images/open-uri20150422-20810-10n7ovy_9b42e613.jpeg?region=0,0,450,450';

const QUERY_NOTIFICATION_COUNT = gql`
query getNotificationCount{
  getNotificationCount
}
`;

export class MenuComponent extends React.Component<Props>{

  state: {
    username: string;
    image: string;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      username: this.props.data.username,
      image: this.props.data.picture
    }
  }

  render() {
    return (
      <div className="menu">
        <ul>
          {
            this.props.menuItems.map((e: any, i: number) => (
              <Link to={e.to} key={i}>
                <li data-toggle="tooltip">
                  <i className={e.icon}></i>
                  <span>{e.title}</span>
                  {this.renderQueryNotification(e.isBadge)}
                </li>
              </Link>
            ))
          }
          <li className="user" data-toggle="tooltip" data-placement="top" title={this.state.username}>
              <img src={this.props.data.picture === undefined ? IMAGE : this.state.image} alt="" />
              <div className="content">
                <h6>{this.props.data.first_name} {this.props.data.last_name}</h6>
                <sub>{new Date(this.props.data.created_at * 1).toDateString()}</sub>
              </div>
              <button className="close" onClick={this.props.onLogout} style={{ position: 'absolute', right: 10 }}>
                <span>&times;</span>
              </button>
            </li>
        </ul>
      </div>
    )
  }

  renderQueryNotification(isBadge: boolean) {
    return (
      <Query query={QUERY_NOTIFICATION_COUNT} fetchPolicy="network-only">
        {
          ({ loading, data, refetch }: any) => {
            if (loading) return <div>Loading...</div>
            if (this.props.hasChange) refetch();
            return <span className="badge badge-danger" style={{ fontSize: 12, position: 'absolute' }} hidden={!isBadge || data.getNotificationCount === 0}>{data.getNotificationCount}</span>
          }
        }
      </Query>
    )
  }
}