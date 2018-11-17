import React, { Component } from 'react';
import '../App.css';

class Filter extends Component {

	render() {
debugger;
    	return (
    		<div id="filter-container">
    			<input id="filter-input"
    			type="text" 
          		placeholder="Search for a location" 
          		value={this.props.query}
          		onChange={(event) => this.props.updateQuery(event.target.value)}
          		/>
    			<ul id="results-list">
    				{this.props.results.map((result) => (
    					<li key={result.id} onClick={this.props.showLocation(result)}>
    						<p>{result.name}</p>
    					</li>
    				))}
    			</ul>
    		</div>
		)
	}
}

export default Filter