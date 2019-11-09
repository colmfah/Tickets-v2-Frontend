import React from "react";
import "../Styles/Card.css";
import moment from "moment";

class Card extends React.Component {
  state = {};
  render() {
    return (
      <div className="card-container">
        <div
          className="front"
          style={{
            backgroundImage: `url(${this.props.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div className="wrap">
            <h2>
              <strong>{this.props.name}</strong>
            </h2>
            <small className="venue">
              <i
                className="fas fa-map-marker-alt"
                style={{ color: "#EF5A00" }}
              ></i>
              {this.props.location}
            </small>
            <div>
              <small className="venue">
                {moment(this.props.startDetails).format("D MMMM YYYY")}
              </small>
            </div>
          </div>
        </div>

        {/*<div className="back">

              <div className="head-wrap">
                <h1>{this.props.name}</h1>
              </div>
              <p>
                <i
                  className="fas fa-map-marker-alt"
                  style={{ color: "#EF5A00" }}
                ></i>{" "}
                {this.props.location}
              </p>
              <p>
                <i
                  className="fas fa-map-marker-alt"
                  style={{ color: "#EF5A00" }}
                ></i>{" "}
                {this.props.location}
              </p>
              <p>
                <i
                  className="far fa-calendar-check"
                  style={{ color: "#EF5A00" }}
                ></i>{" "}
                {moment(this.props.startDetails).format('D MMMM YYYY')}
              </p>
              <p>
                <i
                  className="fas fa-dollar-sign"
                  style={{ color: "#EF5A00" }}
                ></i>{" "}
                {this.props.price}
              </p>
              <p>
                <i className="fas fa-clock" style={{ color: "#EF5A00" }}></i>{" "}
                {moment(this.props.startDetails).format('HH:mm')}
              </p>
              <p>
              </p>
              <Link to="#">
                <button type="button" className="card-button">
                  <strong>Go To Event</strong>
                </button>
              </Link>
            </div>*/}
      </div>
    );
  }
}

export default Card;
