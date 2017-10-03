//Objeto que cuidará da lógica principal do jogo
var gameScreen = function(manager, gMode){
	//Definir o canvas que será usado ou criar um caso este não exista
	var gameScreenCanvas = gameScreenCanvas || manager.createCanvas(manager.getGameWidth(), manager.getGameHeight());
	var gameScreenCtx = gameScreenCanvas.getContext('2d');
	
	var clickPosX;
	var clickPosY;
	
	var gameMode = gMode;
	
	var gameElements = [];
	var bElementsCreated = false;
	
	var buttonPadding = 15;
	var edgePadding = 5;
	
	var numberOfGames = 0;
	var numberOfVictories = 0;
	
	//TODO Verificar o caso de duplo-clique
	
	function createElements() {
		//Variável auxiliar para desenhar os sprites na altura correta
		var auxHeight = 0;
		
		//Cria o botão Exit
		gameElements.push({
			elemName: "Exit",
			src: manager.getGameImages()['GameStage/Button_Exit'],
			left: gameScreenCanvas.width - manager.getGameImages()['GameStage/Button_Exit'].width - edgePadding,
			top: auxHeight,
			width: manager.getGameImages()['GameStage/Button_Exit'].width,
			height: manager.getGameImages()['GameStage/Button_Exit'].height
		});		
						 
		//Cria o botão do papel
		gameElements.push({
			elemName: "Paper",
			src: manager.getGameImages()['GameStage/Button_Paper'],
			left: (gameScreenCanvas.width - manager.getGameImages()['GameStage/Button_Paper'].width)/2,
			top: gameScreenCanvas.height - manager.getGameImages()['GameStage/Button_Paper'].height - edgePadding,
			width: manager.getGameImages()['GameStage/Button_Paper'].width,
			height: manager.getGameImages()['GameStage/Button_Paper'].height
		});
		auxHeight += gameScreenCanvas.height - manager.getGameImages()['GameStage/Button_Paper'].height - edgePadding;	
		
		//Cria o botão da pedra
		gameElements.push({
			elemName: "Rock",
			src: manager.getGameImages()['GameStage/Button_Rock'],
			left: (gameScreenCanvas.width - 3*manager.getGameImages()['GameStage/Button_Rock'].width)/2 - edgePadding,
			top: auxHeight - manager.getGameImages()['GameStage/Button_Rock'].height/2 - buttonPadding,
			width: manager.getGameImages()['GameStage/Button_Rock'].width,
			height: manager.getGameImages()['GameStage/Button_Rock'].height
		});	

		//Cria o botão da tesoura
		gameElements.push({
			elemName: "Scissors",
			src: manager.getGameImages()['GameStage/Button_Scissors'],
			left: (gameScreenCanvas.width + manager.getGameImages()['GameStage/Button_Scissors'].width)/2 + edgePadding,
			top: auxHeight - manager.getGameImages()['GameStage/Button_Scissors'].height/2 - buttonPadding,
			width: manager.getGameImages()['GameStage/Button_Scissors'].width,
			height: manager.getGameImages()['GameStage/Button_Scissors'].height
		});		
		
		bElementsCreated = true;
	};
	
	function drawStaticElements(){
		//Desenha o painel superior
		gameScreenCtx.drawImage(manager.getGameImages()['GameStage/Pannel_Upper'],
							   0,
							   0,
							   manager.getGameImages()['GameStage/Pannel_Upper'].width,
							   manager.getGameImages()['GameStage/Pannel_Upper'].height);

		//Desenha o painel inferior
		gameScreenCtx.drawImage(manager.getGameImages()['GameStage/Pannel_Lower'],
							   0,
							   gameScreenCanvas.height - manager.getGameImages()['GameStage/Pannel_Lower'].height,
							   manager.getGameImages()['GameStage/Pannel_Lower'].width,
							   manager.getGameImages()['GameStage/Pannel_Lower'].height);

		//Desenha texto do número de jogos
		gameScreenCtx.font = "18px Buxton Sketch";
		gameScreenCtx.fillStyle = "white";
		gameScreenCtx.fillText("Number of games: "+numberOfGames, 5, 20);
		
		//Desenha texto do número de vitórias
		gameScreenCtx.font = "18px Buxton Sketch";
		gameScreenCtx.fillStyle = "white";
		gameScreenCtx.fillText("Number of victories: "+numberOfVictories, 5, 40);
	}
	
	draw = function(delta){
		//Cria os elementos a ser desenhados caso eles não existam
		if(!bElementsCreated) createElements();
		
		//Limpa o canvas para o próximo frame
		gameScreenCtx.clearRect(0,0,gameScreenCanvas.width, gameScreenCanvas.height);
		
		//Desenha os elementos estáticos de decoração da tela
		drawStaticElements();
		
		gameElements.forEach(function(gameElement) {		
			//Desenha os elementos criados de interação com o player		
			gameScreenCtx.drawImage(gameElement.src,gameElement.left,gameElement.top,gameElement.width,gameElement.height);
			
			//Verifica se o player selecionou algum botão
			if (clickPosY > gameElement.top && clickPosY < gameElement.top + gameElement.height 
				&& clickPosX > gameElement.left && clickPosX < gameElement.left + gameElement.width) {
				switch (gameElement.elemName){
					//Pedra selecionada
					case "Rock": console.log("Rock Clicked"); break;
					//Papel selecionado
					case "Paper": console.log("Paper Clicked"); break;
					//Tesouras selecionadas
					case "Scissors": console.log("Scissors Clicked"); break;
					//Volta à Splash Screen
					case "Exit": manager.callStartStage(0); break;
					//Desconsidera o clique caso não seja nenhum dos elementos
					default: clickPosX = 0; clickPosY = 0;
				}
			}
		});			
	}
	
	//Define as funções e variáveis que serão de escopo público
	return {
		stageLoop: function(delta){
			//Desenha o canvas
			draw(delta);
			
			//Verifica qual modo está sendo jogado
			switch(gameMode){
				case 1: console.log("Vs Player Mode Started"); break;
				case 2: console.log("Vs Computer Mode Started"); break;
				default: alert('An error seems to have happened, please try again!'); manager.callStartStage(0); break;
			}
			
			//Checa se o player selecionou algum elemento
			if((clickPosX > 0) || (clickPosY > 0)){
				//Zera as variáveis para que não repita a chamada
				clickPosX = 0;
				clickPosY = 0;
			}
		},
		
		toDraw: gameScreenCanvas,
		
		getClickPos: function(PosX, PosY){
			clickPosX = PosX;
			clickPosY = PosY;
		}
	};
}
