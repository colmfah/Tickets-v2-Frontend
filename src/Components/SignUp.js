
import axios from "axios"
import { Link } from "react-router-dom"
import Nav from "./Nav"
import React from "react"
import Footer from "./Footer";

class SignUp extends React.Component {
  state = {
    message: "",
    user: {
      email: "",
      name: "",
      password: "",
    },
    displaySpinner: false,
    disableSignUpButton: false
  }

  changeField = (e, field) => {
    let user = this.state.user
    user[field] = e.target.value
    this.setState({ user })
  }

  signup = e => {
    e.preventDefault()
    let displaySpinner = true
    let message = 'Please Wait'
    let disableSignUpButton = true
    this.setState({displaySpinner, message, disableSignUpButton})
    axios.post(`${process.env.REACT_APP_API}/users`, this.state.user)
    .then(res => {
      message = res.data.message  
      displaySpinner = false
      if(!res.data.success){disableSignUpButton = false}
      if(res.data.success){setTimeout(() => {disableSignUpButton = false; this.setState({disableSignUpButton})}, (5*60*1000))}

      this.setState({ message, displaySpinner, disableSignUpButton})})
    .catch(err => {this.setState({ message: String(err), displaySpinner: false})})
  }

  spinnerVisibility(){
    if(this.state.displaySpinner ){return {'display': 'block'}}
    return {'display': 'none'}
  }

  render() {
    return (
      <>
      
        <Nav/> 
        <div className="check-in-container">             
          <form className="check-in-form" onSubmit={this.signup}>
            <div className="check-in-heading">
                <header>Sign Up</header>
                <hr />
            </div>
            <input
              required
              value={this.state.user.name}
              onChange={event => this.changeField(event, 'name')}
              type={'text'}
              placeholder={'Your Name'}
            />
            <input
              required
              value={this.state.user.email}
              onChange={event => this.changeField(event, 'email')}
              type={'email'}
              placeholder={'Email Address'}
            />
            <input
              required
              value={this.state.user.password}
              minLength={"8"}
              onChange={event => this.changeField(event, 'password')}
              type={'password'}
              placeholder={'Password'}
            />
            <div className="check-in-spinner-message" id="log-in-spinner-message">
              <div style={this.spinnerVisibility()} className ='ticket-spinner'>
                <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div> 
              </div>
              <div className="log-in-message">{this.state.message}</div>
            </div>
            <button 
              id={this.state.disableSignUpButton ?  'disable-purchase-button': 'purchase-button'} 
              disabled={this.state.disableSignUpButton}
            >
              Sign Up
            </button>
            <p className="log-in-links">Already have an account? <Link to="/login">Login</Link> </p>
          </form>
        </div>
        <Footer />
      </>
    )
  }
}



export default SignUp
