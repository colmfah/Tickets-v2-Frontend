import React from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import PurchasedTicket from "./PurchasedTicket";
import axios from "axios";
import "../Styles/Tickets.css";


class Tickets extends React.Component {
  state = {
    user: {
      email: "",
      location: "",
      name: "",
      _id: "",
      ticketsBought: [],
      waitLists: [],
      usersEvents: []
    }
  };

  componentDidMount() {
    let token = localStorage.getItem("token");
    let objectToSend = {
      token: token
    };
    axios
      .post(`${process.env.REACT_APP_API}/profile`, objectToSend)
      .then(res => {this.setState({ user: res.data})})
      .catch(err => console.log(err));
  }



  render() {
    return (
      <>
        <Nav />
        <div className="tickets-wrap">
          {this.state.user.ticketsBought.map((ticket, index)=> {
            return( <div key={index}>
                <PurchasedTicket
                  ticket = {JSON.parse(JSON.stringify(ticket))}
                />
              </div>)}
              )}
        </div>
        <Footer />
      </>
      
    )    
  }
}

export default Tickets;


    {/* {this.state.user.ticketsBought.length > 0 &&
      <div>
      <h2>Your Tickets Cff</h2>
        <UsersTickets
          ticketsBought={this.state.user.ticketsBought.filter(e => e.refunded === false)}
          purchaserID={this.state.userID}
          updateState={this.updateState}
        />
      </div>
      } */}

                {/*this.state.user.usersEvents.map((e, i) => {
            return (
              <div key={i}>



                    <p>{e.title}</p>
                    <p>Tickets Sold</p>
                    <p>{e.ticketsSold.length}</p>
                    <p>Tickets Remaining</p>
                    <p>{e.ticketNo - e.ticketsSold.length}</p>
                    <div>{e.message}</div>

                    {e.checkIn ? (
                      <div>
                        <button onClick={() => this.turnScannerOnOff(e)}>
                          Check In Off
                        </button>
                        <QrReader
                          delay={300}
                          onError={this.handleError}
                          onScan={event => this.handleScan(event, e)}
                        />
                      </div>
                    ) : (
                      <button onClick={() => this.turnScannerOnOff(e)}>
                        Check In On
                      </button>
                    )}
                  </div>
            )
          */
          
        }
