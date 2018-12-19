import React from 'react'

class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
  }
  
  
  
  render() {
    debugger;
    if (this.props.error === 'ao carregar o mapa') {
      // Error path
      return (
        <div id="map-load-error-container">
          <h2 id="map-load-error">Ocorreu um erro ao carregar o mapa :(</h2>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }  
}

export default ErrorBoundary