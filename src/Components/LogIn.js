import React from "react";
import axios from "axios";
import Nav from "./Nav";
import { Link } from "react-router-dom";

class LogIn extends React.Component {
  state = {
    user: {
      email: "",
      password: ""
    },
    message: ""
  }

  changeField = (e, field) => {
    let user = this.state.user;
    user[field] = e.target.value;
    this.setState({ user });
  }

  login = e => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API}/login`, this.state.user).then(res => {
        let token = res.data.token
        if (token) {
          localStorage.setItem("token", token);
          this.setState({ message: "Logged In" })
          res.data.tempPassword? this.props.history.push({pathname: "/changePassword"}) : this.props.history.push({pathname: "/events"})
        } else{
          this.setState({message: res.data.message})
        }
    })
  }

  render() {
    return (
      <>
      	<Nav />
				<form onSubmit={this.login}>
					<h1>Login</h1>

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
            onChange={event => this.changeField(event, 'password')}
            type={'password'}
            placeholder={'Password'}
					/>
          <br />
					<button>Log In</button>
					<div>{this.state.errorMsg}</div>
					<div>Don't have an account? <Link to="/signup">Sign Up</Link></div>    
					<div><Link to="/forgotPassword">Forgot Your Password?</Link></div>
				</form>
      </>
    );
  }
}

export default LogIn;
