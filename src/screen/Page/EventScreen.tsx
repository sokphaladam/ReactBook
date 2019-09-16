import React from 'react';

export class EventScreen extends React.Component{
  render(){
    return(
      <div className="events">
        <p>Upcoming events</p>
        <img src="https://images.pexels.com/photos/842532/pexels-photo-842532.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="" style={{ width: '100%', height: 150, borderRadius: 7, objectFit: 'cover', objectPosition: 'center' }}/>
        <p>Google open meetup - Pixel</p>
        <sub>3:10 PM, Today</sub>
      </div>
    )
  }
}