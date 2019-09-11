import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

export class DesktopComponent extends React.Component{
  render(){
    return(
      <Router>
        <div className="Desktop">
          {this.props.children}
        </div>
      </Router>
    )
  }
}