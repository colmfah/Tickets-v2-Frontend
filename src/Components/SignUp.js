
import axios from "axios"
import { Link } from "react-router-dom"
import Nav from "./Nav"
import React from "react"

class SignUp extends React.Component {
  state = {
    message: "",
    user: {
      email: "",
      name: "",
      password: "",
    }
  }

  changeField = (e, field) => {
    let user = this.state.user
    user[field] = e.target.value
    this.setState({ user })
  }

  signup = e => {
    e.preventDefault()
    axios.post(`${process.env.REACT_APP_API}/users`, this.state.user).then(res => {       
      this.setState({ message: res.data.message})}).catch(err => {console.log(err)})
  }

  render() {
    return (
      <>
      	<Nav />
					<form onSubmit={this.signup}>
      
            <input
              required
              value={this.state.user.name}
              onChange={event => this.changeField(event, 'name')}
              type={'text'}
              placeholder={'Your Name'}
            />
            <br />

            <input
              required
              value={this.state.user.email}
              onChange={event => this.changeField(event, 'email')}
              type={'email'}
              placeholder={'Email Address'}
            />
            <br />

            <input
              required
              value={this.state.user.password}
              minLength={"8"}
              onChange={event => this.changeField(event, 'password')}
              type={'password'}
              placeholder={'Password'}
            />
            <br />
				

							<button>Sign Up</button>     
				  </form>
            {this.state.message!==''? <div>{this.state.message}</div>: <div>Already Have An Account? <Link to="/login"> Login</Link></div>}
      </>
    )
  }
}

export default SignUp
