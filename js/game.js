//Objeto que cuidará da lógica principal do jogo
var gameScreen = function(manager){
	//Definir o canvas que será usado ou criar um caso este não exista
	var gameScreenCanvas = gameScreenCanvas || manager.createCanvas(manager.getGameWidth(), manager.getGameHeight());
	var gameScreenCtx = gameScreenCanvas.getContext('2d');
	
	//Define as funções e variáveis que serão de escopo público
	return {
		stageLoop: function(delta){
			
		},
		
		toDraw: menuCanvas,
		
		getClickPos: function(PosX, PosY){
			clickPosX = PosX;
			clickPosY = PosY;
		}
	};
}
