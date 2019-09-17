import React from 'react';

type Props = {
  image: string[]
}

export class DotMenuComponent extends React.Component<Props> {

  state: {
    show: boolean;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      show: false
    }
  }

  onClickDownload = () => {
    const items = this.props.image;

    for(const i of items) {
      
      const a = i.split('/');
      
      const link = document.createElement('a');
      
      getEncodeBase64(i, (e: any) =>{
        link.href = 'data:image/jpeg;base64,' + e;
        link.download = a[a.length - 1];
        link.click();
        link.remove();
      });
      
    }
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

const getEncodeBase64 = (imgUrl: string, callback: any) => {
  var xml = new XMLHttpRequest();
  xml.onload = () => {
    var b64 = btoa(
      new Uint8Array(xml.response)
      .reduce(
        (data: any, byte: any) => 
          data + String.fromCharCode(byte), ''
      )
    );
    callback(b64);
  }
  xml.open('GET', imgUrl, true);
  xml.responseType = 'arraybuffer';
  xml.send();
}