import React from "react";
import "../Styles/profile-card.css";
import moment from "moment";
import { Link } from "react-router-dom";

class ProfileCard extends React.Component {
  render() {
    return (
      <div className="cardBack">
        <div className="headWrap">
          <h1>{this.props.title}</h1>
        </div>
        <p>
          <i className="fas fa-map-marker-alt" style={{ color: "#EF5A00" }}></i>{" "}
          Venue: {this.props.location}
        </p>
        <p>
          <i className="far fa-calendar-check" style={{ color: "#EF5A00" }}></i>{" "}
          Date: {moment(this.props.startDetails).format("D MMMM")}
        </p>
        <p>
          <i className="fas fa-clock" style={{ color: "#EF5A00" }}></i> Doors:{" "}
          {moment(this.props.startDetails).format("HH:mm")}
        </p>

        <Link
          to={`/qr/${this.props.randomNumber}`}
          style={{ color: "#EF5A00", textAlign: "center" }}
        >
          Click here to access your QR code to enter the event
        </Link>
      </div>
    );
  }
}

export default ProfileCard;
