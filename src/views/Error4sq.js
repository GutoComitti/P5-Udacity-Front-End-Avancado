import React from 'react';

const Error4sq = (props) => {
	return (
		<div id="error-container">
			<h3>
				{props.error!=='ao carregar o mapa' &&(
					<span>Ocorreu um erro ao carregar dados do local</span>
				)}
        	</h3>
        </div>
	)
}

export default Error4sq