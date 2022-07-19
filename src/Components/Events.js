import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Nav from "./Nav";
import Footer from "./Footer";
import EventCard from "./EventCard";


class Events extends React.Component {
  state = {
    events: [],
    currency: {
      USD: "$",
      EUR: "€",
      NZD: "$",
    },
  };

  componentDidMount() {
    axios
      .get(`${process.env.REACT_APP_API}/events`)
      .then((res) => {
        this.setState({
          events: res.data,
        });
      })
      .catch((err) => {});
  }

  render() {
    return (
      <>
        <Nav />
        
          <div className="content-wrapper events-content-wrapper">
            {this.state.events.map((e, i) => {
              return (
                <Link to={`/events/${e._id}`} key={i}>
                  <EventCard
                    name={e.title}
                    location={`${e.venue}, ${e.address1}`}
                    startDetails={e.startDetails}
                    price={e.price}
                    image={e.imageURL}
                    index={i}
                  />
                </Link>
              );
            })}
          </div>
          <Footer />
      </>
    );
  }
}

export default Events;
