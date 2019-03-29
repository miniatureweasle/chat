import React from 'react';
import Message from './Message.js';
import ReactDOM from 'react-dom';

class MessageList extends React.Component {
   constructor() {
    super()
    this.getMessageStyleClassName.bind(this)
  }
    
  componentWillUpdate() {
    const node = ReactDOM.findDOMNode(this);
    this.shouldScrollToBottom =
      node.scrollTop + node.clientHeight + 200 >= node.scrollHeight;
  }

  componentDidUpdate() {
    if (this.shouldScrollToBottom) {
      const node = ReactDOM.findDOMNode(this);
      node.scrollTop = node.scrollHeight;
    }
  }
    
  getMessageStyleClassName(message){
      if (message.authorId == this.props.authorId){
          return 'bubble-right'
      }
      return 'bubble-left'
  }

  render() {
    return (
      <div className="message-list">
        {this.props.messages.map((message, index) => {
          return (
            <Message
              key={message.id}
              username={message.authorName}
              text={message.text}
              time={message.time}
              bubbleStyle={this.getMessageStyleClassName(message)}
            />
          );
        })}
      </div>
    );
  }
}

export default MessageList;
