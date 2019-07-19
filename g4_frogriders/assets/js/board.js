class Board {
    constructor(players) {
        this.board = [];
        this.rows = 9;
        this.columns = 9;
        this.removedFrogs = {"red": null, "blue": null, "yellow": null, "brown": null};
        this.playerArray = [];
        this.currentPlayer = 0;
        this.possibleActions = [];
        this.firstSelectedFrog = null;
        this.modal = new Modal('#modalShadow', "#modalBody", "#modalMessage", "#modalButton");
        
        this.initializeApp = initializeApp;
        this.addPlayers(players);
        this.initializeBoard();
    }

    initializeBoard() {
        //clear old board
        $('.gameBoard').empty()
        this.modal.init();

        //populates board by creating a 2d array representind the board on the DOM
        for(var col = 0; col < this.columns; col++) {
            this.board.push(new Array(this.rows))
        }

        // var tileContainer = $('<div>').addClass('tileContainer')
        var colors = ['red', 'blue', 'yellow', 'brown'];
        for(var row = 0; row < this.rows; row++) {
            for(var col = 0; col < this.columns; col++) {
                var indexes = { 'data-row': row, 'data-col': col };
                var tile = $('<div>').addClass('tile').attr(indexes);
                var leaf = $('<div>').addClass('leaf');
                if(row === 4 && col === 4){
                    leaf.addClass('center');
                    tile.append(leaf);
                    this.board[row][col] = null;
                } else{
                    var colorIndex = Math.floor(Math.random() * 4);
                    var frog = $('<div>').addClass('frog').addClass(colors[colorIndex]);

                    tile.append(leaf);
                    tile.append(frog);

                    var newFrog = new Frog(colors[colorIndex], tile)
                    newFrog.setPosition(row, col);
                    this.board[row][col] = newFrog;

                }
                $('.gameBoard').append(tile);

            }
        }
        this.handleCellClick = this.handleCellClick.bind(this);
        $('.tile').on('click', '.leaf', this.handleCellClick);
        $('.tile').on('click', '.frog', this.handleCellClick);
        //initialize players
        // this.currentPlayer = 0;
    }


    addPlayers(players) {
        for(var i = 0; i < players.length; i++) {
            this.playerArray.push(new Player(players[i]));
        }
    }

    alternatePlayer() {
        if(this.currentPlayer < this.playerArray.length-1) {
            this.currentPlayer++;
        }
        else {
            this.currentPlayer = 0;
        }

    }

    handleCellClick() {
        var tile = event.currentTarget
        var col = parseInt($(tile).attr('data-col'));
        var row = parseInt($(tile).attr('data-row'));

        if(this.possibleActions.length === 0) {
            var clickedFrog = this.board[row][col];
            this.firstSelectedFrog = clickedFrog;
            if (this.board[row][col]) {
                //check valid moves
                this.findValidMoves(clickedFrog);
                //color valid tiles
                this.colorTiles();
            }
        }
        else {
            //click on one of the possible actions
            for (var i = 0; i < this.possibleActions.length; i++) {
                var action_row = this.possibleActions[i]['target'][0];
                var action_col = this.possibleActions[i]['target'][1];

                if(action_row === row && action_col === col) {
                    console.log('clicked right one');

                    var target_row = this.possibleActions[i]['middle'][0];
                    var target_col = this.possibleActions[i]['middle'][1];

                    //give the points of the frog
                    var removedFrog = this.popFrog(this.board[target_row][target_col]);
                    this.possibleActions = [];
                    this.playerArray[this.currentPlayer].setFrogBag( removedFrog.getColor() );
                    console.log(removedFrog.getColor());

                    //move frog
                    var frogThatJumped = this.popFrog(this.firstSelectedFrog);
                    this.setFrog(frogThatJumped, action_row, action_col)

                    if(this.board[action_row][action_col] && this.findValidMoves(this.board[action_row][action_col]) ) {
                        this.clearTiles();
                        this.colorTiles();
                        $('#player' + (this.currentPlayer+1)).text(this.playerArray[this.currentPlayer].calculateScore());
                    }
                    else {
                        this.clearTiles();

                        $('#player'+(this.currentPlayer+1)).text(this.playerArray[this.currentPlayer].calculateScore());
                        this.alternatePlayer();

                    }
                }
                else {
                    // clicked invalid tile
                }
            }
        }

        if(this.winCondition()){
            this.modal.updateMessage('Player One Wins');
            this.modal.show();
        }
    }

    findValidMoves(frog) {
        this.possibleActions = [];
        var currentPosition = frog.getPosition(); 

        var up = this.checkInDirection(currentPosition.row, currentPosition.col, "up"); 
        var down = this.checkInDirection(currentPosition.row, currentPosition.col, "down"); 
        var left = this.checkInDirection(currentPosition.row, currentPosition.col, "left"); 
        var right = this.checkInDirection(currentPosition.row, currentPosition.col, "right");

        var directions = [Object.assign({}, up), 
                          Object.assign({}, down), 
                          Object.assign({}, left), 
                          Object.assign({}, right)];

        var nextDirection = [Object.assign({}, up), 
                             Object.assign({}, down), 
                             Object.assign({}, left), 
                             Object.assign({}, right)];

        var stringDir = ["up", "down", "left", "right"];
        for(var i = 0; i < directions.length; i++) {
            if(this.isInbound(directions[i].row, directions[i].col) && this.isFrog(this.board[directions[i].row][directions[i].col])) {
                nextDirection[i] = this.checkInDirection(directions[i].row, directions[i].col, stringDir[i]);
                if(this.isInbound(nextDirection[i].row, nextDirection[i].col) && this.board[nextDirection[i].row][nextDirection[i].col] === null) {
                    this.possibleActions.push({"target": [nextDirection[i].row, nextDirection[i].col], "middle": [directions[i].row, directions[i].col]});
                }
            }
        }

        if(this.possibleActions.length === 0) {
            return false;
        }
        else {
            return true;
        }

    }
    checkInDirection(row, col, direction) {
        //used by find valid moves for the current player
        const up = {row: 0, col: -1};
        const down = {row: 0, col: 1};
        const left = {row: -1, col: 0};
        const right = {row: 1, col:0};

        if(direction === 'up') {
            return {row: row + up.row, col: col + up.col};
        }
        else if(direction === 'down') {
            return {row: row + down.row, col: col + down.col};
        }
        else if(direction === 'left') {
            return {row: row + left.row, col: col + left.col};
        }
        else if(direction === 'right'){
            return {row: row + right.row, col: col + right.col};
        }
    }


    isInbound(row, col) {
        return (row < this.rows && row >= 0  && col >= 0 && col < this.columns)
    }


    isFrog(frog) {
        if(frog && frog.constructor === Frog){
            return true;
        }
        else {
            return false;
        }
    }

    popFrog(frog) {
        var index = frog.getPosition();
        var frogRemoved = this.board[index.row][index.col];
        this.board[index.row][index.col] = null;
        var x = $('[data-row=' + index.row + '][data-col=' + index.col + '] div.frog')
        x.remove();
        return frogRemoved;
    }

    setFrog(frog, row, col) {
        var element = frog.getFrog();
        var selector = $('div.tile[data-row=' + row + '][data-col=' + col + ']');
        frog.setPosition(row, col);
        this.board[row][col] = frog;
        selector.append(element);
    }

    colorTiles() {
        for(var i = 0; i < this.possibleActions.length; i++) {
            var coordinates = this.possibleActions[i]['target'];
            var selector = $('div.tile[data-row=' + coordinates[0] + '][data-col=' + coordinates[1] + '] div.leaf');
            // console.log(selector);
            selector.addClass('choice');
        }
    }

    clearTiles() {
        $('div.leaf').removeClass('choice');
    }


    isValidEndMove(frog){

            var currentPosition = frog.getPosition(); 

            var up = this.checkInDirection(currentPosition.row, currentPosition.col, "up"); // {row: 1, col:2}
            var down = this.checkInDirection(currentPosition.   row, currentPosition.col, "down"); // {row:1, col:0}
            var left = this.checkInDirection(currentPosition.row, currentPosition.col, "left"); // {row:-1, col:0}
            var right = this.checkInDirection(currentPosition.row, currentPosition.col, "right");

            var directions = [Object.assign({}, up), 
                              Object.assign({}, down), 
                              Object.assign({}, left), 
                              Object.assign({}, right)];

            var nextDirection = [Object.assign({}, up), 
                                 Object.assign({}, down), 
                                 Object.assign({}, left), 
                                 Object.assign({}, right)];
  
            var stringDir = ["up", "down", "left", "right"];
            for (var i = 0; i < directions.length; i++) {
                if (this.isInbound(directions[i].row, directions[i].col) && this.isFrog(this.board[directions[i].row][directions[i].col])) {
                    nextDirection[i] = this.checkInDirection(directions[i].row, directions[i].col, stringDir[i]);
                    if (this.isInbound(nextDirection[i].row, nextDirection[i].col) && this.board[nextDirection[i].row][nextDirection[i].col] === null) {
                        return true;
                    }
                }
            }
            return false;
    }

    winCondition(){
        var allFalse = true;
        var maxScoreReached = false;
        if (this.playerArray[0].calculateScore() > 40 || this.playerArray[1].calculateScore() > 40){
            maxScoreReached = true;
        }
        for (var row = 0; row < this.rows; row++){
            for(var col = 0; col < this.columns; col++){
                var frog = this.board[row][col];
               if (this.isFrog(frog)){
               if( this.isValidEndMove(frog)){
                   allFalse = false;
               }
               }
            }
        }
        if (maxScoreReached || allFalse){
            return true;
        }else {
            return false;
        }

    }

}