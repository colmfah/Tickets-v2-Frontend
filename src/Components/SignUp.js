
import axios from "axios"
import { Link } from "react-router-dom"
import Nav from "./Nav"
import React from "react"
import '../Styles/Grid.css'
import '../Styles/Cards.css'
import '../Styles/Forms.css'
import '../Styles/Buttons.css'
import '../Styles/Global.css'
import '../Styles/Nav.css'

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
        <div className="pageGrid2Rows">
          
          <div className="navBar" > <Nav /></div>  
               

          <div className="formColumnGrid">
            <div></div>

            <div className ="formRowGrid">
              <div></div>
              <div className="theForm card">
                <div class ="content">


                  <form onSubmit={this.signup}>
                    <div className="group">
                      <input
                        className = "toggleBorder"
                        required
                        value={this.state.user.name}
                        onChange={event => this.changeField(event, 'name')}
                        type={'text'}
                        placeholder={'Your Name'}
                      />
                    </div>
            
                    <div className="group">
                      <input
                        className = "toggleBorder"
                        required
                        value={this.state.user.email}
                        onChange={event => this.changeField(event, 'email')}
                        type={'email'}
                        placeholder={'Email Address'}
                      />
                    </div>
                
                    <div className="group">
                      <input
                        className = "toggleBorder"
                        required
                        value={this.state.user.password}
                        minLength={"8"}
                        onChange={event => this.changeField(event, 'password')}
                        type={'password'}
                        placeholder={'Password'}
                      />
                    </div>
                
                
                      <button className="primary">Sign Up</button>
                
                  </form>
                  <p className="warning">{this.state.message}</p>
                  <p className="footer">Already have an account? <Link to="/login">Login</Link> </p>

                  
                </div>
              </div>
              <div></div>
            </div>
            <div></div>
          </div>
        </div>
      </>
    )
  }
}

export default SignUp
