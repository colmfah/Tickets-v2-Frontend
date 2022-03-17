import React from "react";
import Nav from "./Nav";
import RegisteredWaitList from "./RegisteredWaitList";
import Footer from "./Footer";
import axios from "axios";
import "../Styles/Tickets.css";


class WaitLists extends React.Component {
    state = {
        user: {
          email: "",
          _id: "",
          ticketsBought: [],
          waitLists: [],
          usersEvents: []
        }
      };
    
    componentDidMount() {
      let token = localStorage.getItem("token");
      axios.post(`${process.env.REACT_APP_API}/profile`, {token: token})
        .then(res => {this.setState({ user: res.data})})    
    }


    render() {
      return (
        <div className="tickets-wrap">
          <Nav />
          {this .state.user.waitLists.map((waitList, index) => {return (
              <div key={index}>
                  <RegisteredWaitList 
                      waitList = {JSON.parse(JSON.stringify(waitList))}
                  />
              </div>)
          })}
          <Footer />
        </div>
      )    
    }
  }

export default WaitLists;