import React from 'react'
import Nav from "./Nav";
import Footer from "./Footer";
import "../Styles/QRCode.css";
var QRCode = require('qrcode.react')


class ShowQRCode extends React.Component {
	render() {  
	  return (
			<>
				<Nav />
				<div className="qrCode">
					<QRCode value={this.props.match.params.id} className='QR' />
				</div>
				
				<Footer />
			</>
		)
    }
}

export default ShowQRCode