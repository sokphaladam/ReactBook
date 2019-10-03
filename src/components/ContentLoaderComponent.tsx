import React from 'react';
import ContentLoader from 'react-content-loader';
import { MenuComponent } from './MenuComponent';

type Props = {
  type: 'CHAT' | 'POST' | 'PAGE'
}

export class ContentLoaderComponent extends React.Component<Props> {
  render() {
    return (
      <div>
        {this.renderContentLoader()}
      </div>
    )
  }

  renderContentLoader() {
    if (this.props.type === 'POST') {
      return (
        <div>
          <ContentLoader
            height={475}
            width={400}
            speed={2}
            primaryColor="#f3f3f3"
            secondaryColor="#ecebeb"
          >
            <circle cx="7" cy="7" r="7" />
            <rect x="25" y="2" rx="4" ry="4" width="100" height="8" />
            <rect x="25" y="15" rx="4" ry="4" width="50" height="7" />
            <rect x="0" y="35" rx="5" ry="5" width="400" height="150" />
          </ContentLoader>
          <ContentLoader
            height={475}
            width={400}
            speed={2}
            primaryColor="#f3f3f3"
            secondaryColor="#ecebeb"
          >
            <circle cx="7" cy="7" r="7" />
            <rect x="25" y="2" rx="4" ry="4" width="100" height="8" />
            <rect x="25" y="15" rx="4" ry="4" width="50" height="7" />
            <rect x="0" y="35" rx="5" ry="5" width="400" height="150" />
          </ContentLoader>
          <ContentLoader
            height={475}
            width={400}
            speed={2}
            primaryColor="#f3f3f3"
            secondaryColor="#ecebeb"
          >
            <circle cx="7" cy="7" r="7" />
            <rect x="25" y="2" rx="4" ry="4" width="100" height="8" />
            <rect x="25" y="15" rx="4" ry="4" width="50" height="7" />
            <rect x="0" y="35" rx="5" ry="5" width="400" height="150" />
          </ContentLoader>
        </div>
      )
    }
    else if (this.props.type === 'PAGE') {
      return (
        <div className="menu">
          <ContentLoader
            height={260}
            width={400}
            speed={2}
            primaryColor="#c4c4c4"
            secondaryColor="#ecebeb"
          >
            <circle cx="75" cy="50" r="8" /> 
            <rect x="90" y="45" rx="5" ry="5" width="220" height="10" />
            <circle cx="75" cy="100" r="8" /> 
            <rect x="90" y="95" rx="5" ry="5" width="220" height="10" />
            <circle cx="75" cy="150" r="8" /> 
            <rect x="90" y="145" rx="5" ry="5" width="220" height="10" />
            <circle cx="75" cy="200" r="8" /> 
            <rect x="90" y="195" rx="5" ry="5" width="220" height="10" />
          </ContentLoader>
          <ul>
            <li className="user"></li>
          </ul>
        </div>
      )
    }
    return <div></div>
  }
}