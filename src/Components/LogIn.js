import React from "react";
import axios from "axios";
import Nav from "./Nav";
import { Link } from "react-router-dom";
import '../Styles/Grid.css'
import '../Styles/Cards.css'
import '../Styles/Forms.css'
import '../Styles/Buttons.css'
import '../Styles/Global.css'
import '../Styles/Nav.css'

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
        <div className="grid center middle tall">
          <div></div>
          <div className="card">
            <div class ="content">

              <form onSubmit={this.login}>
                <div className="group">
                  <input
                    required
                    value={this.state.user.email}
                    onChange={event => this.changeField(event, 'email')}
                    type={'email'}
                    placeholder={'Email Address'}
                  />
                </div>

                <div className="group">
                  <input
                    required
                    value={this.state.user.password}
                    onChange={event => this.changeField(event, 'password')}
                    type={'password'}
                    placeholder={'Password'}
                  />
                </div>
              
                <button className="primary" onClick={event => {this.login(event)}}>Log In</button>

                <p className="warning">{this.state.message}</p>
                <p className="footer">Don't have an account? <Link to="/signup">Sign Up</Link>  </p>
                <p className="footer"><Link to="/forgotPassword">Forgot Your Password?</Link></p>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default LogIn;
