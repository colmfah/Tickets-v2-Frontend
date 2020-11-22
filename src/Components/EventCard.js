import React from "react";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faMapMarker } from '@fortawesome/free-solid-svg-icons'
import "../Styles/EventCard.css";





class EventCard extends React.Component {
  state = {};
  render() {
    return (
    <>
    <section class="home-event-summary-container home-slide-from-left">
        <a href="party.html">
          <div class="home-details-container">
            <img
              src={this.props.image}
            />

            <div className="home-event-text-container">

              <header>{this.props.name}</header>

              <div className="home-event-date-and-location">

                <div className="home-event-date">
                   <FontAwesomeIcon icon={faCalendarAlt} className="fontawesome-icon"/> {` ${moment(this.props.startDetails).format('Do MMM')} at ${moment(this.props.startDetails).format('HH:mm')} `}
                </div>

                <div className="home-event-location">
                  <FontAwesomeIcon icon={faMapMarker} className="fontawesome-icon"/>  {` ${this.props.location}`}
                </div>

              </div>
            </div>

  
          </div>
        </a>
      </section>

	</>
    )
    }
}

export default EventCard;