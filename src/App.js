import React, { Component } from 'react';
import './App.css';
import Navbar from './views/Navbar';
import Filter from './views/Filter';
import Mapa from './views/Mapa';
import Error4sq from './views/Error4sq';
import ErrorBoundary from './views/ErrorBoundary';

class App extends Component {
  //query é o que está sendo digitado no campo do filtro
  //Results são o resultado da query do filtro
  //locationsInfos é o array com os IDs dos lugares desejados da API do 4square e lat/lng para fazer load quando ocorre erro da API
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
    locationsInfos: [
{id: '4b887040f964a520c5f731e3', lat : -26.3111588547812, lng : -48.85477183220791},
 {id: '5213836811d26e8f30c46621', lat : -26.302468037636825, lng : -48.84750114795226},
 {id: '5674e233498e82994552726f', lat : -26.30282264676077, lng : -48.84957856695926},
 {id: '4bd07738046076b0a4fb6f71', lat : -26.299135907550628, lng : -48.84890023335302},
 {id: '512bee80e4b08291289b70d0', lat : -26.300541891199227, lng : -48.85342031120082},
 {id: '51522631e4b086b6396c2473', lat : -26.30754334872784, lng : -48.84809454938463},
 {id: '4be2b5e0f07b0f4757f6f543', lat : -26.305558681483124, lng : -48.84471036878928},
 {id: '4b8d9f18f964a520c60433e3', lat : -26.303720061830536, lng : -48.84901323742851},
 {id: '4c4b4fb2c9e4ef3b4a05fa10', lat : -26.3017340045689, lng : -48.848219625323836}
    ],
    error: null,
    errorInfo: null
  }

  addInfoWindow = (content, marker) =>{
    var infoWindow = new window.google.maps.InfoWindow({content: content});
    marker.addListener('click', () => {
      this.openInfoWindow(infoWindow, marker);
    });
    infoWindow.addListener('closeclick', () => {
      this.closeInfoWindows();
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
          if (this.state.error){
            this.setState({error: null});
          }
    		}else{
    			this.setState({error: "ao carregar dados do local"});
    		}
	    	}).catch(err => {
          this.setState({error: err});
	    	})
    	)
    };
    Promise.all(fetches).then(() => {
      const map = this.initMap('map', {center: {lat: -26.324, lng: -48.844}, zoom: 14});
      const bounds = new window.google.maps.LatLngBounds();
      let locations = [];

      //Quando não ocorre algum erro, preencher location conforme condicional abaixo;

      if (fetches && fetchResponse.length > 0){
        locations = fetchResponse.map(data => {
          let currentLocation = {};
          currentLocation.name = data.response.venue.name;
          currentLocation.id = data.response.venue.id;
          currentLocation.coordinates = {'lat': data.response.venue.location.lat, 'lng': data.response.venue.location.lng};
          currentLocation.desc = `<h1>${currentLocation.name}</h1></br>`;
          if (data.response.venue.bestPhoto){
            currentLocation.photoUrl = `${data.response.venue.bestPhoto.prefix}240x240${data.response.venue.bestPhoto.suffix}`;
            currentLocation.desc += `<img src="${currentLocation.photoUrl}"></br>`
          }

          if (data.response.venue.categories[0]){
            currentLocation.desc += `Categoria: ${data.response.venue.categories[0].name}</br>`;
          }
          if (data.response.venue.hours && data.response.venue.hours.status){
            currentLocation.desc += `Status: ${data.response.venue.hours.status}`;
          }
          currentLocation.marker = this.createMarker(currentLocation.coordinates, map);
          currentLocation.infoWindow = this.addInfoWindow(currentLocation.desc, currentLocation.marker);
          currentLocation.infoWindow.close();
          bounds.extend(currentLocation.coordinates);
          map.fitBounds(bounds);
          return currentLocation;
        });
      }

      //Quando ocorre algum erro, preencher locations com apenas as informações abaixo.

      else
      {
        locations = this.state.locationsInfos.map(location => {
          let currentLocation = {};
          currentLocation.coordinates = {lat: location.lat, lng: location.lng};
          currentLocation.desc = `<p>Ocorreu um erro ao carregar dados do local :(</p>`;
          currentLocation.marker = this.createMarker(currentLocation.coordinates, map);
          currentLocation.infoWindow = this.addInfoWindow(currentLocation.desc, currentLocation.marker);
          currentLocation.infoWindow.close();
          currentLocation.name = '';
          bounds.extend(currentLocation.coordinates);
          map.fitBounds(bounds);
          return currentLocation;
        })
      }

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

  componentDidCatch(error, errorInfo) {
    // Catch errors in any child components and re-renders with an error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
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
        
{/*Quando ocorre algum erro, deixar apenas uma faixa com informações de erro pois não há informações
para filtrar quando ocorre erro, caso contrário, carregar normalmente a Navbar*/}

        {this.state.error && (
          <Error4sq
          error={this.state.error}
          />
          )}

        {!this.state.error && (
          <Navbar 
          toggleExtendFilter={this.toggleExtendFilter}
          />
        )} 

          <ErrorBoundary>
            <Mapa 
            results={this.state.results} 
            location={this.state.location} 
            locations={this.state.locations}
            selectPlace={this.selectPlace}
            locationsInfos={this.state.locationsInfos}
            updateLocations={this.updateLocations}
            />
          </ErrorBoundary>
      </div>
    );
  }
}

export default App