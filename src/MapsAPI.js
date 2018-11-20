     //Função pra criar um mapa no elemento de id element e com configurações config (objeto)
//Inicia um mapa, em dado elemento (do DOM) e com a configuração de acordo com o objeto config passado
//Exemplo de config: {center: {lat: 40.12, lng: 200.15}, zoom: 12}
// debugger;
// const google = window.google;
// console.log(`google é ${google}`);
// console.log(`window.google é ${window.google}`);

export const initMap = (google, element, config) => {
	const map = new window.google.maps.Map(
		document.getElementById(element), config
	);
  return map;
}

//Adiciona um marker pro mapa, dado um mapa, posição e conteúdo
//position é um objeto com key value pairs, no formato {lat: 40.74135, lng: -73.99802}
export const addMarker = (content, position, map) =>{
	const marker = new window.google.maps.Marker({
    	position: position,
    	map: map
  });
  return marker;
}


export const addInfoWindowListener = (content, map, marker) =>{
  var infoWindow = new window.google.maps.InfoWindow({content: content})
  marker.addEventListener('click',infoWindow.open(map, marker));
}

export const addInfoWindowListenerAndOpen = (content, map, marker) =>{
  var infoWindow = new window.google.maps.InfoWindow({content: content})
  marker.addEventListener('click',infoWindow.open(map, marker));
  infoWindow.open(map, marker);
}

export const getGoogleMaps = () => {
    //Caso a promise ainda não esteja definida, ela é definida
    if (!window.googleMapsPromise) {
      window.googleMapsPromise = new Promise((resolve) => {
        window.resolveGoogleMapsPromise = () => {
          resolve(window.google);
          delete window.resolveGoogleMapsPromise;
        };
        //Cria o script no DOM pra carregar o Maps Api
        // const key = 'AIzaSyAph94kHgFlxXgTW_62vr2XVc9j5rXUnL0'; => chave antiga, do projeto do curso de apis
        const key = 'AIzaSyC4KgRuOBHyFpm9pb0Ym4vmvVVBByCJ8ik';
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&v=3&callback=resolveGoogleMapsPromise`
        script.async = true;
        document.body.appendChild(script);
      });
    }

    //Retorna a promise pro maps api
    return window.googleMapsPromise;
  }