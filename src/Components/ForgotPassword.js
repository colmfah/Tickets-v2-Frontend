import React from 'react'
import axios from "axios";
import Nav from "./Nav";
import Footer from "./Footer";
import '../Styles/ForgotPassword.css'


class ForgotPassword extends React.Component {

	state = {
        email: '',
        message: '',
        displaySpinner: false
	}

    changeField = (e, field) => {
        let stateCopy = this.state
        stateCopy[field] = e.target.value
        this.setState(stateCopy)
    }

    submit = (e) => {
        e.preventDefault()
        let displaySpinner = true
        this.setState({displaySpinner})
        axios.post(`${process.env.REACT_APP_API}/resetPassword`, {email: this.state.email}).then(res => {
            let message = res.data.message
            displaySpinner = false
            this.setState({message, displaySpinner})
        })
    }

    spinnerVisibility(){
        if(this.state.displaySpinner ){return {'display': 'block'}}
        return {'display': 'none'}
      }

	render() {
	  return (
        <div className="check-in-container">
            <Nav />         
            <form className="check-in-form forgot-password-form" onSubmit={(event) => this.submit(event)}>
                <div className="check-in-heading">
                    <h2>Forgot Password</h2>
                    <hr />
                </div>
                <input 
                    required 
                    value={this.state.email} 
                    onChange={event => this.changeField(event, 'email')} 
                    type='email'
                    placeholder={'Email Address'}
                />
                <div className="check-in-spinner-message" id="log-in-spinner-message">
                    <div style={this.spinnerVisibility()} className ='ticket-spinner'>
                        <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div> 
                    </div>
                    <div className="log-in-message">{this.state.message}</div>
                </div>
                <button id="log-in-button">Reset Password</button>
            </form>
            <Footer />
		</div>
	)
}
}

export default ForgotPassword