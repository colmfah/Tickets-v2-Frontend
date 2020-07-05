import React from 'react'
import axios from "axios";
import Nav from "./Nav";

class ChangePassword extends React.Component {

	state = {
        password: '',
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
        let token = localStorage.getItem("token");
        axios.patch(`${process.env.REACT_APP_API}/updateUser`, {token: token, change: {password: this.state.password}}).then(res => {
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
                    <label>New Password</label>
                    <input value={this.state.password} required onChange={event => this.changeField(event, 'password')} type='password'/>
                    <button>Change Password</button>
                </form>

                <div>{this.state.message}</div>

			</>
		)
}
}

export default ChangePassword