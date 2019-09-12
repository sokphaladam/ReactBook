import React from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

type Props = {
  menuItems: any[];
  username: string;
  image: string;
  hasChange: boolean;
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
    count: number;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      username: this.props.username,
      image: this.props.image,
      count: 0
    }
  }

  onCompleted = (data: any) => {
    this.setState({
      count: data.getNotificationCount
    })
  }

  render(){
    return(
      <div className="menu">
        <ul>
          {
            this.props.menuItems.map((e: any, i: number) => (
              <Link to={e.to} key={i}>
                <li data-toggle="tooltip" data-placement="top" title={e.title}>
                  <i className={e.icon}></i>
                  {this.renderQueryNotification(e.isBadge)}
                </li>
              </Link>
            ))
          }
          <li className="user" data-toggle="tooltip" data-placement="top" title={this.state.username}>
            <img src={this.props.image === undefined ? IMAGE : this.state.image} alt=""/>
          </li>
        </ul>
      </div>
    )
  }

  renderQueryNotification(isBadge: boolean){
    return(
      <Query query={QUERY_NOTIFICATION_COUNT} fetchPolicy="network-only" onCompleted={this.onCompleted}>
        {
          ({loading, data, refetch}: any) => {
            if(loading) return <div>Loading...</div>
            if(this.props.hasChange) refetch();
            return <span className="badge badge-danger" style={{ fontSize: 12, position: 'absolute' }} hidden={!isBadge || this.state.count === 0}>{data.getNotificationCount}</span>
          }
        }
      </Query>
    )
  }
}