//Começar o game ao terminar de carregar a janela
window.onload = function(){
	//Variáveis globais
	var canvas = document.getElementById('gameCanvas');
	var ctx = canvas.getContext('2d');
	
	var gameWidth = canvas.width;
	var gameHeight = canvas.height;	
	var gameImages;
	
	var now = timestamp();
	var last = timestamp();
	var deltaTime = now - last;
	
	var stage = {};
	var currentStage = 0;
	
	preloadImageAssets(['Image_BackGround',
	 				    'GameStage/Button_Exit',
						'GameStage/Button_Paper',
						'GameStage/Button_Rock',
						'GameStage/Button_Scissors',
						'GameStage/Pannel_Lower',
						'GameStage/Pannel_Upper',
						'GameStage/Result_Paper',
						'GameStage/Result_Rock',
						'GameStage/Result_Scissors',
						'GameStage/Text_Lose',
						'GameStage/Text_Win',
						'MainMenu/Button_Quit',
						'MainMenu/Button_VsComp',
						'MainMenu/Button_VsPlayer',
						'MainMenu/Text_Choose',
						'SplashMenu/Text_Begin',
						'SplashMenu/Text_Title'],
					startStage);	
					
	function startStage(images){
		//Guarda uma referência para as imagens
		if(gameImages == undefined) gameImages = images;
		
		//Verifica qual stage estamos iniciando
		switch(currentStage){
			case 0: stage = splashScreen(this); break;
			case 1: stage = menuScreen(this); break;
			case 2: stage = gameScreen(this); break;
			default: stage = splashScreen(this);
		}
		
		//Começa o loop principal do jogo
		run();
	}
	
	//Game Loop principal
	function run() {		
		//Atualiza as variáveis de temporização do loop, delta será em milisegundos e limitado a 1 segundo no máximo
		now = timestamp();
		deltaTime = Math.min(1, (now - last)/1000);
		
		//Desenhar a imagem de fundo comum para todas as telas
		ctx.drawImage(gameImages['Image_BackGround'],0,0,gameImages['Image_BackGround'].width,gameImages['Image_BackGround'].height);
		
		//Desenhar o canvas específico de cada stage
		stage.stageLoop(deltaTime);
		ctx.drawImage(stage.toDraw,0,0,gameWidth,gameHeight);
		
		//Atualiza a variável de temporização do loop
		last = now;
		
		//Chama o loop de jogo novamente
		requestAnimationFrame(run);
	};
	
	//Envia os cliques para os stages
	canvas.addEventListener('click', function(e){if(stage != undefined) stage.getClickPos(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetY);}, false);
	
	//--------------------------------------------------Helpers-------------------------------------------------
	getGameWidth = function(){return gameWidth;};
	getGameHeight = function(){return gameHeight;};
	getGameImages = function(){return gameImages;};
	
	callStartStage = function(stageToChange){currentStage = stageToChange; startStage();};
	
	//--------------------------------------------Funções auxiliares--------------------------------------------
	//Preload de todos os assets que o jogo precisará
	function preloadImageAssets(preloadImages, callback){
		var loadedImages = {};
		var imgNumber = 0;
		
		//Retorna da função ao carregar todas as imagens
		var onLoad = function(){
			if(imgNumber >= preloadImages.length-1)
				callback(loadedImages);
			else
				imgNumber++;		
		};
		
		//Loop por todos os nome presentes, salvando-os em uma variável e executando uma contagem de quantos já foram carregados no listener
		for(var i=0; i<preloadImages.length; i++){
			imageName = preloadImages[i];
			loadedImages[imageName] = document.createElement('img');
			loadedImages[imageName].addEventListener('load', onLoad);
			loadedImages[imageName].src = "images/"+imageName+".png";
		}
	}
	
	//Timestamp para poder manipular animações melhor
	function timestamp(){
		//Ajuste para o caso de browser mais antigos sendo usados
		return (window.performance && window.performance.now)? window.performance.now() : new Date().getTime();
	}
	
	//Criar um canvas que será usado nos stages
	createCanvas = function (width, height){
		//Remove quaisquer stages que possam existir ainda
		while (canvas.firstChild)
			canvas.removeChild(canvas.firstChild);

		var childCanvas = document.createElement('canvas');
		childCanvas.width = width;
		childCanvas.height = height;
		canvas.appendChild(childCanvas);
		return childCanvas;
	}
}
