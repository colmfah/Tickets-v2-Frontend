import React from "react";
import Nav from "./Nav";
import UsersTickets from './UsersTickets'
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
      .then(res => {
				console.log('comp mount', res.data)
        this.setState({
          user: res.data
        });
      })
      .catch(err => console.log(err));
  }

  updateState = (updatedUserData) => {
    console.log('updatedUserData')
    let user = this.state.user
    user.ticketsBought = updatedUserData.ticketsBought
    this.setState({user})
  }

  turnScannerOnOff = usersEvent => {
    let stateCopy = this.state.user.usersEvents;
    stateCopy.map(e => {
      if (e._id === usersEvent._id) {
        e.checkIn = !e.checkIn;
        return e;
      }
    });

    this.setState({
      usersEvents: stateCopy
    });
  };

  handleScan = (data, usersEvent) => {
    if (data) {
      this.turnScannerOnOff(usersEvent);

      let stateCopy = this.state.user.usersEvents;
      stateCopy.map(e => {
        if (e._id === usersEvent._id) {
          e.message = "QR code scanned. Checking database for match...";
          return e;
        }
        this.setState({
          usersEvents: stateCopy
        });
      });

      axios
        .post(`${process.env.REACT_APP_API}/checkIn`, {
          qrcode: data,
          eventid: usersEvent._id
        })
        .then(res => {
          let stateCopy = this.state.user.usersEvents;
          stateCopy = stateCopy.map(e => {
            if (e._id === usersEvent._id) {
              e.message = res.data;
              return e;
            }
          });
          this.setState({
            usersEvents: stateCopy
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  handleError = err => {
    console.error(err);
  };

  render() {
    return (
<>
  <Nav />

  <div className="tickets-wrap">

    {this.state.user.ticketsBought.map((ticket, index) => {
    
       return( <div key={index}>
          <PurchasedTicket
            // changeDeliveryOption = {this.changeDeliveryOption}
            // changeQuantity={this.changeQuantity}
            // changeWaitListExpiration={this.changeWaitListExpiration}
            // displaySpecificDate={this.displaySpecificDate}
            index={index}
            ticket = {JSON.parse(JSON.stringify(ticket))}
            // waitListSpecificDate = {ticket.waitListSpecificDate}
            // ticketsAvailable = {ticket.ticketsAvailable}
            // specificWaitListDateError = {this.state.specificWaitListDateError}
          />
        </div>)}
        )}

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

  </div>





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
          )
          
          }
</>
  )
		  }
		}

export default Tickets;
