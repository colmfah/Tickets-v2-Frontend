import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Nav from "./Nav";
import Card from "./Card";


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
      <div className="grid-nav-body">
        <Nav />

        <div>
          {this.state.events.map((e, i) => {
            return (
              <Link to={`/events/${e._id}`}>
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
      </div>
    );
  }
}

export default Events;
