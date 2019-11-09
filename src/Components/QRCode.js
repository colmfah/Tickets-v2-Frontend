import React from 'react'
import "../Styles/QRCode.css";
var QRCode = require('qrcode.react')


class ShowQRCode extends React.Component {

	state = {

	}


componentDidMount(){

}

	render() {



	  return (
			<>
				<QRCode value={this.props.match.params.id} className='QR' />

			</>
		)
}
}

export default ShowQRCode
