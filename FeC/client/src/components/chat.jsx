import React from "react";
import axios from "axios";
import MessagesView from "../components/messagesView.jsx";

//should adjust to local machine's public IP during deployment 
// let proxy = process.env.PUBLIC_IP 
let proxy = '52.206.160.77'


/////////////////
///  Chat  //////
/////////////////
// Following component renders a Chat module as an overlay on the current page
 
/////////////////
///  Props    ///
/////////////////
// Has following props: host [firstName%20lastName] and handleCloseChatX() method responsible for closing the module

/////////////////
///  Methods  ///
/////////////////
/// 1. On mount, it makes an axios request to get the message history [.get(`/contact/firstName%20lastName/message`)] and sets the state to results to render history
/// 2. On change of the input text --> sets the state of the current input
/// 3. Post message takes this input [step 2] and sets the body of the post request to be that input along with setting the toHost property to host from props...
/// ... After that it retrieves the message history to render as chat


class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      messageText: ""
    };

    this.getMessages = this.getMessages.bind(this);
    this.onChange = this.onChange.bind(this);
    this.postMessage = this.postMessage.bind(this);
  }

  componentDidMount() {
    this.getMessages();
  }

  getMessages() {
    let host = this.props.host;
    axios
      .get(`http://acc32e4826dd011e9aeee02f7ff798c2-521621316.us-east-1.elb.amazonaws.com:8085/contact/${host}/message`) // add absolute path EC2. For kubernetes add service address
      .then(data => {
        this.setState({
          messages: data.data 
        });
      })
      .catch(err => console.error(err));
  }

  onChange(e) {
    this.setState({
      messageText: e.target.value
    });
  }

  postMessage(e) {
    e.preventDefault();

    let host = this.props.host;
    let message = this.state.messageText;

    axios({
      url: `http://acc32e4826dd011e9aeee02f7ff798c2-521621316.us-east-1.elb.amazonaws.com:8085/contact/${host}/message`, // add absolute path EC2. For kubernetes add service address
      method: "post",
      data: { /// sets the body of the request 
        messageBody: message,
        toHost: host
      }
    }).then(() => {
      this.getMessages();
    })
  }

  render() {
    return (

      <div>
        <span className="mostOfTheTextOnPage">
          <b>Send a message to host</b>
        </span>

        <button className="closeChat" onClick={this.props.handleCloseChatX}>
          x
        </button>

        <div className="chatView">
          <MessagesView messages={this.state.messages} />
        </div>

        <form onSubmit={this.postMessage}>
          <input  className = "inputForMessageToSend" onChange={this.onChange} placeholder = 'Your message here' />
          <button className = "sendMessageButton"> Send </button>
        </form>
      </div>
    );
  }
}

export default Chat;
