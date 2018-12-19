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
        <div>
          <h2>Ocorreu um erro ao carregar o mapa :(</h2>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }  
}

export default ErrorBoundary