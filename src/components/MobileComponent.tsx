import React from 'react';

export class MobileComponent extends React.Component{
  render(){
    return(
      <div>
        <div className="Mobile">
          {this.props.children}
        </div>
      </div>
    )
  }
}