import React from "react";
import { withRouter } from "react-router-dom";
import '../Styles/Footer.css'
import moment from "moment";

class Footer extends React.Component {



  render() {
    return (
        <footer>
        <ul>
          <li>

          © Ticketglen {moment().format('YYYY')}
    
          </li>
        </ul>
      </footer>
    )
  }
}

export default withRouter(Footer);




