import React from 'react';
import { Mutation, MutationFunction } from 'react-apollo';
import { gql } from 'apollo-boost';

const MUTATION_UPLOAD = gql`
mutation singleUpload($file: Upload!){
  singleUpload(file: $file)
}
`;

const MUTATION_CREATE_BOOK = gql`
mutation createBook($data: BookInput!){
  createBook(data: $data)
}
`;

type Props = {
  picture: string;
}

export class FormPostComponent extends React.Component<Props> {

  uploadInput: any;

  state: {
    textInput: string;
    picture: string[];
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      textInput: '',
      picture: []
    }
  }

  onMutationUploadCompleted = (data: any) => {
    this.setState({ picture: [...this.state.picture, data.singleUpload] });
  }

  onMutationCreateBookComplete = (data: any) => {
    if (data.createBook === true) {
      this.setState({
        textInput: '',
        picture: []
      })
    }
  }

  onChangeInput = (e: any) => {
    this.setState({ textInput: e.target.value });
  }

  onSubmit = (e: any, update: MutationFunction) => {
    e.preventDefault();
    update({
      variables: {
        data: {
          title: this.state.textInput,
          picture: this.state.picture
        }
      }
    })
  }

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <Mutation mutation={MUTATION_CREATE_BOOK} onCompleted={this.onMutationCreateBookComplete}>
            {
              (update: MutationFunction) => (
                <form className="comment-form" style={{ display: 'flex', height: 'auto' }} onSubmit={(e) => this.onSubmit(e, update)}>
                  <img src={this.props.picture} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                  <input type="text" placeholder="What's on your mind?" className="form-control" value={this.state.textInput} onChange={this.onChangeInput} />
                  {this.renderUploadMutation()}
                  <button type="button" style={{ fontSize: 20, marginRight: 10 }} onClick={() => this.uploadInput.click()}>
                    <i className="fas fa-image" style={{ color: '#999999' }}></i>
                  </button>
                  <button type="submit" style={{ fontSize: 20, marginRight: 10 }}>
                    <i className="fas fa-paper-plane" style={{ color: '#999999' }}></i>
                  </button>
                </form>
              )
            }
          </Mutation>
          {this.renderImage()}
        </div>
      </div>
    )
  }

  renderUploadMutation() {
    return (
      <Mutation mutation={MUTATION_UPLOAD} fetchPolicy="no-cache" onCompleted={this.onMutationUploadCompleted}>
        {
          (mutation: MutationFunction) => (
            <input
              hidden={true}
              type="file"
              multiple={true}
              ref={(ref) => this.uploadInput = ref}
              onChange={async (e) => {
                for (let i = 0; i < e.target.files!.length; i++) {
                  mutation({
                    variables: { file: e.target.files![i] }
                  })
                }
              }} />
          )
        }
      </Mutation>
    )
  }

  renderImage() {
    if (this.state.picture.length === 0) {
      return <i></i>
    }
    else {
      return (
        <div style={{ flexDirection: 'row', flexWrap: 'wrap', display: 'flex', marginTop: 25 }}>
          {
            this.state.picture.map((e: any, i: number) => (
              <div
                style={{
                  position: 'relative',
                  width: 150,
                  height: 150,
                  borderRadius: 10,
                  marginRight: 10,
                  marginBottom: 10,
                  backgroundImage: `url(${e})`,
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover'
                }}
                key={i}
              >
                <i
                  className="far fa-times-circle"
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    color: 'red',
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    fontSize: 18,
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    let picture = this.state.picture;
                    picture.splice(i, 1);
                    this.setState({ picture });
                  }}
                ></i>
              </div>
            ))
          }
        </div>
      )
    }
  }
}