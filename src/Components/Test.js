import React from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import QrReader from "react-qr-reader";
import "../Styles/Tickets.css";
import axios from "axios";


class Test extends React.Component {

  state = {
    errorMessage: '',
    fileName: '',
    image: '',
    emails: '',
    message: 'message',
    ticketsSought: 0,
    userEvent: ''
}

dataToSend(){
  return {
    emails: this.state.emails
  }
}



  send(event){
    console.log('sned')
    event.preventDefault()
    axios.post(`${process.env.REACT_APP_API}/test`, this.dataToSend()).then(res => {
      console.log('res', res)
      let message = res.data.message
      this.setState({message})
    })

  }

  changeEmail(event){
    event.preventDefault()
    console.log('target',event.target)
    console.log('target.value',event.target.value)
    let emails = this.state.emails
    emails = event.target.value
    this.setState({emails})
  }

  changeField(event, field){
    event.preventDefault()
    let stateCopy = this.state
    stateCopy[field] = event.target.value
    this.setState(stateCopy)
  }

  


  render() {
    return (
      <>



        <input
            required
            value={this.state.emails}
            onChange={event => this.changeEmail(event)}
            type='text'
            placeholder='Emails'
        />
        <button onClick={event => this.send(event)}>Contact Back End</button>
        {this.state.message}
 

      </>
      
    )    
  }
}

export default Test;