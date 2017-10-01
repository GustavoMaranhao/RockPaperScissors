//Objeto que cuidará da lógica da tela de splash do jogo
var splashScreen = function(manager){
	//Definir o canvas que será usado ou criar um caso este não exista
	var splashCanvas = splashCanvas || manager.createCanvas(manager.getGameWidth(), manager.getGameHeight());
	var splashCtx = splashCanvas.getContext('2d');
	
	var clickPosX;
	var clickPosY;
	
	var beginTextAlpha = 1.0;
	var signal = 1;
	var fadeSpeed = 0.95;	
	
	draw = function(delta){
		//Limpa o canvas para o próximo frame
		splashCtx.clearRect(0,0,splashCanvas.width, splashCanvas.height);
		
		//Desenha o título do jogo na tela
		splashCtx.drawImage(manager.getGameImages()['SplashMenu/Text_Title'],
							(splashCanvas.width - manager.getGameImages()['SplashMenu/Text_Title'].width)/2,
							5,
							manager.getGameImages()['SplashMenu/Text_Title'].width,
							manager.getGameImages()['SplashMenu/Text_Title'].height);
		
		//Checa em qual estado o subtexto deve ser desenhado
		beginTextAlpha += signal*fadeSpeed*delta;
		if(beginTextAlpha >= 1.0){
			signal = -1;
			beginTextAlpha = 1;
		}
		else if(beginTextAlpha <= 0){
			signal = 1;
			beginTextAlpha = 0;
		}
		
		//Desenha o subtexto com transparência
		splashCtx.save();			
		splashCtx.globalAlpha = beginTextAlpha;
		splashCtx.drawImage(manager.getGameImages()['SplashMenu/Text_Begin'],
							(splashCanvas.width - manager.getGameImages()['SplashMenu/Text_Begin'].width)/2,
							splashCanvas.height - manager.getGameImages()['SplashMenu/Text_Begin'].height - 20,
							manager.getGameImages()['SplashMenu/Text_Begin'].width,
							manager.getGameImages()['SplashMenu/Text_Begin'].height);
		splashCtx.restore();
	}
	
	//Define as funções e variáveis que serão de escopo público
	return {
		stageLoop: function(delta){
			//Desenha o canvas
			draw(delta);
			
			//Checa se o player quer iniciar o jogo
			if((clickPosX > 0) || (clickPosY > 0)){
				//Zera as variáveis para que não repita a chamada
				clickPosX = 0;
				clickPosY = 0;
				
				//Prepara o próximo stage
				manager.callStartStage(1);
			}
		},
		
		toDraw: splashCanvas,
		
		getClickPos: function(PosX, PosY){
			clickPosX = PosX;
			clickPosY = PosY;
		}
	};
}
