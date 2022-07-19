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
    },
    dataLoaded: false
  };

  componentDidMount() {
    let token = localStorage.getItem("token");
    let objectToSend = {
      token: token
    };
    axios
      .post(`${process.env.REACT_APP_API}/profile`, objectToSend)
      .then(res => {this.setState({ user: res.data, dataLoaded: true})})
      .catch(err => console.log(err));
  }

  displayTickets = () => {
    if(this.state.user.ticketsBought.length === 0){return}
    return (<div className="tickets-wrap">
      {this.state.user.ticketsBought.map((ticket, index)=> {
        return( <div key={index}>
            <PurchasedTicket
              ticket = {JSON.parse(JSON.stringify(ticket))}
            />
          </div>)}
          )}
    </div>)
  }

  displayNoTicketsPurchasedMessage = () => {

    console.log('this.state.dataLoaded', this.state.dataLoaded)
   
    if(!this.state.dataLoaded){return}
    if(this.state.user.ticketsBought.length > 0){return}
    
    return (<div className="tickets-wrap center-text">You have not purchased any tickets for upcoming events</div>)
  }



  render() {
    return (
      <>
        <Nav />
        <div className='my-event-container'>
          <div className="create-ticket-heading">
              <header>My Tickets</header>
              <hr />
          </div>   
        {this.displayTickets()}
        {this.displayNoTicketsPurchasedMessage()}
          
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
