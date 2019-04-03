import React from 'react';

function Message(props) {
  return (
    <div className="speech-wrapper">
      <div className={props.bubbleStyle}>
        <div className="txt">
          <p className="name">{props.username}</p>
          <p className="message">{props.text}</p>
          <span className="span" className="timestamp">{props.time}</span>
        </div>
        <div className="bubble-arrow" />
      </div>
    </div>
  );
}

export default Message;
