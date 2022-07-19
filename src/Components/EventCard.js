import React from "react";
import moment from "moment";
import "../Styles/EventCard.css";





class EventCard extends React.Component {
  state = {};

  slideDirection(){
    if(this.props.index%2 === 0){return 'home-details-container home-slide-from-right'}
    return "home-details-container home-slide-from-left"
  }

  render() {
    return (
    <>
    
    <div className="home-details-container">
          <div className="event-card-image-wrapper">
            <img
              src={this.props.image} alt={this.props.name}
            />
          </div>

            <div className="home-event-text-container">

              <header>{this.props.name}</header>

              <div className="home-event-date-and-location">

                <div className="home-event-date">
                  {` ${moment(this.props.startDetails).format('ddd Do MMM')} at ${moment(this.props.startDetails).format('HH:mm')} `}
                </div>

                <div className="home-event-location">
                 {` ${this.props.location}`}
                </div>

              </div>
            </div>

  
        </div>
    
     
    

	</>
    )
    }
}

export default EventCard;