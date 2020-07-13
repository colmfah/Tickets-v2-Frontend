import React from 'react'
import axios from "axios";
import Nav from "./Nav";


class ForgotPassword extends React.Component {

	state = {
        email: '',
        message: ''
	}

    changeField = (e, field) => {
        let stateCopy = this.state
        stateCopy[field] = e.target.value
        this.setState(stateCopy)
    }

    submit = (e) => {
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_API}/resetPassword`, {email: this.state.email}).then(res => {
            let stateCopy = this.state
            stateCopy.message = res.data.message
            this.setState(stateCopy)
        })
    }

	render() {
	  return (
			<>  
                <Nav />         
                <form onSubmit={(event) => this.submit(event)}>
                    <label>Email Address</label>
                    <input 
                        required 
                        value={this.state.email} 
                        onChange={event => this.changeField(event, 'email')} 
                        type='email'
                        placeholder={'Email Address'}
                    />
                    <button>Reset Password</button>
                </form>

                <div>{this.state.message}</div>

			</>
		)
}
}

export default ForgotPassword