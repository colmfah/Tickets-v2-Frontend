import React from 'react'
import axios from "axios";
import Nav from "./Nav";

class ChangePassword extends React.Component {

	state = {
        password: '',
        message: '',
        displaySpinner: false
	}

    componentDidMount(){
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
        let token = localStorage.getItem("token");
        axios.patch(`${process.env.REACT_APP_API}/updateUser`, {token: token, change: {password: this.state.password}}).then(res => {
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
            <form className="check-in-form" onSubmit={(event) => this.submit(event)}>
                <div className="check-in-heading">
                    <header>Change Password</header>
                    <hr />
                </div>
                <input 
                    value={this.state.password} 
                    required 
                    onChange={event => this.changeField(event, 'password')} 
                    type='password'
                    placeholder ='New Password'
                />
                <div className="check-in-spinner-message" id="log-in-spinner-message">
                <div style={this.spinnerVisibility()} className ='ticket-spinner'>
                    <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div> 
                </div>
                <div className="log-in-message">{this.state.message}</div>
                </div>                
                <button id="log-in-button">Change Password</button>
            </form>
		</div>
		)
}
}

export default ChangePassword