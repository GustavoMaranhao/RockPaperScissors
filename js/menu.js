//Objeto que cuidará da lógica do menu do jogo
var menuScreen = function(manager){
	//Definir o canvas que será usado ou criar um caso este não exista
	var menuCanvas = menuCanvas || manager.createCanvas(manager.getGameWidth(), manager.getGameHeight());
	var menuCtx = menuCanvas.getContext('2d');
	
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
