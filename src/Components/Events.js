import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Nav from "./Nav";
import Card from "./Card";
import "../Styles/Events.css";
import backgroundEvents from "../images/events-background.jpg";

class Events extends React.Component {
  state = {
    events: [],
    currency: {
      USD: "$",
      EUR: "€",
      NZD: "$"
    }
  };

  componentDidMount() {
    axios
      .get(`${process.env.REACT_APP_API}/events`)
      .then(res => {
        this.setState({
          events: res.data
        });
      })
      .catch(err => {});
  }

  render() {
    return (
      <>
        <Nav />

        <div className="cardGrid">
          {this.state.events.map((e, i) => {
            return (
              <Link to={`/events/${e._id}`} style={{ marginTop: "50px" }}>
                <Card
                  name={e.title}
                  location={e.location}
                  startDetails={e.startDetails}
                  price={e.price}
                  image={e.imageURL}
                />
              </Link>
            );
          })}
        </div>
      </>
    );
  }
}

export default Events;
