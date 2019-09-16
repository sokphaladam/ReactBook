import React from 'react';

export class StoriesScreen extends React.Component {

  state: {
    profile: string[];
  }

  constructor(props: any) {
    super(props);
    this.state = {
      profile: [
        'https://s3.amazonaws.com/uifaces/faces/twitter/daykiine/128.jpg',
        'https://s3.amazonaws.com/uifaces/faces/twitter/iqonicd/128.jpg',
        'https://s3.amazonaws.com/uifaces/faces/twitter/cggaurav/128.jpg',
        'https://s3.amazonaws.com/uifaces/faces/twitter/erwanhesry/128.jpg',
        'https://s3.amazonaws.com/uifaces/faces/twitter/BryanHorsey/128.jpg',
        'https://s3.amazonaws.com/uifaces/faces/twitter/magoo04/128.jpg',
        'https://s3.amazonaws.com/uifaces/faces/twitter/stushona/128.jpg',
        'https://s3.amazonaws.com/uifaces/faces/twitter/ddggccaa/128.jpg',
        'https://s3.amazonaws.com/uifaces/faces/twitter/aleinadsays/128.jpg',
        'https://s3.amazonaws.com/uifaces/faces/twitter/hiemil/128.jpg'
      ]
    }
  }

  render() {
    return (
      <div className="stories">
        <p>Stories</p>
        {this.renderListStories()}
      </div>
    )
  }

  renderButtonAdd() {
    return (
      <div className="btn-circle bg-primary">
        <i className="fas fa-plus"></i>
      </div>
    )
  }

  renderListStories() {
    return (
      <div className="stories-list" id="scroll">
        {this.renderButtonAdd()}
        {
          this.state.profile.map((x: any, i: number) => {
            return (
              <div className="btn-circle bg-primary" key={i}>
                <img src={x} alt="" />
              </div>
            )
          })
        }
      </div>
    )
  }
}