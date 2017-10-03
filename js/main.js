//Começar o game ao terminar de carregar a janela
window.onload = function(){
	//Variáveis globais
	var canvas = document.getElementById('gameCanvas');
	var ctx = canvas.getContext('2d');
	
	var gameWidth = canvas.width;
	var gameHeight = canvas.height;	
	var gameImages;
	
	var bMakeTransition;	
	var bFadeIn;
	var bFadeOut;
	var transitionStep = 2.25;
	var tempAlpha = 1;
	
	var now = timestamp();
	var last = timestamp();
	var deltaTime = now - last;
	
	var stage = {};
	var currentStage = 0;
	
	var gameMode = 0;
	
	//TODO Corriger a primeira transição de entrada
	
	preloadImageAssets(['Image_BackGround',
	 				    'GameStage/Button_Exit',
						'GameStage/Button_Exit_Hover',
						'GameStage/Button_Paper',
						'GameStage/Button_Rock',
						'GameStage/Button_Scissors',
						'GameStage/Button_Paper_Hover',
						'GameStage/Button_Rock_Hover',
						'GameStage/Button_Scissors_Hover',
						'GameStage/Pannel_Lower',
						'GameStage/Pannel_Upper',
						'GameStage/Result_Paper',
						'GameStage/Result_Rock',
						'GameStage/Result_Scissors',						
						'GameStage/Text_Draw',
						'GameStage/Text_Lose',
						'GameStage/Text_Win',
						'MainMenu/Button_Quit',
						'MainMenu/Button_VsComp',
						'MainMenu/Button_VsPlayer',
						'MainMenu/Button_Quit_Hover',
						'MainMenu/Button_VsComp_Hover',
						'MainMenu/Button_VsPlayer_Hover',
						'MainMenu/Text_Choose',
						'SplashMenu/Text_Begin',
						'SplashMenu/Text_Title'],
					startStage);	
	
	function startStage(images){
		//Configura a tela de transição
		bMakeTransition = true;
		bFadeIn = true;
		bFadeOut = true;	
			
		//Verifica se é a primeira vez que o método está sendo rodado
		if(gameImages == undefined){
			//Guarda uma referência para as imagens
			gameImages = images;
			
			//Na primeira transição não precisa dar um fade para a tela preta
			bFadeIn = false;
		}
		
		//Verifica qual stage estamos iniciando
		switch(currentStage){
			case 0: stage = splashScreen(this); break;
			case 1: stage = menuScreen(this); break;
			case 2: stage = gameScreen(this, gameMode); break;
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
		
		//Transição de stages		
		if(bMakeTransition){
			//Cria um canvas temporário para a transição
			var transitionCanvas = transitionCanvas || createCanvas(gameWidth, gameHeight);
			var transitionCtx = transitionCanvas.getContext('2d');
			
			//Prepara uma tela escura de Fade In/Out
			transitionCtx.beginPath();
			transitionCtx.rect(0, 0, gameWidth, gameHeight);			
		
			//Se for para mostrar a tela de transição
			if(bFadeIn){
				if(tempAlpha <= (1 - transitionStep*deltaTime))		
					tempAlpha += transitionStep*deltaTime;
				else {
					bFadeIn = false;
					tempAlpha = 1;
				}
			}	
		
			//Se for para esconder a tela de transição e já tiver terminado o Fade In
			if(!bFadeIn && bFadeOut){
				if(tempAlpha >= transitionStep*deltaTime)						
					tempAlpha -= transitionStep*deltaTime;						
				else {
					bFadeOut = false;
					tempAlpha = 0;
				}
			}			

			//Aplica a transparência à tela de transição
			transitionCtx.fillStyle='rgb(0,0,0,'+tempAlpha+')';
			transitionCtx.fill();
			transitionCtx.closePath();
			
			//Desenha a tela de transição
			ctx.drawImage(transitionCanvas,0,0,gameWidth,gameHeight);
			
			if (!bFadeIn && !bFadeOut) {bMakeTransition = false; transitionCanvas = null};
		} else {			
			//Desenhar o canvas específico de cada stage
			stage.stageLoop(deltaTime);
			ctx.drawImage(stage.toDraw,0,0,gameWidth,gameHeight);
		}
		
		//Atualiza a variável de temporização do loop
		last = now;
		
		//Chama o loop de jogo novamente
		requestAnimationFrame(run);
	};
	
	//Envia os cliques para os stages
	canvas.addEventListener('click', function(e){if(stage != undefined) stage.getClickPos(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);}, false);
	
	//Envia a posição do mouse para os stages
	canvas.addEventListener('mousemove', function(e){if(stage != undefined) stage.getMousePos(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);}, false);
	
	//--------------------------------------------------Helpers-------------------------------------------------
	getGameWidth = function(){return gameWidth;};
	getGameHeight = function(){return gameHeight;};
	getGameImages = function(){return gameImages;};
	
	setGameMode = function(gMode){gameMode = gMode;}
	
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
