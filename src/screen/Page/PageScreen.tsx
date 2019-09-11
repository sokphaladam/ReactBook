import React from 'react';
import { gql } from 'apollo-boost';
import { Query, Subscription, OnSubscriptionDataOptions, Mutation, MutationFunction } from 'react-apollo';
import monent from 'moment';

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

const SUBSCRIPTION_LOVE = gql`
  subscription{
    LoveSubscription
  }
`;

const SUBSCRIPTION_COMMENT = gql`
subscription{
  CommentSubscription
}
`;

export class PageScreen extends React.Component {

  state: {
    isUpdate: boolean;
  }

  constructor(props: any) {
    super(props);
    this.state = {
      isUpdate: false
    }
  }

  onSubscriptionData = (option: OnSubscriptionDataOptions<any>) => {
    if (option.subscriptionData.data.LoveSubscription === true || option.subscriptionData.data.CommentSubscription === true) {
      this.setState({ isUpdate: option.subscriptionData.data.LoveSubscription });
    }
    setTimeout(() => {
      this.setState({ isUpdate: false })
    }, 100)
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-5">
          {this.renderSubcriptionLove()}
          <Query query={QUERY_BOOK_LIST} fetchPolicy="network-only">
            {this.renderQueryBookList}
          </Query>
        </div>
        <div className="col-md-1" />
      </div>
    )
  }

  renderQueryBookList = ({ data, loading, refetch }: any) => {
    if (loading) return <div>Loading....</div>
    if (this.state.isUpdate) refetch();
    return (
      <div>
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
              <h6 className="card-title">{data.user.first_name} {data.user.last_name}</h6>
              <b className="card-subtitle text-muted">{monent(date).fromNow()}</b>
            </div>
          </div>
          <p className="card-text">{data.title}</p>
          <img
            src={data.picture}
            alt=""
            className="card-img"
          />
          {this.renderMutationLove(data.love, data.id, data.isLove)}
          <i className="card-link text-muted"> <i className="far fa-comment-dots" style={{ marginRight: 20 }}></i> {data.comment} </i>
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
              className={`card-link ${isLove ? 'text-danger': 'text-muted'}`}
              style={{ cursor: 'pointer' }}
              onClick={() => { 
                update({
                  variables: {id: Number(id)}
                }) 
              }}
            >
              <i className={`fa${isLove ? 's':'r'} fa-heart`} style={{ marginRight: 20 }}></i>
              {love}
            </i>
          )
        }
      </Mutation>
    )
  }

  renderSubcriptionLove() {
    return (
      <Subscription subscription={SUBSCRIPTION_LOVE} fetchPolicy='network-only' onSubscriptionData={this.onSubscriptionData}>
        {
          ({ data, loading }: any) => <i />
        }
      </Subscription>
    )
  }

  renderSubcriptionComment() {
    return (
      <Subscription subscription={SUBSCRIPTION_COMMENT} fetchPolicy='network-only' onSubscriptionData={this.onSubscriptionData}>
        {
          ({ data, loading }: any) => <i />
        }
      </Subscription>
    )
  }
}