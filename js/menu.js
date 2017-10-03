//Objeto que cuidará da lógica do menu do jogo
var menuScreen = function(manager){
	//Definir o canvas que será usado ou criar um caso este não exista
	var menuCanvas = menuCanvas || manager.createCanvas(manager.getGameWidth(), manager.getGameHeight());
	var menuCtx = menuCanvas.getContext('2d');
	
	var clickPosX;
	var clickPosY;
	
	var mousePosX;
	var mousePosY;
	
	var bElementsCreated = false;
	var menuElements = [];
	
	//Padding entre os elementos da tela
	var buttonPadding = 10;
	var edgePadding = 5;	
	
	function createElements() {
		//Variável auxiliar para desenhar os sprites na altura correta
		var auxHeight = edgePadding;
		
		//Cria o título do menu na tela
		menuElements.push({
			elemName: "Text_Choose",
			src: manager.getGameImages()['MainMenu/Text_Choose'],
			hover: manager.getGameImages()['MainMenu/Text_Choose'],
			left: (menuCanvas.width - manager.getGameImages()['MainMenu/Text_Choose'].width)/2,
			top: edgePadding,
			width: manager.getGameImages()['MainMenu/Text_Choose'].width,
			height: manager.getGameImages()['MainMenu/Text_Choose'].height
		});	
		auxHeight += manager.getGameImages()['MainMenu/Text_Choose'].height + buttonPadding;
		
		//Cria o botão Vs. Player na tela
		menuElements.push({
			elemName: "Vs_Player",
			src: manager.getGameImages()['MainMenu/Button_VsPlayer'],
			hover: manager.getGameImages()['MainMenu/Button_VsPlayer_Hover'],
			left: (menuCanvas.width - manager.getGameImages()['MainMenu/Button_VsPlayer'].width)/2,
			top: auxHeight,
			width: manager.getGameImages()['MainMenu/Button_VsPlayer'].width,
			height: manager.getGameImages()['MainMenu/Button_VsPlayer'].height
		});
		auxHeight += manager.getGameImages()['MainMenu/Button_VsPlayer'].height + buttonPadding;
		
		//Cria o botão Vs. Computador na tela
		menuElements.push({
			elemName: "Vs_Computer",
			src: manager.getGameImages()['MainMenu/Button_VsComp'],
			hover: manager.getGameImages()['MainMenu/Button_VsComp_Hover'],
			left: (menuCanvas.width - manager.getGameImages()['MainMenu/Button_VsComp'].width)/2,
			top: auxHeight,
			width: manager.getGameImages()['MainMenu/Button_VsComp'].width,
			height: manager.getGameImages()['MainMenu/Button_VsComp'].height
		});
		auxHeight += manager.getGameImages()['MainMenu/Button_VsComp'].height;
						 
		//Cria o botão Quit na tela
		menuElements.push({
			elemName: "Quit",
			src: manager.getGameImages()['MainMenu/Button_Quit'],
			hover: manager.getGameImages()['MainMenu/Button_Quit_Hover'],
			left: (menuCanvas.width - manager.getGameImages()['MainMenu/Button_Quit'].width)/2,
			top: menuCanvas.height - manager.getGameImages()['MainMenu/Button_Quit'].height - edgePadding,
			width: manager.getGameImages()['MainMenu/Button_Quit'].width,
			height: manager.getGameImages()['MainMenu/Button_Quit'].height
		});
		
		bElementsCreated = true;
	};
	
	draw = function(delta){
		//Cria os elementos a ser desenhados caso eles não existam
		if(!bElementsCreated) createElements();
		
		//Limpa o canvas para o próximo frame
		menuCtx.clearRect(0,0,menuCanvas.width, menuCanvas.height);		
				
		menuElements.forEach(function(menuElement) {		
			//Desenha os elementos criados anteriormente na tela em seu estado hover ou descanso	
			if (mousePosY > menuElement.top && mousePosY < menuElement.top + menuElement.height 
				&& mousePosX > menuElement.left && mousePosX < menuElement.left + menuElement.width)			
				menuCtx.drawImage(menuElement.hover,menuElement.left,menuElement.top,menuElement.width,menuElement.height);
			else
				menuCtx.drawImage(menuElement.src,menuElement.left,menuElement.top,menuElement.width,menuElement.height);
			
			//Verifica se o player selecionou algum botão
			if (clickPosY > menuElement.top && clickPosY < menuElement.top + menuElement.height 
				&& clickPosX > menuElement.left && clickPosX < menuElement.left + menuElement.width) {
				switch (menuElement.elemName){
					//Inicia o próximo stage com modo 1
					case "Vs_Player": manager.setGameMode(1); manager.callStartStage(2); break;
					//Inicia o próximo stage com modo 2
					case "Vs_Computer": manager.setGameMode(2); manager.callStartStage(2); break;
					//Volta à Splash Screen
					case "Quit": manager.callStartStage(0); break;
					//Desconsidera o clique caso não seja nenhum dos elementos
					default: clickPosX = 0; clickPosY = 0;
					
					//Reseta o clique ao final
					clickPosX = 0; 
					clickPosY = 0;
				}
			}
		});		
	}
	
	//Define as funções e variáveis que serão de escopo público
	return {
		stageLoop: function(delta){
			//Desenha o canvas
			draw(delta);
			
			//Checa se o player selecionou algum elemento
			if((clickPosX > 0) || (clickPosY > 0)){
				//Zera as variáveis para que não repita a chamada
				clickPosX = 0;
				clickPosY = 0;
			}
		},
		
		toDraw: menuCanvas,
		
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
