import React from "react";
import moment from "moment";

class Card extends React.Component {
  state = {};
  render() {
    return (
          <>
            <h2>{this.props.name}</h2>
            <div>
              {this.props.location}
            </div>
            <div>
              {moment(this.props.startDetails).format("D MMMM YYYY")}
            </div>
						<hr />
						</>
			    )
			  }
			}

export default Card;
