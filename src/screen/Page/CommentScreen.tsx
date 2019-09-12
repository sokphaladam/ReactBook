import React from 'react';
import { Query, Mutation, MutationFunction } from 'react-apollo';
import { gql } from 'apollo-boost';
import moment from 'moment';

const QUERY_COMMENT = gql`
query getCommentList($id: Int!){
  getCommentList(book_id: $id){
    id,
    book_id,
    user{
      first_name,
      last_name,
      picture
    },
    book{
      picture
    },
    comment,
    created_at,
    updated_at
  }
}
`;

const MUTATION_COMMENT = gql`
mutation createComment($data: CommentInput!){
  createComment(data: $data)
}
`;

type Props = {
  id: number;
  hasChange: boolean;
  show: boolean;
}

export class CommentScreen extends React.Component<Props>{

  state: {
    commentInput: string;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      commentInput: ''
    }
  }

  onChangeCommentInput = (e: any) => {
    this.setState({ commentInput: e.target.value });
  }

  onCompletedMutationComment = (data: any) => {
    if (data.createComment) {
      this.setState({ commentInput: '' });
    }
  }

  render() {
    return (
      <div>
        <div className="modal-body">
          <Query
            query={QUERY_COMMENT}
            variables={{ id: Number(this.props.id) }}
            fetchPolicy="network-only"
            skip={!this.props.show}
          >
            {this.renderQueryComment}
          </Query>
        </div>
        <div className="modal-footer">
          {this.renderMutation()}
        </div>
      </div>
    )
  }

  renderQueryComment = ({ loading, data, refetch }: any) => {

    if (loading) return <div>Loading...</div>

    if (this.props.hasChange) refetch();

    const items: any[] = data == null ? [] : data.getCommentList;

    return (
      <ul className="list-comment">
        {
          items.map((e: any) => (
            <li key={e.id}>
              <img src={e.user.picture} alt="" />
              <div>
                <h6>{e.user.first_name} {e.user.last_name}</h6>
                <sub className="text-muted">{moment(new Date(e.created_at * 1)).fromNow()}</sub>
                <p>{e.comment}</p>
              </div>
            </li>
          ))
        }
      </ul>
    )
  }

  renderMutation() {
    return (
      <Mutation mutation={MUTATION_COMMENT} onCompleted={this.onCompletedMutationComment}>
        {this.renderFormComment}
      </Mutation>
    )
  }

  renderFormComment = (update: MutationFunction) => {
    return (
      <div className="comment-form">
        <input
          type="text"
          placeholder="Comment here..."
          className="form-control"
          value={this.state.commentInput}
          onChange={this.onChangeCommentInput}
        />
        <button
          type="button"
          onClick={() => {
            update({
              variables: {
                data: {
                  book_id: Number(this.props.id),
                  comment: this.state.commentInput
                }
              }
            })
          }}
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    )
  }
}