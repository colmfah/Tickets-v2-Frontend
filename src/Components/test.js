const cardElement = this.props.elements.getElement('card');

		axios.get(`${process.env.REACT_APP_API}/saveCardDetails`).then(res => {

			this.props.stripe.confirmCardSetup(res.data.client_secret, {payment_method: {card: cardElement}}).then( confirmCardSetupRes => {

				if (confirmCardSetupRes.setupIntent.status === 'succeeded'){
		
                        axios.post(`${process.env.REACT_APP_API}/paymentIntent`, objectToSend).then(res => {					
							this.props.upDateMessage(res.data.message)
				
                        })
                }
            })
        })