import React from 'react';
import { gql } from 'apollo-boost';
import { Query, Mutation, MutationFunction } from 'react-apollo';
import monent from 'moment';
import { ModalComponent } from '../../components/ModalComponent';
import { CommentScreen } from './CommentScreen';

const QUERY_BOOK_LIST = gql`
query getBookList{
  getBookList{
    id,
    title,
    picture,
    love,
    comment,
    created_at,
   	updated_at,
    isLove,
    user{
      first_name,
      last_name,
      picture
    }
  }
}
`;

const MUTATION_LOVE = gql`
mutation createLove($id: Int!){
  createLove(id: $id)
}
`;

const MUTATION_UPLOAD = gql`
mutation singleUpload($file: Upload!){
  singleUpload(file: $file)
}
`;

type Props = {
  hasChange: boolean;
  picture: string;
}

export class PageScreen extends React.Component<Props> {

  uploadInput: any;

  state: {
    isUpdate: boolean;
    show: boolean;
    id: number;
    data: any[];
    image: string;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      isUpdate: this.props.hasChange,
      show: false,
      id: 0,
      data: [],
      image: ''
    }
  }

  onCompletedComment = (data: any) => {
    this.setState({ data: data.getCommentList })
  }

  onMutationUploadCompleted = (data: any) => {
    console.log(data);
  }

  render() {
    return (
      <div>
        <ModalComponent title='Comment' show={this.state.show} statusModal={(e) => this.setState({ show: e })}>
          <CommentScreen show={this.state.show} hasChange={this.props.hasChange} id={this.state.id} />
        </ModalComponent>
        <div className="row">
          <Query query={QUERY_BOOK_LIST} fetchPolicy="network-only">
            {this.renderQueryBookList}
          </Query>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                Coming Soon!
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderQueryBookList = ({ data, loading, refetch }: any) => {
    if (loading) return <div>Loading....</div>
    if (this.props.hasChange) refetch();
    return (
      <div className="col-md-9">
        <div className="card">
          <div className="card-body">
            <div className="comment-form" style={{ display: 'flex', height: 'auto' }}>
              <img src={this.props.picture} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />
              <input type="text" placeholder="What's on your mind?" className="form-control" />
              {this.renderUploadMutation()}        
              <button type="button" style={{ fontSize: 20, marginRight: 10 }} onClick={()=>this.uploadInput.click()}>
                <i className="fas fa-image" style={{ color: '#999999' }}></i>
              </button>
              <button type="button" style={{ fontSize: 20, marginRight: 10 }}>
                <i className="fas fa-paper-plane" style={{ color: '#999999' }}></i>
              </button>
            </div>
          </div>
        </div>
        {
          data.getBookList.map((e: any) => this.renderCard(e))
        }
      </div>
    )
  }

  renderUploadMutation(){
    return(
      <Mutation mutation={MUTATION_UPLOAD} fetchPolicy="no-cache" onCompleted={this.onMutationUploadCompleted}>
        {
          (mutation: any) => (
            <input 
              hidden={true} 
              type="file" 
              ref={(ref) => this.uploadInput = ref} 
              onChange={async (e) => {
                e.target.validity.valid && mutation({
                  variables: { file: e.target.files![0] }
                })
              }}/>
          )
        }
      </Mutation>
    )
  }

  renderCard(data: any) {
    const date = new Date(data.created_at * 1);
    return (
      <div className="card" key={data.id}>
        <div className="card-body">
          <div className="card-top">
            <img
              src={data.user.picture}
              alt=""
            />
            <div>
              <h6 className="card-title" style={{ marginBottom: 1 }}>{data.user.first_name} {data.user.last_name}</h6>
              <sub className="card-subtitle text-muted">{monent(date).fromNow()}</sub>
            </div>
          </div>
          <p className="card-text">{data.title}</p>
          <img
            src={data.picture}
            alt=""
            className="card-img"
          />
          {this.renderMutationLove(data.love, data.id, data.isLove)}
          <span className="card-link text-muted" style={{ cursor: 'pointer' }} onClick={() => { this.setState({ show: true, id: data.id }) }}> <i className="far fa-comment-alt" style={{ marginRight: 20 }}></i> {data.comment} </span>
        </div>
      </div>
    )
  }

  renderMutationLove(love: number, id: number, isLove: boolean) {
    return (
      <Mutation mutation={MUTATION_LOVE}>
        {
          (update: MutationFunction) => (
            <span
              className={`card-link ${isLove ? 'text-danger' : 'text-muted'}`}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                update({
                  variables: { id: Number(id) }
                })
              }}
            >
              <i className={`fa${isLove ? 's' : 'r'} fa-heart`} style={{ marginRight: 20 }}></i>
              {love}
            </span>
          )
        }
      </Mutation>
    )
  }
}