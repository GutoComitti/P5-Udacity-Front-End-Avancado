import React, { Component } from 'react';
import '../App.css';

class Filter extends Component {

	render() {
    	return (
    		<div id="filter-container">
    			<h1>Guto Locations</h1>
    			<input id="filter-input"
    			aria-label="campo do filtro de localizações"
    			type="text" 
          		placeholder="Search for a location" 
          		value={this.props.query}
          		onChange={(event) => this.props.updateQuery(event.target.value)}
          		/>
    			<ul aria-label="Resultados do filtro" id="results-list">
    				{this.props.results.map((result) => (
    					<li key={result.id} onClick={() => this.props.showLocation(result)}>
    						<p>{result.name}</p>
    					</li>
    				))}
    			</ul>
    		</div>
		)
	}
}

export default Filter