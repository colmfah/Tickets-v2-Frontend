import React from "react";
import Nav from "./Nav";
import { Link } from "react-router-dom";
import QrReader from "react-qr-reader";
import axios from "axios";
import moment from "moment";


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
      <>
        <Nav />

              <p>{this.state.user.name}</p>

            <h2>Your Upcoming Events</h2>

            {this.state.user.ticketsBought.length > 0 ? (
              <div>
                {this.state.user.ticketsBought.map((e, i) => {
                  return (
                    <div key={i}>

                        <p>location: {e.event.location}</p>
                        <p>title {e.event.title}</p>
                        <p>startDetails
												{moment(e.event.startDetails).format("D MMMM")} {moment(e.event.startDetails).format("HH:mm")}
												</p>

											<Link
												to={`/qr/${e.event.randomNumber}`}
											>
												<p>Click here to access your QR code to enter the event</p>
											</Link>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div></div>
            )}




						<h2>Events you are organising</h2>
          {this.state.user.usersEvents.map((e, i) => {
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
          })}
</>
		    )
		  }
		}

export default Profile;
