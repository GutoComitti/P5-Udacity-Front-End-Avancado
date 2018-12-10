import React, { Component } from 'react';
import './App.css';
import Navbar from './views/Navbar';
import Filter from './views/Filter';
import Mapa from './views/Mapa';
import scriptLoader from 'react-async-script-loader'


class App extends Component {
  constructor(){
    super();
    this.updateLocations = this.updateLocations.bind(this);
  }
  //query é o que está sendo digitado no campo do filtro
  //Results são o resultado da query do filtro
  //locationsIds é o array com os IDs dos lugares desejados da API do 4square
  //locations é o array com os dados puxados da API do 4square já tratado (apenas com o que interessa)
  //location é a localização que está selecionada, onde deve aparecer a infoWindow displayed

  state = {
    filterExtended: false,
  	map: {},
  	bounds: {},
  	infowindow: {},
    query: '',
    results: [],
    //Colocar uma propriedade na location com o marcador
    locations: [],
    location: {},
    locationsIds: [
      // `4b8d9f18f964a520c60433e3`,
      // `4bd07738046076b0a4fb6f71`,
      // `5213836811d26e8f30c46621`,
      // `5674e233498e82994552726f`,
      // `4c4b4fb2c9e4ef3b4a05fa10`,
      // `4be2b5e0f07b0f4757f6f543`,
      // `512bee80e4b08291289b70d0`,
      `4b887040f964a520c5f731e3`,
      `51522631e4b086b6396c2473`
    ]
  }

  addInfoWindow = (content, marker) =>{
    var infoWindow = new window.google.maps.InfoWindow({content: content});
    marker.addListener('click',() => {
      this.openInfoWindow(infoWindow, marker);
    });
    return infoWindow;
  }

  closeInfoWindows = () =>{
    this.state.locations.forEach((location) =>{
      location.infoWindow.close();
      location.marker.setAnimation(null);
    });
  }

  showMarker = (marker) => {
    marker.setMap(this.state.map);
  }

  hideMarkers = () => {
    this.state.locations.forEach((location) =>{
      location.marker.setMap(null);
    });
  }

  showResultsMarkers = () => {
    if (this.state.results.length > 0){
      this.hideMarkers();
      this.state.results.forEach((result) => {
        this.showMarker(result.marker);
      });
    }else if (this.state.query !== ''){
      this.hideMarkers();      
    }
  }

  openInfoWindow = (infoWindow, marker) => {
      this.closeInfoWindows();
      infoWindow.open(marker.map, marker);
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null)      
      }else{
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
      }
  }

  createMarker = (position, map) =>{
    const marker = new window.google.maps.Marker({
        position: position,
        map: map
    });
    return marker;
  }

  //Para abrir a infowindow, rodar o código abaixo:
  //infoWindow.open(marker.map, marker);

  defineMapBounds = (marker, map) => {
    var bounds = new window.google.maps.LatLngBounds();
    marker.setMap(map);
    bounds.extend(marker.position);
    map.fitBounds(bounds);
  }

  toggleExtendFilter = () =>{
    this.setState(prevState => ({
      filterExtended: !prevState.filterExtended
    }));
  }

  initMap = (element, config) => {
    const map = new window.google.maps.Map(
      document.getElementById(element), config
    );
    return map;
  }

  updateQuery = (query) =>{
    this.setState({query: query.trim()});
    //Quando é alterada a busca, se havia uma localização selecionada, deixa de estar selecionada
    if (this.state.location){
      this.setState({location: {}});
    }
  }

  getLocationUrlById = (id) => {
    const clientId = `IJV3PRHH2ZKQ5ZAEW3JUQ3TBV4EAQGL1KSPSFXF0M3NBMYMO`;
    const clientSecret = `DMGEOLITPUAB2BPQYONOY3NFNE1IKF1VBFJWNMIQQR2NXZUU`;
    const url = `https://api.foursquare.com/v2/venues/${id}?client_id=${clientId}&client_secret=${clientSecret}&v=20181118`;
    return url;
  }

	updateLocations = idsArray => {
  	let fetchResponse = [];
    let fetches = [];
    //TODO: Puxar async os dados de todas as locations usando o fetchLocationData: ver como fazer pra conseguir fazer um encadeamento
    //da função fetchLocationData (talvez ela tenha que retornar uma promise) e ao final criar um array de localizações e setar
    //o this.state.locations pra esse array!
    for (let id of idsArray) {
    	fetches.push(
    		fetch(this.getLocationUrlById(id))
    		.then(res => res.json())
    		.then(data => {
    		if (data.meta.code === 200){
    			fetchResponse.push(data);
    		}else{
    			console.log(`Promise ${id} returned with status ${data.meta.code}.`);
    		}
	    	}).catch(err => {
	    		return console.log(err);
	    	})
    	)
    };
    Promise.all(fetches).then(() => {
      const map = this.initMap('map', {center: {lat: -26.324, lng: -48.844}, zoom: 14});
      var bounds = new window.google.maps.LatLngBounds();
    	const locations = fetchResponse.map(data => {
    		let currentLocation = {};
				currentLocation.name = data.response.venue.name;
        currentLocation.id = data.response.venue.id;
				currentLocation.coordinates = {'lat': data.response.venue.location.lat, 'lng': data.response.venue.location.lng};
				currentLocation.desc = `<h1>${currentLocation.name}</h1></br>`;
				if (data.response.venue.categories[0]){
					currentLocation.desc += `Categoria: ${data.response.venue.categories[0].name}</br>`;
				}
				if (data.response.venue.hours && data.response.venue.hours.status){
					currentLocation.desc += `Status: ${data.response.venue.hours.status}`;
				}
        if (data.response.venue.bestPhoto){
          currentLocation.photoUrl = `${data.response.venue.bestPhoto.prefix}240x240${data.response.venue.bestPhoto.suffix}`;
        }
        currentLocation.marker = this.createMarker(currentLocation.coordinates, map);
        currentLocation.infoWindow = this.addInfoWindow(currentLocation.desc, currentLocation.marker);
        currentLocation.infoWindow.close();
        bounds.extend(currentLocation.coordinates);
        map.fitBounds(bounds);
        return currentLocation;
    	});
    	this.setState({locations: locations, map: map});
	  });
	};

//Se há locations, compara o resultado anterior ao resultado atual, e se há diferença, seta this.state.results ao resultado atual
	updateResults = () => {
    if(this.state.locations.length > 0){
      const queryResults = this.state.locations.filter((location) => (location.name.toLowerCase().includes(this.state.query.toLowerCase())));
      if (!(JSON.stringify(queryResults.map((result)=>result.id))===JSON.stringify(this.state.results.map((result)=>result.id)))){
        this.setState({results: queryResults});
      }
    }
	}

	componentDidMount() {
  	//Aqui deve ser feito o load dos dados async do 4square
  	//Ocorre apenas uma vez em todo o lifecycle, logo após o componente ser montado
  	if (this.state.locations.length ===0)
  		this.updateLocations(this.state.locationsIds);
	}

	componentDidUpdate(prevProps, prevState){
  	this.updateResults();
    //Se os resultados mudaram, atualizar o showResultsMarkers => evita ficar piscando a cada nova letra da query
    if (prevState.results &&
      !(JSON.stringify(this.state.results.map((location)=>location.id))
        ===JSON.stringify(prevState.results.map((result)=>result.id)))
      ){
      this.showResultsMarkers();
    }
	}

  render() {
    return (
      <div className="container">
        
        {this.state.filterExtended && (
        <Filter 
        updateQuery={this.updateQuery} 
        openInfoWindow={this.openInfoWindow} 
        results={this.state.results} 
        location={this.state.location}
        selectPlace={this.selectPlace}
        />
        )}

        <Navbar 
        toggleExtendFilter={this.toggleExtendFilter}
        />
      
        <Mapa 
        results={this.state.results} 
        location={this.state.location} 
        locations={this.state.locations}
        selectPlace={this.selectPlace}
        />
      </div>
    );
  }
}

export default scriptLoader(
  [`https://maps.googleapis.com/maps/api/js?key=AIzaSyC4KgRuOBHyFpm9pb0Ym4vmvVVBByCJ8ik`]
)(App);