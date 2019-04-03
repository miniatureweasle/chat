import React from 'react'
import InputBox from './components/InputBox.js'
import MessageList from './components/MessageList.js'
import Title from './components/Title.js'
import Modal from 'react-modal'

const popupStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

Modal.setAppElement('#root')

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      history: [],
      modalOpen: true,
      authorName: ''
    }
    this.sendMessage = this.sendMessage.bind(this)
    this.receiveMessage = this.receiveMessage.bind(this)

    this.openModal = this.openModal.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind(this)
    this.closeModal = this.closeModal.bind(this)

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    const socket = new WebSocket('ws://localhost:8081')
    socket.onmessage = this.receiveMessage
    this.setState({
      socket: socket,
      authorId: Math.random()
    })
  }

  openModal() {
    this.setState({
      modalOpen: true
    })
  }

  afterOpenModal() {
    this.subtitle.style.color = '#37445b'
  }

  closeModal() {
    this.setState({
      modalOpen: false
    })
  }

  receiveMessage(event) {
    const history = JSON.parse(event.data).data
    const msg = JSON.parse(event.data)
    if (msg.type == 'history') {
      this.setState({
        history: history
      })
    }
  }

  sendMessage(text) {
    const msg = {
      text: text,
      authorId: this.state.authorId,
      authorName: this.state.authorName
    }
    this.state.socket.send(JSON.stringify(msg))
  }

  handleChange(e) {
    this.setState({
      authorName: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    if (this.state.authorName.length > 0) {
      this.closeModal()
    }
  }

  render() {
    return (
      <div className="app">
        // capture the user's name first
        <Modal
          isOpen={this.state.modalOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={popupStyle}
          contentLabel="Username Input"
        >
          <h2 ref={subtitle => (this.subtitle = subtitle)}>Enter your name</h2>
          <form>
            <input
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              value={this.state.authorName}
              type="text"
            />
          </form>
          <button onClick={this.handleSubmit}> Join </button>
        </Modal>
        <Title />
        <MessageList authorId={this.state.authorId} messages={this.state.history} />
        <InputBox sendMessage={this.sendMessage} />{' '}
      </div>
    )
  }
}

export default App
