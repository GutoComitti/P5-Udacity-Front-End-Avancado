import React, { Component } from 'react';

const Error = (props) => {
	console.log(props.errorInfo);
	return (
		<div id="error-container">
          <h3>Ocorreu um erro {props.error} :(</h3>
        </div>
	)
}

export default Error