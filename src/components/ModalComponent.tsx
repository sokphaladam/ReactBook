import React from 'react';

type Props = {
  title: string;
  show: boolean;
  statusModal: (e: boolean) => any;
}

export class ModalComponent extends React.Component<Props>{
  
  state: {
    show: boolean;
  }

  constructor(props: Props){
    super(props);
    this.state = {
      show: this.props.show
    }
  }

  render(){
    return(
      <div className={`modal fade ${this.props.show ? 'show':''}`} tabIndex={-1} style={{ display: this.props.show ? 'block':'none', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered" >
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">{this.props.title}</div>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.props.statusModal(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}