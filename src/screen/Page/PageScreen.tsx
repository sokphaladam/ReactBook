import React from 'react';
import { gql } from 'apollo-boost';
import { Query, Mutation, MutationFunction } from 'react-apollo';
import monent from 'moment';
import { ModalComponent } from '../../components/ModalComponent';
import { CommentScreen } from './CommentScreen';
import { FormPostComponent } from '../../components/FormPostComponent';
import { StoriesScreen } from './StoriesScreen';
import { EventScreen } from './EventScreen';
import { DotMenuComponent } from '../../components/DotMenuComponent';
import { FriendRequestScreen } from './FriendRequestScreen';
import { ContentLoaderComponent } from '../../components/ContentLoaderComponent';

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
  picture: string;
}

export class PageScreen extends React.Component<Props> {

  uploadInput: any;
  linkDownload: any;

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

  render() {
    return (
      <div>
        <ModalComponent title='Comment' show={this.state.show} statusModal={(e) => this.setState({ show: e })}>
          <CommentScreen show={this.state.show} hasChange={this.props.hasChange} id={this.state.id} />
        </ModalComponent>
        <div className="row">
          <div className={`col-md-${window.innerWidth <= 1280 ? '12' : '9'}`}>
            <Query query={QUERY_BOOK_LIST} fetchPolicy="network-only">
              {this.renderQueryBookList}
            </Query>
          </div>
          <div className="col-md-3" style={{ display: window.innerWidth <= 1280 ? 'none' : '' }}>
            <div className="card">
              <div className="card-body">
                <StoriesScreen />
                <EventScreen />
                <FriendRequestScreen />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderQueryBookList = ({ data, loading, refetch }: any) => {
    if (loading) return <div><ContentLoaderComponent type="POST" /></div>
    if (this.props.hasChange) refetch();
    return (
      <div>
        <FormPostComponent picture={this.props.picture} />
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
            <DotMenuComponent image={data.picture} />
          </div>
          <p className="card-text">{data.title}</p>
          <div className="row">
            {this.renderImage(data.picture)}
          </div>
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

  renderImage(picture: string[]) {
    switch (picture.length % 2) {
      case 0:
        return picture.map((e: any, i: number) => <img className="card-img col-sm-6" src={e} key={i} style={{ height: 400, borderRadius: 10, cursor: 'pointer' }} alt="" />)
      default:
        if (picture.length > 2 && picture.length < 4) {
          return picture.map((e: any, i: number) => <img alt="" className={`card-img col-sm-${i === 0 ? '12' : '6'}`} src={e} key={i} style={{ height: i === 0 ? 450 : 350, borderRadius: 10 }} />)
        }
        else if (picture.length > 4) {
          return picture.map((e: any, i: number) => <img alt="" className={`card-img col-sm-${i === 0 ? '12' : '3'}`} src={e} key={i} style={{ height: i === 0 ? 450 : 200, borderRadius: 10 }} />)
        }
        else {
          return picture.map((e: any, i: number) => <img alt="" className={`card-img col-sm-12}`} src={e} key={i} style={{ height: i === 0 ? 450 : 350, borderRadius: 10 }} />)
        }
    }
  }
}