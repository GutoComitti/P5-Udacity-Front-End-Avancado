import React from 'react';

const Error4sq = (props) => {
	if (props.errorInfo){
		console.log(props.errorInfo);		
	}
	return (
		<div id="error-container">
          <h3>Ocorreu um erro {props.error} :(</h3>
        </div>
	)
}

export default Error4sq