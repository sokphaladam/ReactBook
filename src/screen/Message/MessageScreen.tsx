import React from 'react';
import { gql, ApolloClient } from 'apollo-boost';
import moment from 'moment';
import { Query, Mutation, MutationFunction } from 'react-apollo';

const QUERY_USER = gql`
query getMessageHistory{
  getMessageHistory{
    user{
      first_name,
      last_name,
      id,
      picture
    },
    content,
    type,
    count,
    created_at,
    updated_at
  }
}
`;

const QUERY_MESSAGE = gql`
query getMessage($id: Int!, $to: Int!){
  getMessage(sender: $id, receiver: $to){
    sender,
    receiver,
    content,
  	type,
    picture,
    created_at
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
`;

const MUTAION_SEEN = gql`
mutation seenMessage($user_id: Int!){
  seenMessage(user_id: $user_id)
}
`;

type Props = {
  hasChange: any;
  id: number;
  client: ApolloClient<any>;
}

export class MessageScreen extends React.Component<Props> {

  refSubmit: any;
  refPaperclip: any;
  refSeen: any[] = [];

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

  onClickUser = (x: any, update: MutationFunction) => {
    this.setState({
      user: x
    });

    update({
      variables: {
        user_id: Number(x.user.id)
      }
    })
  }

  onUpdateSeen = async () => {
    const mut = await this.props.client.mutate({
      mutation: MUTAION_SEEN,
      variables: { user_id: Number(this.state.user.user.id) }
    });

    console.log(mut.data);
  }

  onSubmitSend = (e: any, update: MutationFunction) => {
    e.preventDefault();

    let typeMessage = "text";

    if (this.state.image !== "" && this.state.messageInput === "") {
      typeMessage = "image"
    }
    else if (this.state.image !== "" && this.state.messageInput !== "") {
      typeMessage = "textPic"
    }

    update({
      variables: {
        data: {
          receiver: Number(this.state.user.user.id),
          content: this.state.messageInput,
          picture: this.state.image,
          type: typeMessage
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
    if (data.sendMessage === true) {
      this.setState({ messageInput: '', image: '' });
    }
  }

  onMutationUploadComplete = (data: any) => {
    if (data.singleUpload !== null) {
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

  renderQueryFriend = ({ loading, data, refetch }: any) => {
    if (loading) return <div>Loading...</div>
    if (this.props.hasChange) refetch();
    return (
      <div className="body">
        {
          data.getMessageHistory.map((x: any) => {
            if (x.id !== this.props.id) {
              return (
                <Mutation mutation={MUTAION_SEEN} key={x.user.id}>
                  {
                    (update: MutationFunction) => (
                      <div className={`block ${this.state.user.user === x.user ? 'active' : ''}`} onClick={() => this.onClickUser(x, update)} ref={(ref) => this.refSeen.push({ id: x.user.id, seen: ref })}>
                        <img src={x.user.picture} alt="" />
                        <div>
                          <p>{x.user.first_name} {x.user.last_name}</p>
                          <sub>{x.type === 'image' ? "Photo" : x.content}</sub>
                        </div>
                        <div className="text-right sub">
                          <sub>{moment(new Date(x.updated_at * 1)).fromNow()}</sub>
                          <br />
                          <span className="badge badge-primary" style={{ display: x.count === 0 ? 'none' : '' }}>{x.count}</span>
                        </div>
                      </div>
                    )
                  }
                </Mutation>
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
        <img src={this.state.user.user.picture} alt="" />
        <div>
          <p>{this.state.user.user.first_name} {this.state.user.user.last_name}</p>
          <sub>{moment(new Date(this.state.user.created_at * 1)).fromNow()}</sub>
        </div>
      </div>
    )
  }

  renderBody() {
    return (
      <div className="body" id="list-message">
        <Query query={QUERY_MESSAGE} fetchPolicy="network-only" variables={{ id: Number(this.props.id), to: Number(this.state.user.user.id) }}>
          {this.renderQueryMessage}
        </Query>
      </div>
    )
  }

  renderFooter = (update: MutationFunction) => {
    return (
      <div className="footer">
        <img src={this.state.image} alt="" style={{ width: 100, height: 100 }} />
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
            onKeyPress={(e) => {
              if (e.keyCode === 13) {
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
    if (this.state.user.user === undefined) {
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
    if (this.props.hasChange) {
      refetch();
      this.onUpdateSeen();
    }

    var ele = document.getElementById("list-message");

    ele!.scrollTo({
      left: 0,
      top: ele!.scrollHeight,
      behavior: 'smooth'
    });

    return (
      <div className="block">
        {
          data.getMessage.map((x: any, i: number) => {
            if (x.sender === Number(this.props.id)) {
              return (
                <div key={i} className="me">
                  <sub>{moment(new Date(x.created_at * 1)).fromNow()}</sub>
                  {this.renderBlockContent(x.type, x.content, x.picture)}
                </div>
              )
            }
            else {
              return (
                <div key={i} className="you">
                  {this.renderBlockContent(x.type, x.content, x.picture)}
                  <sub>{moment(new Date(x.created_at * 1)).fromNow()}</sub>
                </div>
              )
            }
          })
        }
      </div>
    )
  }

  renderUploadFile() {
    return (
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

  renderBlockContent(type: string, content: string, image: string) {
    console.log(type);
    switch (type) {
      case "text":
        return <span>{content}</span>
      case "image":
        return <span style={{ padding: 0 }}> <img src={image} alt="" /> </span>
      case "textPic":
        return <span style={{ padding: 0 }}>
          <img src={image} alt="" style={{
            borderRadius: '7px 7px 0 0'
          }} />
          <br />
          <span
            style={{
              padding: 10,
              width: '30%',
              maxWidth: '30%',
              margin: 0,
              borderRadius: '0 0 7px 7px',
              display: 'inline-block',
              textAlign: 'start'
            }}>
            {content}
          </span>
        </span>
    }
  }
}