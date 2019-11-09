import React from "react";
import Nav from "./Nav";
import ProfileCard from "./ProfileCard";
import PastEventCard from "./PastEventCard";
import '../Styles/Profile.css'


class Profile extends React.Component {
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
              <p className="title1">"User Name" </p>
            </div>
          </div>
        </div>
        <div className="eventGrid">
          <div className="upcomingEvents">
            <h2 className="gridLabel">Upcoming Events</h2>
            <ProfileCard />
            <ProfileCard />
            <ProfileCard />
          </div>
          <div className="pastEvents">
            <h2 className="gridLabel">Past Events</h2>
            <PastEventCard />
          </div>
        </div>
        <div className="eventsICreated">
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
              <p className="title1">Event Extravaganza of the Year</p>
              <h3 className="title1" style={{ color: "black" }}>
                Tickets Sold
              </h3>
              <p className="title1">Not enough</p>
              <h3 className="title1" style={{ color: "black" }}>
                Tickets Remaining
              </h3>
              <p className="title1">Too many</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
