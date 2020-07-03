import React from 'react'
import axios from "axios";


class ForgotPassword extends React.Component {

	state = {
        email: '',
        message: ''
	}


    componentDidMount(){

    }

    changeField = (e, field) => {
        let stateCopy = this.state
        stateCopy[field] = e.target.value
    }

    submit = () => {
        let token = localStorage.getItem("token")
        axios.post(`${process.env.REACT_APP_API}/resetPassword`, {token: token})}

    }

	render() {
	  return (
			<>           
                <form onSubmit={this.submit}>
                    <label>Email Address</label>
                    <input value={this.state.email} required onChange={event => this.changeField(event, 'email')} type='email'/>
                    <button>Reset Password</button>
                </form>

                <div>{this.state.message}</div>

			</>
		)
}
}

export default ForgotPassword