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
    locations: [
      {name: "nome do primeiro lugar",
      id: "asdFQF"
      },
      {name: "nome do segundo lugar",
      id: "feqijFE"}
    ],
    location: {}
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
    debugger;
    if (location !== this.state.location){
      this.setState({location: location});
      debugger;
    }
  }

  createMarker = (content, position, map) =>{
    MapsAPI.addMarker(content, position, map);
  }

  componentWillMount() {
    //Inicia o maps antes de montar, pra quando montar já ter disponível pra uso
    MapsAPI.getGoogleMaps();
  }

  componentDidMount() {
    //Quando a API do maps terminar de carregar, inicia o mapa
    MapsAPI.getGoogleMaps().then((google) => {
      MapsAPI.initMap(google, 'map', {center: {lat: 200.12, lng: 200.15}, zoom: 12})
      
      // const uluru = {lat: -25.363, lng: 131.044};
      // const map = new google.maps.Map(document.getElementById('map'), {
      //   zoom: 4,
      //   center: uluru
      // });
      // const marker = new google.maps.Marker({
      //   position: uluru,
      //   map: map
      // });
    })
    // .catch((err)=>{
    //   //TODO: Error handling na hora de carregar o mapa!
    //   console.log(`deu ruim, erro: ${err}`);
    // });
  }

  render() {
    debugger;
//Checa se há alguma query;
//se houver alguma query, filtra os locais de acordo com a query;
//checa se o resultado da query é diferente do array results;
//se for, atualiza o estado pro resultado da query, evitando atualizar o estado e gerar mais renderização desnecessariamente
    if (this.state.query){
      const queryResults = this.state.locations.filter((location) => (location.name.includes(this.state.query)));
      if (!(JSON.stringify(queryResults)===JSON.stringify(this.state.results))){
        this.setState({results: queryResults});
      }
    }
    return (
      <div className="container">
        <Navbar />
        <Filter updateQuery={this.updateQuery} showLocation={this.showLocation} results={this.state.results} location={this.state.location}/>
        <Mapa results={this.state.results} location={this.state.location} locations={this.state.locations}/>
      </div>
    );
  }
}

export default App;
