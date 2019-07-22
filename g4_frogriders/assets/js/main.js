$(document).ready( initializeApp );

function initializeApp() {
 
    initializeGame();

    var gameBoard = new Board();
    gameBoard.addPlayer('Warren');
    gameBoard.addPlayer('Elon');
    gameBoard.addPlayer('John')
    gameBoard.intializeBoard();

}

function initializeGame() {
    $('.endgame').hide();
    $('.village').hide();
    $('.rechoose').hide();
    $('#modalButton').click(resetGame);
}

function resetGame() {
    $('*').off();
    initializeApp();
}