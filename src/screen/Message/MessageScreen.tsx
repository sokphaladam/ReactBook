import React from 'react';
import { gql } from 'apollo-boost';
import moment from 'moment';
import { Query, Mutation, MutationFunction } from 'react-apollo';

const QUERY_USER = gql`
query getUserList{
  getUserList{
    id
    first_name,
    last_name,
    picture,
    friends{
      id
    },
    created_at
  }
}
`;

const QUERY_MESSAGE = gql`
query getMessage($id: Int!, $to: Int!){
  getMessage(sender: $id, receiver: $to){
    sender,
    receiver,
    content,
  	type
  }
} 
`;

const MUTATION_SEND = gql`
mutation sendMessage($data: messageInput!){
  sendMessage(data: $data)
}
`;

const MUTATION_UPLOAD = gql`
mutation singleUpload($file: Upload!){
  singleUpload(file: $file)
}
`

type Props = {
  hasChange: any;
  id: number;
}

export class MessageScreen extends React.Component<Props> {

  refSubmit: any;
  refPaperclip: any;

  state: {
    user: any;
    messageInput: string;
    image: string;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      user: {},
      messageInput: '',
      image: ''
    }
  }

  onClickUser = (x: any) => {
    this.setState({
      user: x
    })
  }

  onSubmitSend = (e: any, update: MutationFunction) => {
    e.preventDefault();
    update({
      variables: {
        data: {
          receiver: Number(this.state.user.id),
          content: this.state.messageInput,
          type: 'text'
        }
      }
    });
  }

  onChangeInput = (e: any) => {
    this.setState({
      messageInput: e.target.value
    });
  }

  onMutationComplete = (data: any) => {
    if(data.sendMessage === true) {
      this.setState({ messageInput: '' });
    }
  }

  onMutationUploadComplete = (data: any) => {
    if(data.singleUpload !== null) {
      this.setState({ image: data.singleUpload });
    }
  }

  render() {
    return (
      <div className="message-container">
        {this.renderChannel()}
        <div className="message">
          <div className="header">
            <i className="fas fa-search"></i>
            <input type="text" className="form-control" placeholder="Search in all messages" />
          </div>
          <Query query={QUERY_USER} fetchPolicy="network-only">
            {this.renderQueryFriend}
          </Query>
        </div>
      </div>
    )
  }

  renderQueryFriend = ({ loading, data }: any) => {
    if (loading) return <div>Loading...</div>
    return (
      <div className="body">
        {
          data.getUserList.map((x: any) => {
            if (x.id !== this.props.id) {
              return (
                <div className={`block ${this.state.user === x ? 'active' : ''}`} key={x.id} onClick={() => this.onClickUser(x)}>
                  <img src={x.picture} alt="" />
                  <div>
                    <p>{x.first_name} {x.last_name}</p>
                    <sub>{moment(new Date(x.created_at * 1)).fromNow()}</sub>
                  </div>
                  <div className="text-right sub">
                    <sub>{moment(new Date(x.created_at * 1)).fromNow()}</sub>
                    <br />
                    {/* <span className="badge badge-primary">7</span> */}
                  </div>
                </div>
              )
            }
            return <div key={x.id}></div>
          })
        }
      </div>
    )
  }

  renderHeader() {
    return (
      <div className="header">
        <img src={this.state.user.picture} alt="" />
        <div>
          <p>{this.state.user.first_name} {this.state.user.last_name}</p>
          <sub>{moment(new Date(this.state.user.created_at * 1)).fromNow()}</sub>
        </div>
      </div>
    )
  }

  renderBody() {
    return (
      <div className="body">
        <Query query={QUERY_MESSAGE} fetchPolicy="network-only" variables={{ id: Number(this.props.id), to: Number(this.state.user.id) }}>
          {this.renderQueryMessage}
        </Query>
      </div>
    )
  }

  renderFooter = (update: MutationFunction) => {
    return (
      <div className="footer">
        <img src={this.state.image} alt=""/>
        <form className="comment-form" style={{ display: 'flex', height: 'auto' }} onSubmit={(e) => this.onSubmitSend(e, update)}>
          <button type="button" style={{ fontSize: 20, marginRight: 0 }} onClick={() => this.refPaperclip.click()}>
            <i className="fas fa-paperclip"></i>
            {this.renderUploadFile()}
          </button>
          <input 
            type="text" 
            placeholder="Type a messages..." 
            className="form-control" 
            style={{ width: '95%', paddingTop: 0, paddingBottom: 0 }}
            value={this.state.messageInput}
            onChange={this.onChangeInput}
            onKeyPress={(e)=> {
              if(e.keyCode === 13) {
                this.refSubmit.click();
              }
            }}
          />
          <button type="submit" style={{ fontSize: 20, marginRight: 0 }} ref={(ref) => this.refSubmit = ref}>
            <i className="fas fa-paper-plane" style={{ color: '#3737a5' }}></i>
          </button>
        </form>
      </div>
    )
  }

  renderChannel() {
    if (this.state.user.id === undefined) {
      return <div className="text-center"><p>Please select a chat to start messaging</p></div>;
    }
    else {
      return (
        <div className="channel">
          {this.renderHeader()}
          {this.renderBody()}
          <Mutation mutation={MUTATION_SEND} onCompleted={this.onMutationComplete}>
            {this.renderFooter}
          </Mutation>
        </div>
      )
    }
  }

  renderQueryMessage = ({ loading, data, refetch }: any) => {
    if (loading) return <div>loading...</div>
    if (this.props.hasChange) refetch();
    return (
      <div className="block">
        {
          data.getMessage.map((x: any, i: number) => {
            if (x.sender === Number(this.props.id)) {
              return (
                <div key={i} className="me">
                  <span>{x.content}</span>
                </div>
              )
            }
            else {
              return (
                <div key={i} className="you">
                  <span>{x.content}</span>
                </div>
              )
            }
          })
        }
      </div>
    )
  }

  renderUploadFile(){
    return(
      <Mutation mutation={MUTATION_UPLOAD} onCompleted={this.onMutationUploadComplete}>
        {
          (update: MutationFunction) => (
            <input 
              type="file" 
              style={{ display: 'none' }} 
              ref={(ref) => this.refPaperclip = ref} 
              onChange={(e) => {
                update({
                  variables: {
                    file: e.target.files![0]
                  }
                })
              }}
            />
          )
        }
      </Mutation>
    )
  }
}