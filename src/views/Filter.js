import React, { Component } from 'react';
import '../App.css';

class Filter extends Component {
	render() {
    	return (
    		<div id="filter-container" 
          >
    			<h1>Search</h1>
    			<input id="filter-input"
    			aria-label="Campo do filtro de localizações"
    			type="text" 
          		placeholder="Insert a location" 
          		value={this.props.query}
          		onChange={(event) => this.props.updateQuery(event.target.value)}
          		/>
    			<ul aria-label="Resultados do filtro" id="results-list">
    				{this.props.results.map((result) => (
    					<li key={result.id} onClick={() => this.props.openInfoWindow(result.infoWindow, result.marker)}>
    						<p>{result.name}</p>
    					</li>
    				))}
    			</ul>
    		</div>
		)
	}
}

export default Filter