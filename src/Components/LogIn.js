import React from "react";
import axios from "axios";
import Nav from "./Nav";
import { Link } from "react-router-dom";
import Footer from "./Footer";

import '../Styles/LogIn.css'

class LogIn extends React.Component {
  state = {
    user: {
      email: "",
      password: ""
    },
    message: "",
    displaySpinner: false
  }

  changeField = (e, field) => {
    let user = this.state.user;
    user[field] = e.target.value;
    this.setState({ user });
  }

  login(event){  
    event.preventDefault()
    let displaySpinner = true
    let message = `Logging In. Please Wait...`
    this.setState({displaySpinner, message})
    axios.post(`${process.env.REACT_APP_API}/login`, this.state.user).then(res => {

        let token = res.data.token
        if (token) {
          localStorage.setItem("token", token);
          res.data.tempPassword? this.props.history.push({pathname: "/changePassword"}) : this.props.history.push({pathname: "/events"})
        } else{ 
          displaySpinner = false
          this.setState({displaySpinner})         
          this.setState({message: res.data.message})
        }
    })
  }

  spinnerVisibility(){
    if(this.state.displaySpinner ){return {'display': 'block'}}
    return {'display': 'none'}
  }


  render() {
    return (
      <>
      
        <Nav />
        <div className="check-in-container">
          <form className="check-in-form" onSubmit={event => this.login(event)}>
            <div className="check-in-heading">
              <header>Log In</header>
              <hr />
            </div>
            
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

            <button id="log-in-button">Log In</button>
            
            <p className="log-in-links">Don't have an account? <Link to="/signup">Sign Up</Link>  </p>
            <p className="log-in-links"><Link to="/forgotPassword">Forgot Your Password?</Link></p>
          </form>
          </div>
          <Footer />
        </>

    )
  }
}

export default LogIn;
