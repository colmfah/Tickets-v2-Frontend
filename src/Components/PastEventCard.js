import React from "react";

class PastEventCard extends React.Component {
  render() {
    return (
      <div className="cardBack">
        <div className="headWrap">
          <h1>ABBA Karaoke</h1>
        </div>
        <p>
          <i className="fas fa-map-marker-alt" style={{ color: "#EF5A00" }}></i>{" "}
          Venue: 7th Ring of Hell
        </p>
        <p>
          <i className="fas fa-map-marker-alt" style={{ color: "#EF5A00" }}></i>{" "}
          City: Dublin
        </p>
        <p>
          <i className="far fa-calendar-check" style={{ color: "#EF5A00" }}></i>{" "}
          Date: 01/01/01
        </p>
        <p>
          <i className="fas fa-dollar-sign" style={{ color: "#EF5A00" }}></i>{" "}
          Price: 15¢
        </p>
        <p>
          <i className="fas fa-clock" style={{ color: "#EF5A00" }}></i> Doors:
          9pm
        </p>
        <p>
          <small>Catagory: Music</small>
        </p>
      </div>
    );
  }
}

export default PastEventCard;
