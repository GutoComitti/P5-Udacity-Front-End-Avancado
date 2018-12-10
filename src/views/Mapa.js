import React, { Component } from 'react'

class Mapa extends Component {

	render() {
	if (this.props.location.name){
		//Colocar a InfoWindow do location aqui
	}

    	return (
    		<div aria-label="mapa do bairro" id="map" />
		)
	}
}

export default Mapa;