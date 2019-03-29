import React from 'react';

class Sendor extends React.Component {
  constructor() {
    super();
    this.state = {
      message: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      message: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      message: ''
    });
    this.props.sendMessage(this.state.message);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="send-message-form">
        <input
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          value={this.state.message}
          placeholder="Type and hit enter"
          type="text"
        />
      </form>
    );
  }
}

export default Sendor;
