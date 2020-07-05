import React from 'react'
import axios from "axios";
import Nav from "./Nav";


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
        this.setState(stateCopy)
    }

    submit = (e) => {
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_API}/resetPassword`, {email: this.state.email}).then(res => {
            console.log('res.data', res.data);
            
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
                    <input value={this.state.email} required onChange={event => this.changeField(event, 'email')} type='email'/>
                    <button>Reset Password</button>
                </form>

                <div>{this.state.message}</div>

			</>
		)
}
}

export default ForgotPassword