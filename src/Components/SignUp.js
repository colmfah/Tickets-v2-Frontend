import React from "react";
import axios from "axios";
import "../Styles/Form.css";
import { Link } from "react-router-dom";
import Nav from "./Nav";
import "../Styles/Form.css";
import bground3 from "../images/bground3.jpg";

class SignUp extends React.Component {
  state = {
    formFields: [
      { label: "Name", type: "text", value: "name" },
      { label: "Email", type: "email", value: "email" },
      { label: "Password", type: "password", value: "password" },
      { label: "Location", type: "text", value: "location" }
    ],

    user: {
      name: "",
      email: "",
      password: "",
      location: ""
    },

    errorMsg: "Already have an account?"
  };

  changeField = (e, field) => {
    let user = this.state.user;
    user[field] = e.target.value;
    this.setState({ user });
  };

  signup = e => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API}/users`, this.state.user)
      .then(res => {
        if (res.data === "You already registered") {
          console.log(res.data);
          this.setState({ errorMsg: "You have already registered" });
        } else {
          localStorage.setItem("token", res.data);
          this.props.history.push({
            pathname: "/events"
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
            backgroundImage: `url(${bground3})`,
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
            <form onSubmit={this.signup}>
              <div className="content">
                <h1 className="heading">Sign up to Eventzilla</h1>
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
                      <strong>Signup</strong>
                    </button>
                  </div>

                  <p className="footer">
                    {this.state.errorMsg}{" "}
                    <Link to="/login" style={{ color: "#ef5a00" }}>
                      Login
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

export default SignUp;
