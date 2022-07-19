import React, { Component } from 'react'
import Nav from "./Nav";
import Footer from "./Footer";
import './../Styles/CreateEvent.css'
import axios from "axios";


export class ContactUs extends Component {

    state= {        
        name: '',
        email: '',
        phone: '',
        messageSubject: '',
        message: '',  
        textAreaHeight: '100px',
        messageForUser: '',
        displaySpinner: false
    }

    componentDidMount(){
  
    }


    handleFieldChange(event, field){
        let stateCopy = this.state
        stateCopy[field] = event.target.value
        this.setState(stateCopy)
    }

    handleTextAreaChange(e){
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`; 
        this.handleFieldChange(e, 'message')
      }
    


    spinnerVisibility(){
        if(this.state.displaySpinner ){return {'display': 'block'}}
        return {'display': 'none'}
    }

    sendMessage(event){
        event.preventDefault()
        let displaySpinner = true
        let messageForUser = ''
        this.setState({displaySpinner, messageForUser})

        axios.post(`${process.env.REACT_APP_API}/contactUs`, this.state).then(res => {
            let displaySpinner = false
            this.setState({displaySpinner})
            if(res.data.success === true){
                let messageForUser = 'Your message has been sent'
                this.setState({messageForUser})
                return
            }
            let messageForUser = 'There was an error sending your message. Please try again later'
            this.setState({messageForUser})

       })

    }
    



    
    render() {
      

        return (
            <div className="create-event-container">
            <Nav />
            <form className="create-event-form contact-us-form">
                <div className="create-event-heading">
                    <header>Contact Us</header>
                    <hr />
                </div>    
                <input
                    required
                    value={this.state.name}
                    onChange={event => this.handleFieldChange(event, 'name')}
                    type='text'
                    placeholder='Your Name'
                />
                <input
                    required
                    value={this.state.email}
                    onChange={event => this.handleFieldChange(event, 'email')}
                    type='email'
                    placeholder='Your Email Address'
                />
                <input
                    required
                    value={this.state.phone}
                    onChange={event => this.handleFieldChange(event, 'phone')}
                    type='text'
                    placeholder='Your Phone Number (optional)'
                />
                <input
                    required
                    value={this.state.messageSubject}
                    onChange={event => this.handleFieldChange(event, 'messageSubject')}
                    type='text'
                    placeholder='Message Subject'
                />
                <textarea
                    value={this.state.message}
                    required
                    minLength="6"
                    onChange={event => this.handleTextAreaChange(event)}
                    type='text'
                    placeholder='Your Message'
                />
                <div style={this.spinnerVisibility()}   className ='ticket-spinner'>
                    <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                </div>
                <div>{this.state.messageForUser}</div>
                <button className="create-event-button" onClick={(event) => this.sendMessage(event)}>Send</button>
                </form>
                <Footer />
            </div>
  
        )
    }
}

export default ContactUs
