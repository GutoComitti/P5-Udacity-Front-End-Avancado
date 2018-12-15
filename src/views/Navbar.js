import React, { Component } from 'react'

class Navbar extends Component {
//TODO: Entender a funcionalidade do breadcrumb: será que quando clicar é pra aparecer o filtro? Se for, fazer um event listener
//pra quando clicar setar algum state e o app verificar na renderização e display o componente filter

	render() {

    	return (
    		<nav>
    			<button tabIndex="0" aria-label="Abrir filtro" className="toolbar-search-icon" onClick={() => this.props.toggleExtendFilter()}>&#9776;</button>
    			<h1>Joinville Places</h1>
    			<p><a href="https://pt.foursquare.com/">Powered by Foursquare</a></p>
    		</nav>
		)
	}
}

export default Navbar