import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader';

class Mapa extends Component {



	componentDidMount() {
  	//Aqui deve ser feito o load dos dados async do 4square
  	//Ocorre apenas uma vez em todo o lifecycle, logo após o componente ser montado
  	if (this.props.locations.length ===0)
  		this.props.updateLocations(this.props.locationsInfos.map((location) => location.id));
	}

	render() {
		return(
			<div aria-label="mapa do bairro" role="application" id="map" />
		)
	}
}

export default scriptLoader(
  [`https://maps.googleapis.com/maps/api/js?key=AIzaSyC4KgRuOBHyFpm9pb0Ym4vmvVVBByCJ8ik`]
)(Mapa)