 # RockPaperScissors
  Simple Rock, Paper, Scissors game created using only JavaScript and HTML. The art assets were created from scratch and the game's logic is all containned in 4 JavaScript files while the HTML index is only used to define the game area. The game follows the flow of screens presented bellow:  
  
![alt text](https://github.com/GustavoMaranhao/RockPaperScissors/blob/master/images/SplashMenu/_ConceptArt.png)                  ![alt text](https://github.com/GustavoMaranhao/RockPaperScissors/blob/master/images/MainMenu/_ConceptArt.png)                   ![alt text](https://github.com/GustavoMaranhao/RockPaperScissors/blob/master/images/GameStage/_ConceptArt.png)    
  
  As soon as the browser window loads, the player is presented with the splash screen shown in the leftmost image above.
  
  After clicking anywhere inside the screen's canvas a transition should happen into the next menu shown in the center image above, from which the player can choose if he wants to play matches against a computer player or if he simply wants to watch two computer players play against each other. The third option taking the player back to the previous splash screen.  
  
  Having chosen which option he wants, the player is then taken to the game stage as represented in the rightmost image. The game emulates a rock, paper, scissors match, where rock beats scissors, paper beats rock and scissors beats paper. Everytime a match is played a number is increased in the upper pannel of the game as well as each match that is won. For the matches of computer versus computer the number of victories is kept blank. In the upper pannel there is also a button that will take the game back to the previous Menu screen.  
  
  If the player is just watching both computer players, then he won't be able to choose any of the game options which will be greyed out, except for the Exit button, and the game will continue to play itself until the player decides to leave.  
  
  If instead the match consists of the human player versus a computer player, then all the game options will be enabled, allowing the human player to select what he would like to play while the computer player waits. Hovering over a game element will then have a highlight to indicate what is chosen and also a tooltip with what the element can beat in the game. The results are then evaluated and a veridict of who won is given, increasing the game rankings as stated previously.
  
  This project has been tested fully using FireFox Mozilla version 55.0.3 (32 bits), Google Chrome version 61.0.3163.100 (64 bits) and Internet Explorer 11 version 11.608.15063.0 in both desktop versions and mobile ones.  
  
  Video demonstration:   
  Link to the playable version:https://rockpaperscissorsartifact.bitballoon.com
