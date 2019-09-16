import React from 'react';

type Props = {
  image: string[]
}

export class DotMenuComponent extends React.Component<Props> {

  state: {
    show: boolean;
  }

  constructor(props: Props){
    super(props);
    this.state = {
      show: false
    }
  }

  onClickDownload = () => {
    this.props.image.map((x: string) => {
      const a = x.split('/');
      const link = document.createElement('a');
      let bas = x.replace(/^data:image\/(png|jpg);base64,/, "");
      console.log(bas)
      link.href = bas;
      // link.download = a[a.length - 1];
      // document.body.appendChild(link);
      // link.click();
      link.remove();
    })
  }

  render() {
    return (
      <div className="dotMenu">
        <i className="fas fa-ellipsis-h" ></i>
        <ul>
          <li onClick={this.onClickDownload}><i className="fas fa-download"></i> Download</li>
        </ul>
      </div>
    )
  }
}