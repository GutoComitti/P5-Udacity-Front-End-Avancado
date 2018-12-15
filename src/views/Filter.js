import React, { Component } from 'react';

const Filter = (props) => {
	return (
		<div id="filter-container" 
    >
		<h1>Search</h1>
		<input id="filter-input"
    	aria-label="Campo do filtro de localizações"
    	type="text" 
    	placeholder="Insert a location" 
    	value={props.query}
    	onChange={(event) => props.updateQuery(event.target.value)}
		/>
		<ul aria-label="Resultados do filtro" id="results-list">
			{props.results.map((result) => (
				<li key={result.id} onClick={() => props.openInfoWindow(result.infoWindow, result.marker)}>
					<p>{result.name}</p>
				</li>
			))}
		</ul>
	</div>
	)
}

export default Filter