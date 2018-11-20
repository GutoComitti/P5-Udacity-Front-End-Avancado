import React, { Component } from 'react';
import './App.css';
import * as MapsAPI from './MapsAPI';
import Navbar from './views/Navbar';
import Filter from './views/Filter';
import Mapa from './views/Mapa';

class App extends Component {
  //Results são o resultado da query do filtro
  state = {
    query: '',
    results: [],
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
      // `4b887040f964a520c5f731e3`,
      `51522631e4b086b6396c2473`
    ]
  }

  updateQuery = (query) =>{
    this.setState({query: query.trim()});
    //Quando é alterada a busca, se havia uma localização selecionada, deixa de estar selecionada
    if (this.state.location){
      this.setState({location: {}});
    }
  }
//Função pra definir apenas uma localização pra aparecer no mapa (quando é clicado no filtro)
  showLocation = (location) =>{
    if (location !== this.state.location){
      this.setState({location: location});
    }
  }

  getLocatioUrlById = (id) => {
    const clientId = `IJV3PRHH2ZKQ5ZAEW3JUQ3TBV4EAQGL1KSPSFXF0M3NBMYMO`;
    const clientSecret = `DMGEOLITPUAB2BPQYONOY3NFNE1IKF1VBFJWNMIQQR2NXZUU`;
    const url = `https://api.foursquare.com/v2/venues/${id}?client_id=${clientId}&client_secret=${clientSecret}&v=20181118`;
    return url;
  }

  updateLocations = () => {
    //TODO: Puxar async os dados de todas as locations do 
  }

  createMarker = (content, position, map) =>{
    MapsAPI.addMarker(content, position, map);
  }

  updateResults = () => {
    if(!this.state.locations.length === 0){
      const queryResults = this.state.locations.filter((location) => (location.name.includes(this.state.query)));
      if (!(JSON.stringify(queryResults)===JSON.stringify(this.state.results))){
        this.setState({results: queryResults});
      }
    }
  }

  initMapAndItsComponents = () => {
    MapsAPI.getGoogleMaps().then((google) => {
      const map = MapsAPI.initMap(google, 'map', {center: {lat: 200.12, lng: 200.15}, zoom: 12});
      if (this.state.results){
        this.state.results.map((result) => {
          const coordinates = {lat: result.lat, lng: result.lng};
          const marker = MapsAPI.addMarker(result.desc, coordinates, map);
            debugger;
          if (this.state.location && result === this.state.location){
            MapsAPI.addInfoWindowListenerAndOpen(result.desc,map,marker);
          }else{
            MapsAPI.addInfoWindowListener(result.desc,map,marker);
          };
        });
      }
    })
    .catch((err)=>{
      alert(`Ocorreu um erro ao carregar o mapa :(`);
    });
  }

  fetchLocationData = (location) => {
    fetch(this.getLocatioUrlById(location)).then(res => res.json()).then(data => {
      console.log(data);
      let currentLocation = {};
      currentLocation.name = data.response.venue.name;
      currentLocation.coordinates = {'lat': data.response.venue.location.lat, 'lng': data.response.venue.location.lng};
      currentLocation.desc = '';
      if (data.response.venue.categories[0]){
        currentLocation.desc += `Category: ${data.response.venue.categories[0].name}; `;
      }
      if (data.response.venue.hours && data.response.venue.hours.status){
        currentLocation.desc += `Status: ${data.response.venue.hours.status}`;
      }
      console.log(currentLocation);
      return currentLocation;
    })
  }

  componentWillMount() {
    //Inicia o maps antes de montar,  pra quando montar já ter disponível pra uso
    MapsAPI.getGoogleMaps();
  }


  componentDidMount() {
    this.initMapAndItsComponents();
    //Se não houverem localizações
    if (this.state.locations.length ===0){
      let itemsProcessed = 0;
      let updatedLocations = [];
      let sequence = Promise.resolve();
      this.state.locationsIds.forEach((id) => {
        console.log(updatedLocations);
        sequence = sequence.then(() => {
          updatedLocations.push(this.fetchLocationData(id));
        });
        itemsProcessed++;
        if (itemsProcessed >= this.state.locationsIds.length){
          sequence = sequence.then(() => {
            this.setState({locations: updatedLocations})
          });
        }
      });
      console.log(`updatedLocations no final é ${updatedLocations}`);
      console.log(`this.state.locations no final é ${this.state.locations}`);
    }
  }

  render() {
    this.updateResults();
    return (
      <div className="container">
        <Filter updateQuery={this.updateQuery} showLocation={this.showLocation} results={this.state.results} location={this.state.location}/>
        <Navbar />
        <Mapa results={this.state.results} location={this.state.location} locations={this.state.locations}/>
      </div>
    );
  }
}

export default App;
