import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  menuItems: any[];
  username: string;
  image: string;
}

const IMAGE = 'https://lumiere-a.akamaihd.net/v1/images/open-uri20150422-20810-10n7ovy_9b42e613.jpeg?region=0,0,450,450';

export class MenuComponent extends React.Component<Props>{

  constructor(props: Props) {
    super(props);
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
                  <span className="badge badge-danger" style={{ fontSize: 12, position: 'absolute' }} hidden={!e.isBadge}>5</span>
                </li>
              </Link>
            ))
          }
          <li className="user" data-toggle="tooltip" data-placement="top" title={this.props.username}>
            <img src={this.props.image == null ? IMAGE : this.props.image} alt=""/>
          </li>
        </ul>
      </div>
    )
  }
}