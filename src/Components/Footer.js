import React from "react";
import { withRouter } from "react-router-dom";

import "../Styles/Footer.css";

class Footer extends React.Component {



  render() {
    return (
        <footer>
        <ul>
          <li>

          © TicketDock 2020
    
          </li>
        </ul>
      </footer>
    )
  }
}

export default withRouter(Footer);
