# Projeto Mapa do Bairro

***FUNCIONALIDADE DO APLICATIVO***

* Este é um projeto de um mapa do bairro Centro de Joinville, com alguns locais marcados. 
* Foram utilizados dados do site https://pt.foursquare.com/
* O mapa possui os locais marcados, e com o filtro é possível buscar por algum local específico. Um balão com informações sobre o local é mostrado quando se clica no nome do local no filtro, ou no local no mapa.

***INSTALANDO O APLICATIVO***

Para instalar o aplicativo, é necessário:

* Abrir a linha de comando na pasta onde se quer colocar a pasta do aplicativo
* Instalar o yarn com o comando:
	yarn install
* Clonar o repositório, com o comando:
	git clone https://github.com/GutoComitti/P5-Udacity-Front-End-Avancado.git
* Na linha de comando, entrar na pasta do aplicativo, com o comando:
	cd P5-Udacity-Front-End-Avancado
* Na linha de comando, iniciar o servidor, com o comando:
	yarn start
* Abrir o aplicativo em um navegador qualquer, no endereço:
	http://localhost:3000
* Agora o aplicativo está funcionando no navegador, na página do navegador que foi aberta

** Para utilizar service workers para trabalhar offline durante o desenvolvimento, logo após entrar na pasta do aplicativo,
gerar a build com o comando:
	npm run build;
e depois servir os arquivos da pasta build com algum servidor de sua escolha.