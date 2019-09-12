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

type Props = {
  hasChange: boolean;
}

export class PageScreen extends React.Component<Props> {

  state: {
    isUpdate: boolean;
    show: boolean;
    id: number;
    data: any[];
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      isUpdate: this.props.hasChange,
      show: false,
      id: 0,
      data: []
    }
  }

  onCompletedComment = (data: any) => {
    this.setState({ data: data.getCommentList })
  }

  render() {
    return (
      <div>
        <ModalComponent title='Comment' show={this.state.show} statusModal={(e) => this.setState({ show: e })}>
          <CommentScreen show={this.state.show} hasChange={this.props.hasChange} id={this.state.id}/>
        </ModalComponent>
        <Query query={QUERY_BOOK_LIST} fetchPolicy="network-only">
          {this.renderQueryBookList}
        </Query>
      </div>
    )
  }

  renderQueryBookList = ({ data, loading, refetch }: any) => {
    if (loading) return <div>Loading....</div>
    if (this.props.hasChange) refetch();
    return (
      <div className="card-columns">
        {
          data.getBookList.map((e: any) => this.renderCard(e))
        }
      </div>
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
          <i className="card-link text-muted" style={{ cursor: 'pointer' }} onClick={() => { this.setState({ show: true, id: data.id }) }}> <i className="far fa-comment-dots" style={{ marginRight: 20 }}></i> {data.comment} </i>
        </div>
      </div>
    )
  }

  renderMutationLove(love: number, id: number, isLove: boolean) {
    return (
      <Mutation mutation={MUTATION_LOVE}>
        {
          (update: MutationFunction) => (
            <i
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
            </i>
          )
        }
      </Mutation>
    )
  }
}