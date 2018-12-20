import React from 'react'

class ErrorBoundary extends React.Component {

  render() {
    if (this.props.error === 'ao carregar o mapa') {
      return (
        <div id="map-load-error-container">
          <h2 id="map-load-error">
            Ocorreu um erro ao carregar o mapa :(
          </h2>
        </div>
      );
    }
    // Caso não haja erro, apenas renderizar a children (Mapa)
    return this.props.children;
  }  
}

export default ErrorBoundary