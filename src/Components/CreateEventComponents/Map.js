import React from 'react'
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import Geocode from "react-geocode"
import Autocomplete from 'react-google-autocomplete'
Geocode.setApiKey(process.env.REACT_APP_API_GOOGLE_MAPS);
Geocode.enableDebug();
class Map extends React.Component{
    constructor( props ){
    super( props )
    }


    shouldComponentUpdate(nextProps, nextState){
        if(this.props.center.lat !== nextProps.center.lat || this.props.center.lng !== nextProps.center.lng){
            return true
        }else{
            return false
        }
    }

    continue = (e) => {
        e.preventDefault()
        this.props.nextStep()
    }

    goBack = (e) => {
        e.preventDefault()
        this.props.prevStep()
    }

    render(){
        const AsyncMap = withScriptjs(
            withGoogleMap(
                props => (      
                <GoogleMap 
                    google={this.props.google}
                    defaultZoom={this.props.zoom}
                    defaultCenter={
                        {
                            lat: this.props.center.lat,
                            lng: this.props.center.lng
                        }
                    }
                >

                    <Marker 
                        google={this.props.google}
                        name={'Your Event Venue'}
                        draggable={true}
                        onDragEnd={ this.props.getLatLngAfterDrag }
                        position={{ lat: this.props.center.lat, lng: this.props.center.lng }}
                        />
                </GoogleMap>
                )
            )
        )
        let map
        if( this.props.center.lat !== undefined ) {
            map = <div>
                    
                    <AsyncMap
                        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_GOOGLE_MAPS}&libraries=places`}
                        loadingElement={
                        <div style={{ height: `100%` }} />
                        }
                        containerElement={
                        <div style={{ height: this.props.height }} />
                        }
                        mapElement={
                        <div style={{ height: `100%` }} />
                        }
                    />
                    <div>Please drag and drop the location marker if it is not accurate</div>
                </div>
        } else {
        map = <div style={{height: this.props.height}} />
        }

        return(
            <> 
                {map}
                <button onClick={event => this.continue(event)}>Continue</button>   <button onClick={event => this.goBack(event)}>Go Back</button>
            </>
        )
    }
}
export default Map

