import React from "react";
import Nav from "./Nav";
import ProfileCard from "./ProfileCard";
import PastEventCard from "./PastEventCard";
import { Link } from "react-router-dom";
import QrReader from "react-qr-reader";
import axios from "axios";
import moment from "moment";
import "../Styles/Profile.css";

class Profile extends React.Component {
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
        this.setState({
          user: res.data
        });
      })
      .catch(err => console.log(err));
  }

  click = () => {
    console.log("I have been clicked");
  };

  turnScannerOnOff = usersEvent => {
    let stateCopy = this.state.user.usersEvents;
    console.log("stateCopyb4map", stateCopy);
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
      <div className="background-grid">
        <Nav />
        <div className="user-info">
          <div className="user1">
            <div className="group logo-profile logo3">
              <i className="fas fa-ticket-alt ticket-form"></i>
            </div>
            <div>
              <h2 className="title1" style={{ color: "black" }}>
                <strong>Hello</strong>
              </h2>
              <p className="title1">{this.state.user.name}</p>
            </div>
          </div>
					
        </div>
        <div className="eventGrid">
          <div className="upcomingEvents">
            <h2 className="gridLabel">Upcoming Events</h2>

            {this.state.user.ticketsBought.length > 0 ? (
              <div>
                {" "}
                {this.state.user.ticketsBought.map((e, i) => {
                  return (
                    <div key={i}>
                      <ProfileCard
                        location={e.event.location}
                        title={e.event.title}
                        startDetails={e.event.startDetails}
                        randomNumber={e.randomNumber}
                      />

                      {/*<div>{i+1}</div>
								<div>{e.event.title}</div>
								<div>{e.event.location}</div>
								<div>Begins: {moment(e.event.startDetails).format('DD MMMM YYYY HH:mm')}</div>
								<div>Ends: {moment(e.event.endDetails).format('DD MMMM YYYY HH:mm')}</div>

								<Link to={`/qr/${e.randomNumber}`}>
								Click here to access your QR code to enter the event
								</Link>*/}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div></div>
            )}
          </div>

          <div className="pastEvents">
            <h2 className="gridLabel">Past Events</h2>
            <PastEventCard />
          </div>
        </div>

        <div className="eventsICreated">
          {this.state.user.usersEvents.map((e, i) => {
            return (
              <div key={i}>
                <div className="user1">
                  <div className="group logo-profile logo3 logo4">
                    <i className="fas fa-ticket-alt ticket-form"></i>
                  </div>

                  <div>
                    <h2 className="title1" style={{ color: "black" }}>
                      Your Eventzilla Event
                    </h2>
                    <h3 className="title1" style={{ color: "black" }}>
                      Event Title
                    </h3>
                    <p className="title1">{e.title}</p>

                    <h3 className="title1" style={{ color: "black" }}>
                      Tickets Sold
                    </h3>
                    <p className="title1">{e.ticketsSold.length}</p>
                    <h3 className="title1" style={{ color: "black" }}>
                      Tickets Remaining
                    </h3>
                    <p className="title1">
                      {e.ticketNo - e.ticketsSold.length}
                    </p>

                    <div>{e.message}</div>

                    {e.checkIn ? (
                      <div>
                        <button
                          className="primary"
                          onClick={() => this.turnScannerOnOff(e)}
                        >
                          Check In Off
                        </button>
                        <QrReader
                          delay={300}
                          onError={this.handleError}
                          onScan={event => this.handleScan(event, e)}
                          style={{ width: "100%" }}
                        />
                      </div>
                    ) : (
                      <button
                        className="primary"
                        onClick={() => this.turnScannerOnOff(e)}
                      >
                        Check In On
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Profile;
