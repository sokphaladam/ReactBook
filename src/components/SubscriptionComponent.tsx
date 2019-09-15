import React from 'react';
import { gql, DocumentNode } from 'apollo-boost';
import { Subscription, OnSubscriptionDataOptions } from 'react-apollo';

const SUB_COMMENT = gql`
subscription{
  CommentSubscription
}
`;

const SUB_LOVE = gql`
subscription{
  LoveSubscription
}
`;

type Props = {
  hasChange: (e: boolean) => any;
}

export class SubscriptionComponent extends React.Component<Props> {
  
  constructor(props: Props){
    super(props);
  }

  onSubscriptionData = (option: OnSubscriptionDataOptions) => {
    if(
        option.subscriptionData.data.LoveSubscription === true ||
        option.subscriptionData.data.CommentSubscription === true
      )
      {
        this.props.hasChange(true);
      }
    setTimeout(() => {
      this.props.hasChange(true);
    }, 500)
  }

  render(){
    return(
      <div>
        {this.renderSubscription(SUB_LOVE)}
        {this.renderSubscription(SUB_COMMENT)}
      </div>
    )
  }

  renderSubscription(subscription: DocumentNode){
    return(
      <Subscription subscription={subscription} fetchPolicy='network-only' onSubscriptionData={this.onSubscriptionData}></Subscription>
    )
  }
}