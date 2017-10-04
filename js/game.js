//Objeto que cuidará da lógica principal do jogo
var gameScreen = function(manager, gMode){
	//Definir o canvas que será usado ou criar um caso este não exista
	var gameScreenCanvas = gameScreenCanvas || manager.createCanvas(manager.getGameWidth(), manager.getGameHeight());
	var gameScreenCtx = gameScreenCanvas.getContext('2d');
	
	var clickPosX;
	var clickPosY;
	
	var mousePosX;
	var mousePosY;
	
	var gameMode = gMode;
	
	var gameElements = [];
	var bElementsCreated = false;
	
	var resultScreenTop = 0;
	var resultScreenBottom = 0;
	
	var buttonPadding = 15;
	var edgePadding = 5;
	
	var numberOfGames = 0;
	var numberOfVictories = 0;
	
	var roundChoice = '';
	var roundOpponentChoice = '';
	var bIsPlaying = false;
	
	var animSpeed = 100;
	
	var defaultAnimTime = 100;
	var choicesAnimTime = 0;
	
	var defaultScreenTimer = 125;
	var resultScreenTimer = 0;
	var resultScreenWait = 115;
	
	var vsCompEndTimer = 0;
	var vsCompEndTimerDefault = 3;
	
	var scoreAdded = false;
	
	function createElements() {
		//Variável auxiliar para desenhar os sprites na altura correta
		var auxHeight = 0;
		
		//Cria o botão Exit
		gameElements.push({
			elemName: "Exit",
			src: manager.getGameImages()['GameStage/Button_Exit'],
			hover: manager.getGameImages()['GameStage/Button_Exit_Hover'],
			left: gameScreenCanvas.width - manager.getGameImages()['GameStage/Button_Exit'].width - edgePadding,
			top: auxHeight,
			width: manager.getGameImages()['GameStage/Button_Exit'].width,
			height: manager.getGameImages()['GameStage/Button_Exit'].height
		});		
						 
		//Cria o botão do papel
		gameElements.push({
			elemName: "Paper",
			src: manager.getGameImages()['GameStage/Button_Paper'],
			hover: manager.getGameImages()['GameStage/Button_Paper_Hover'],
			left: (gameScreenCanvas.width - manager.getGameImages()['GameStage/Button_Paper'].width)/2,
			top: gameScreenCanvas.height - manager.getGameImages()['GameStage/Button_Paper'].height - edgePadding,
			width: manager.getGameImages()['GameStage/Button_Paper'].width,
			height: manager.getGameImages()['GameStage/Button_Paper'].height,
			beats: ["Rock"]
		});
		auxHeight += gameScreenCanvas.height - manager.getGameImages()['GameStage/Button_Paper'].height - edgePadding;	
		
		//Cria o botão da pedra
		gameElements.push({
			elemName: "Rock",
			src: manager.getGameImages()['GameStage/Button_Rock'],
			hover: manager.getGameImages()['GameStage/Button_Rock_Hover'],
			left: (gameScreenCanvas.width - 3*manager.getGameImages()['GameStage/Button_Rock'].width)/2 - edgePadding,
			top: auxHeight - manager.getGameImages()['GameStage/Button_Rock'].height/2 - buttonPadding,
			width: manager.getGameImages()['GameStage/Button_Rock'].width,
			height: manager.getGameImages()['GameStage/Button_Rock'].height,
			beats: ["Scissors"]
		});	

		//Cria o botão da tesoura
		gameElements.push({
			elemName: "Scissors",
			src: manager.getGameImages()['GameStage/Button_Scissors'],
			hover: manager.getGameImages()['GameStage/Button_Scissors_Hover'],
			left: (gameScreenCanvas.width + manager.getGameImages()['GameStage/Button_Scissors'].width)/2 + edgePadding,
			top: auxHeight - manager.getGameImages()['GameStage/Button_Scissors'].height/2 - buttonPadding,
			width: manager.getGameImages()['GameStage/Button_Scissors'].width,
			height: manager.getGameImages()['GameStage/Button_Scissors'].height,
			beats: ["Paper"]
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
		//Variável auxiliar para o desenho do resultado posteriormente
		resultScreenTop = manager.getGameImages()['GameStage/Pannel_Upper'].height;

		//Desenha o painel inferior
		gameScreenCtx.drawImage(manager.getGameImages()['GameStage/Pannel_Lower'],
							   0,
							   gameScreenCanvas.height - manager.getGameImages()['GameStage/Pannel_Lower'].height,
							   manager.getGameImages()['GameStage/Pannel_Lower'].width,
							   manager.getGameImages()['GameStage/Pannel_Lower'].height);
		//Variável auxiliar para o desenho do resultado posteriormente
		resultScreenBottom = gameScreenCanvas.height - manager.getGameImages()['GameStage/Pannel_Lower'].height;

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
			//Desenha os elementos criados de interação com o player em seu estado de hover ou descanso
			if (mousePosY > gameElement.top && mousePosY < gameElement.top + gameElement.height 
				&& mousePosX > gameElement.left && mousePosX < gameElement.left + gameElement.width)
				//Não mostrar o hover na tela de resultados e nem caso player esteja só observando
				if((bIsPlaying && (gameMode == 1)) || ((gameMode != 1) && (gameElement.elemName != "Exit")))
					gameScreenCtx.drawImage(gameElement.src,gameElement.left,gameElement.top,gameElement.width,gameElement.height);
				else
					gameScreenCtx.drawImage(gameElement.hover,gameElement.left,gameElement.top,gameElement.width,gameElement.height);
			else
				gameScreenCtx.drawImage(gameElement.src,gameElement.left,gameElement.top,gameElement.width,gameElement.height);
			
			//Se não estamos jogando
			if(!bIsPlaying || (gameMode != 1))
				//Verifica se o player selecionou algum botão
				if (clickPosY > gameElement.top && clickPosY < gameElement.top + gameElement.height 
					&& clickPosX > gameElement.left && clickPosX < gameElement.left + gameElement.width) {
						//Apenas para o modo Vs. Player ou foi selecionado o botão de saída selecionado
						if (gameElement.elemName == "Exit")
							//Volta à Splash Screen
							manager.callStartStage(1);
						else if (gameMode == 1)
							//Opção selecionada
							roundChoice = gameElement.elemName;
						
						//Reseta o clique ao final
						clickPosX = 0; 
						clickPosY = 0;
				}
		});			
	}
	
	//Função com a lógica do jogo contra um jogador humano
	function PlayVsPlayer(deltaTime){
		play(deltaTime, (gameMode != 1));
	}
	
	//Função com a lógica do jogo contra o computador
	function PlayVsComputer(deltaTime){
		if (roundChoice == '') roundChoice = pickRandomChoice();	
		play(deltaTime, (gameMode != 1));
	}
	
	function play(deltaTime,bAutomated){
		//Se o player 1 já escolheu uma opção e o resultado não está sendo avaliado
		if ((roundChoice != '') && !bIsPlaying){
			bIsPlaying = true;
			
			//Escolhe uma opção para o adversário
			roundOpponentChoice = pickRandomChoice();						
		}
		
		//Se o player 1 já escolheu o que jogar e estamos jogando
		if((roundOpponentChoice != '') && bIsPlaying){
			//Desenha as opções escolhidas na tela
			drawChoices(roundChoice,roundOpponentChoice, deltaTime, bAutomated);
			
			//Verifica se o player 1 (primeiro parâmetro) venceu o adversário (segundo parâmetro)
			var victory = checkChoices(roundChoice, roundOpponentChoice);
			
			//Desenha o resultado da partida
			drawResult(victory,deltaTime);

			//Adiciona o resultado do jogo ao placar caso ainda não tenha sido adicionado
			if(!scoreAdded){
				scoreAdded = true;
				
				numberOfGames++;

				//Escreve o número de vitórias apenas em jogos vs. Player
				if(victory == 'Win') numberOfVictories++;
				if(bAutomated) numberOfVictories = '';
			}
			
			//Verifica se estamos jogando Vs. Comp para reiniciar o jogo
			if(bAutomated){
				//Autaliza o tempo de espera
				vsCompEndTimer += deltaTime;
				
				//Reseta o jogo ao final do timer
				if(vsCompEndTimer >= vsCompEndTimerDefault){
					vsCompEndTimer = 0;
					resetGame();
				}
			}
		}
	}
	
	function pickRandomChoice(){
		var choice = '';
		//Escolher um número aleatório entre 0 e o comprimento do vetor de elementos (+1 para desconsiderar o primeiro elemento "Exit")
		var pick = Math.floor(Math.random() * gameElements.length) + 1;
		if((pick > 0) && (pick < gameElements.length))
			choice = gameElements[pick].elemName;
		else
			choice = pickRandomChoice();
		return choice;
	}
	
	//Função que verifica se a escolha 1 ganhoou da escolha 2
	function checkChoices(choice1,choice2){
		//Se as duas opções forem iguais a partida é um empate
		if (choice1 == choice2) return "Draw";
		
		//Encontra qual é o elemento selecionado
		var p1;
		gameElements.every(function(gameElement) {			
			if(gameElement.elemName == choice1){				
				p1 = gameElement;
				return false;
			}
			return true;
		});
		
		//Se o p1 derrotar a opção do oponente retorna Vitória
		if(p1.beats == choice2) return "Win";
		//Caso contrário é uma derrota
		else return "Lose";
	}	
	
	//Função que desenha a opção 1 na parte da tela mais abaixo da opção 2
	function drawChoices(choice1,choice2,deltaTime,bAutomated){
		//Autaliza o tempo de animação
		choicesAnimTime += animSpeed*deltaTime;
		
		gameScreenCtx.save();		
					
		//Desenha um fundo para indicar que os resultados estão sendo mostrados apenas se for Vs. Player
		if(!bAutomated){		
			//Animação de Fade In
			gameScreenCtx.globalAlpha = choicesAnimTime/defaultAnimTime;
			
			gameScreenCtx.beginPath();
			gameScreenCtx.rect(0, 0, gameScreenCanvas.width, gameScreenCanvas.height);
			gameScreenCtx.fillStyle='rgb(0,0,0,0.5)';
			gameScreenCtx.fill();
			gameScreenCtx.closePath();
		}
		//Ou sobre a caixa com as opções caso seja Vs. Comp
		else{
			gameScreenCtx.beginPath();
			gameScreenCtx.rect(0, resultScreenBottom, gameScreenCanvas.width, gameScreenCanvas.height);
			gameScreenCtx.fillStyle='rgb(0,0,0,0.65)';
			gameScreenCtx.fill();
			gameScreenCtx.closePath();
			
			//Animação de Fade In
			gameScreenCtx.globalAlpha = choicesAnimTime/defaultAnimTime;
		}		
		
		//Desenha a escolha do jogador
		gameScreenCtx.drawImage(manager.getGameImages()['GameStage/Result_'+choice1],
							   (gameScreenCanvas.width - manager.getGameImages()['GameStage/Result_'+choice1].width)/2,
							   resultScreenBottom - manager.getGameImages()['GameStage/Result_'+choice1].height*3/2,
							   manager.getGameImages()['GameStage/Result_'+choice1].width,
							   manager.getGameImages()['GameStage/Result_'+choice1].height);
							   
		//Desenha a escolha do oponente
		gameScreenCtx.drawImage(manager.getGameImages()['GameStage/Result_'+choice2],
							   (gameScreenCanvas.width - manager.getGameImages()['GameStage/Result_'+choice2].width)/2,
							   resultScreenTop + manager.getGameImages()['GameStage/Result_'+choice2].height/2,
							   manager.getGameImages()['GameStage/Result_'+choice2].width,
							   manager.getGameImages()['GameStage/Result_'+choice2].height);

		gameScreenCtx.restore();
	}

	function drawResult(resultToDraw, deltaTime){
		//Autaliza o tempo de animação
		resultScreenTimer += animSpeed*deltaTime;
		
		gameScreenCtx.save();
		//Animação de Fade In após um tempo
		if(resultScreenTimer >= resultScreenWait) gameScreenCtx.globalAlpha = (resultScreenTimer - resultScreenWait)/defaultScreenTimer;
		else gameScreenCtx.globalAlpha = 0;
		
		//Desenha o resultado da partida
		gameScreenCtx.drawImage(manager.getGameImages()['GameStage/Text_'+resultToDraw],
							   (gameScreenCanvas.width - manager.getGameImages()['GameStage/Text_'+resultToDraw].width)/2,
							   (resultScreenBottom - resultScreenTop)/2,
							   manager.getGameImages()['GameStage/Text_'+resultToDraw].width,
							   manager.getGameImages()['GameStage/Text_'+resultToDraw].height);
							   
		gameScreenCtx.restore();
	}
	
	//Reinicia as variáveis necessárias para um novo jogo
	function resetGame(){
		bIsPlaying = false;
		roundChoice = '';
		roundOpponentChoice = '';
		choicesAnimTime = 0;
		resultScreenTimer = 0;	
		scoreAdded = false;	
	}
	
	//Define as funções e variáveis que serão de escopo público
	return {
		stageLoop: function(delta){
			//Desenha o canvas
			draw(delta);
			
			//Verifica qual modo está sendo jogado
			switch(gameMode){
				case 1: PlayVsPlayer(delta); break;
				case 2: PlayVsComputer(delta); break;
				default: alert('An error seems to have happened, please try again!'); manager.callStartStage(0); break;
			}
			
			//Checa se o player selecionou algum elemento
			if((clickPosX > 0) || (clickPosY > 0)){
				//Zera as variáveis para que não repita a chamada
				clickPosX = 0;
				clickPosY = 0;
				
				//Reinicia o jogo caso haja um clique depois dos resultados forem mostrados
				if(bIsPlaying && ((resultScreenTimer - resultScreenWait)/defaultScreenTimer >= 1))
					resetGame();
			}
		},
		
		toDraw: gameScreenCanvas,
		
		getClickPos: function(PosX, PosY){
			clickPosX = PosX;
			clickPosY = PosY;
		},
		
		getMousePos: function(PosX, PosY){
			mousePosX = PosX;
			mousePosY = PosY;
		}
	};
}
