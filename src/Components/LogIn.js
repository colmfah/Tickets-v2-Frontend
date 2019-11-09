import React from "react";
import axios from "axios";
import Nav from "./Nav";
import backgroundDefault from "../images/background-default.jpg";
import "../Styles/Form.css";
import { Link } from "react-router-dom";

class LogIn extends React.Component {
  state = {
    formFields: [
      { label: "Email", type: "email", value: "email" },
      { label: "Password", type: "password", value: "password" }
    ],

    user: {
      email: "",
      password: ""
    },

    errorMsg: ""
  };

  changeField = (e, field) => {
    let user = this.state.user;
    user[field] = e.target.value;
    this.setState({ user });
  };

  login = e => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API}/login`, this.state.user)
      .then(res => {
        let token = res.data.token;
        if (token) {
          localStorage.setItem("token", token);
          this.setState({ errorMsg: "Logged In" });
          this.props.history.push({
            pathname: "/events"
          });
        } else if (res.data === "Wrong Password") {
          this.setState({ errorMsg: "Wrong user name or password" });
        } else if (res.data === "You need to register") {
          this.setState({
            errorMsg: "Email address not found. Please Register"
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <>
        <div
          className="b-ground"
          style={{
            backgroundImage: `url(${backgroundDefault})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100%",
            minHeight: "100vh"
          }}
        >
          <div
            className="page-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr "
            }}
          >
            <Nav />

            <form onSubmit={this.login}>
              <div className="content">
                <h1 className="heading">Login to Eventzilla</h1>
                <div className="group logo3">
                  <i className="fas fa-ticket-alt logo group logo3 ticket-form"></i>

                  <div className="form-info">
                    {this.state.formFields.map((e, i) => (
                      <div className="group" key={i}>
                        <label>{e.label}</label>
                        <input
                          value={this.state.user[e.value]}
                          required
                          onChange={event => this.changeField(event, e.value)}
                          type={e.type}
                        />
                      </div>
                    ))}

                    <button className="primary group logo3">
                      <strong>Log In</strong>
                    </button>
                  </div>

                  <span>{this.state.errorMsg}</span>

                  <p className="footer">
                    Don't have an account?{" "}
                    <Link to="/signup" style={{ color: "#ef5a00" }}>
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
}

export default LogIn;
