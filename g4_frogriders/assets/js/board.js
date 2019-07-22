class Board {
    constructor() {
        this.board = [];
        this.rows = 9;
        this.columns = 9;
        this.playerArray = [];
        this.currentPlayer = 0;
        this.possibleActions = [];
        this.firstSelectedFrog = null;
        this.frogsThisTurn = [];
        this.village = new Village();
        this.publicDeck = new Deck("public");
        this.privilageDeck = new Deck("privilage");

    }

    intializeBoard() {
        //clear old board
        $('.gameBoard').empty()

        //populates board by creating a 2d array representind the board on the DOM
        for(var col = 0; col < this.columns; col++) {
            this.board.push(new Array(this.row))
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

        //create win/lose (reset) modal
        var endModal = $('<div>').addClass('endModal');

        
        this.handleCellClick = this.handleCellClick.bind(this);
        $('.tile').on('click', '.leaf', this.handleCellClick);
        $('.tile').on('click', '.frog', this.handleCellClick);

        //hide player cards modal
        $('.fan-cards').hide();
        $('.player').on('mouseover', this.displayPlayerCards);
        $('.fan-cards').on('click', this.hidePlayerCards);

        for(var i = 0; i < this.playerArray.length; i++) {
            this.playerArray[i].score = 0;
            this.playerArray[i].frogBag = {'red': 0, 'yellow': 0, 'blue': 0, 'brown': 0}; 
            this.updateScore(i);
        }
        //initialize players
        $('div[id^="player"]').removeClass('currentPlayer');
        $('#player' + (this.currentPlayer+1)).addClass('currentPlayer')
        // this.currentPlayer = 0;

        //fill board with cards
        this.addCardstoBoard();
    }

    addCardstoBoard() {
        var publicDeck = this.publicDeck.initializePublicCards();
        // console.log(publicDeck.type, publicDeck, 'sup')
        // console.log('testing', publicDeck, publicDeck[publicDeck.type]);
        for (var card = 0; card <  publicDeck[publicDeck.type].length; card++) {
            var cardDOM = publicDeck[publicDeck.type][card].createCardElement(publicDeck.type);
            var selector = $('.card-slot.public[data-slot-num="'+ (card + 1) + '"]');
            selector.empty();
            selector.append(cardDOM);
        }
        $('.card-slot.privilage').addClass('empty')
        //privilege cards
        this.fillPrivilageCardSlots();
    }


    fillPrivilageCardSlots() {
        while($('.card-slot.privilage.empty').length) {
            var selector = $('.card-slot.privilage.empty:first');
            
            var privilageCard = this.privilageDeck.drawPrivilageCard();
            this.privilageDeck[this.privilageDeck.type][selector.data()['slotNum'] - 1] = privilageCard;
            selector.empty();
            selector.append(privilageCard.createCardElement("privilage"));
            selector.removeClass('empty');
        }
    }

    displayPlayerCards() {
        var playerNum = $(event.currentTarget).children().attr('id');
        $('.fan-cards').show();
        $('div[class^="fan-player"]').addClass('hidden');
        $('div[class^="fan-player' + playerNum[6] +'"]').removeClass('hidden')
        
    }

    hidePlayerCards() {
        $('.fan-cards').hide();
    }

    
    addPlayer(player) {
        this.playerArray.push(new Player(player));
        //adds player to the beginning of game
        //change the names of the players
        //returns nothing

    }

    alternatePlayer() {
        //gets the next player and sets it as current player
        //returns nothing
        if(this.currentPlayer < this.playerArray.length-1) {
            this.currentPlayer++;
        }
        else {
            this.currentPlayer = 0;
        }
        $('div[id^="player"]').removeClass('currentPlayer');
        $('#player' + (this.currentPlayer+1)).addClass('currentPlayer')

    }

    handleCellClick() {
        var tile = event.currentTarget
        var col = parseInt($(tile).attr('data-col'));
        var row = parseInt($(tile).attr('data-row'));
        
        console.log(col, row, event.currentTarget)
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
            //if tile is one of the possible actions remove frog in between
            for (var i = 0; i < this.possibleActions.length; i++) {
                var action_row = this.possibleActions[i]['target'][0];
                var action_col = this.possibleActions[i]['target'][1];
                // console.log(action_row, row, action_col, col);
                if(action_row === row && action_col === col) {

                    var target_row = this.possibleActions[i]['middle'][0];
                    var target_col = this.possibleActions[i]['middle'][1];
                    //give frog to player, or the points of the frog
                    var removedFrog = this.popFrog(this.board[target_row][target_col]);
                    removedFrog.tag();

                    //clear 
                    this.possibleActions = [];
                    this.frogsThisTurn.push(removedFrog);
                    this.playerArray[this.currentPlayer].setFrogBag( removedFrog.getColor() );

                    //move frog
                    var frogThatJumped = this.popFrog(this.firstSelectedFrog);
                    var splash = new Audio();
                    splash.src = 'assets/sounds/splash.wav';
                    splash.play();

                    this.setFrog(frogThatJumped, action_row, action_col)

                    this.updateScore(this.currentPlayer);

                    if(this.board[action_row][action_col] && this.findValidMoves(this.board[action_row][action_col]) ) {
                        this.clearTiles();
                        this.colorTiles();
                    }
                    else {
                        this.clearTiles();
                        //clear coloring

                        //phase 2
                        var reroll = this.phasetwo(this.frogsThisTurn);
                        //change player
                        

                    }
                }
                else {
                    //clicked wrong tile
                    console.log('wrong tile clicked');
                    var croak = new Audio();
                    croak.src = 'assets/sounds/croak.mp3';
                    croak.play();
                }
            }
        }

        if(this.winCondition()){
            //endgame, modal
            $('.endgame').show();

        }
    }

    phasetwo(froglist) {
        var selector = $(".frog-options");
        selector.empty();
        var availableFrogColors = this.colorsInFroglist(froglist);
        var noVillageFrogs = true;

        if (availableFrogColors.red) {
            selector.append($('<button>').addClass("pick pick-red"));
            noVillageFrogs = false;
        }
        if (availableFrogColors.yellow) {
            selector.append($('<button>').addClass("pick pick-yellow"));
            noVillageFrogs = false;
        }
        if (availableFrogColors.blue) {
            selector.append($('<button>').addClass("pick pick-blue"));
            noVillageFrogs = false;
        }

        if(noVillageFrogs) {
            this.keepFrogs();
        }
        else {
            $('.village').show();
            this.placeRedFrogInVillage = this.placeRedFrogInVillage.bind(this);
            this.placeBlueFrogInVillage = this.placeBlueFrogInVillage.bind(this);
            this.placeYellowFrogInVillage = this.placeYellowFrogInVillage.bind(this);
            this.keepFrogs = this.keepFrogs.bind(this);
            $('.pick-red').on("click", this.placeRedFrogInVillage);
            $('.pick-blue').on("click", this.placeBlueFrogInVillage);
            $('.pick-yellow').on("click", this.placeYellowFrogInVillage);
            $('.village-exit').on("click", this.keepFrogs);
        }

        
    }
    updateScore(currentPlayer){
        $('#player' + (currentPlayer+1)).text(this.playerArray[currentPlayer].calculateScore());
    }

    getFrogByColorThisTurn(color) {
        for(var i = 0; i < this.frogsThisTurn.length; i++) {
            if(this.frogsThisTurn[i].color === color) {
                var frog = this.frogsThisTurn[i];
                this.frogsThisTurn.splice(i, 1);
                return frog;
            }
        }
        return null
    }

    bagFrogs() {
        while(this.frogsThisTurn.length > 0) {
            this.playerArray[this.currentPlayer].keep(this.frogsThisTurn.shift());
        }
    }

    placeRedFrogInVillage() {
        $('.village').hide();
        $('.pick').off("click", this.placeRedFrogInVillage);
        //place frog in village
        this.village.addFrog(this.getFrogByColorThisTurn("red"));

        //place rest of frogs in bag
        this.bagFrogs();
    }

    placeBlueFrogInVillage() {
        $('.village').hide();
        $('.tile').off('click', '.leaf', this.handleCellClick);
        $('.tile').off('click', '.frog', this.handleCellClick);
        $('.pick').off("click", this.placeBlueFrogInVillage);

        //pick a card
        this.village.addFrog(this.getFrogByColorThisTurn("blue"));

        //place rest of frogs in bag
        this.bagFrogs();

        //TODO: get cards 
        this.userSelectPrivilageCard = this.userSelectPrivilageCard.bind(this);
        $('.card-slot.privilage').on('click', '.card', this.userSelectPrivilageCard);
        $('.card-slot.privilage').addClass('active');
        
    }

    userSelectPrivilageCard() {
        console.log(this.playerArray[this.currentPlayer], this.privilageDeck, event.currentTarget, 'lu')
        $(event.currentTarget).empty();
        $(event.currentTarget).addClass('empty');


        $('.card-slot.privilage').removeClass('active');
        $('.card-slot.privilage').off('click', '.card', this.userSelectPrivilageCard);
        $('.tile').on('click', '.leaf', this.handleCellClick);
        $('.tile').on('click', '.frog', this.handleCellClick);

        this.fillPrivilageCardSlots = this.fillPrivilageCardSlots.bind(this);
        setTimeout(this.fillPrivilageCardSlots, 1000);
        this.alternatePlayer();
    }
    placeYellowFrogInVillage() {
        $('.village').hide();
        $('.pick').off("click", this.placeYellowFrogInVillage);

        //trade frogs
        this.village.addFrog(this.getFrogByColorThisTurn("yellow"));
        this.rechooseModal();

        this.alternatePlayer();
    }

    keepFrogs() {
        $('.village').hide();
        $('.village-exit').off("click", this.keepFrogs);


        //place rest of frogs in bag
        this.bagFrogs();

        //place frogs in player
        this.alternatePlayer();

    }

    rechooseModal() { //put yellow frog in village
        $('.rechoose').show();
        var selector = $(".frog-choose");
        selector.empty();
        var availableVillageFrogs= this.village.frogs;
        if(availableVillageFrogs.red.length > 0) {
            selector.append($('<button>').addClass("choose choose-red"));
        }
        if(availableVillageFrogs.yellow.length > 0) {
            selector.append($('<button>').addClass("choose choose-yellow"));
        }
        if(availableVillageFrogs.blue.length > 0) {
            selector.append($('<button>').addClass("choose choose-blue"));
        }

        this.rechooseFrog = this.rechooseFrog.bind(this);
        $('.choose').on('click', this.rechooseFrog);
        
        //place rest of frogs in bag
        this.bagFrogs();

    }

    rechooseFrog() {
        $('.choose').off('click', this.rechooseFrog);
        $('.rechoose').hide();
        var element = $(event.currentTarget);

        var color = null;
        if(element.hasClass("choose-red")) {
            color = "red";
        }
        else if (element.hasClass("choose-yellow")) {
            color = "yellow";
        }
        else if (element.hasClass("choose-blue")) {
            color = "blue";
        }
        this.frogsThisTurn.push(this.village.getFrog(color));
        this.bagFrogs()
 
    }

    colorsInFroglist(froglist) {
        var red = false;
        var blue = false;
        var yellow = false;

        for(var i = 0; i < froglist.length; i++) {
            if(froglist[i].color === 'red') {
                red = true;
            }
            else if (froglist[i].color === 'blue') {
                blue = true;
            }
            else if(froglist[i].color === 'yellow') {
                yellow = true;
            }
        }
        return {'red': red, 'blue': blue, 'yellow': yellow};
    }
    findValidMoves(frog) {
        this.possibleActions = [];
        var currentPosition = frog.getPosition(); // {x: this.x, y: this.y}; {x: 1, y: 1}

        var up = this.checkInDirection(currentPosition.row, currentPosition.col, "up"); // {row: 1, col:2}
        var down = this.checkInDirection(currentPosition.row, currentPosition.col, "down"); // {row:1, col:0}
        var left = this.checkInDirection(currentPosition.row, currentPosition.col, "left"); // {row:-1, col:0}
        var right = this.checkInDirection(currentPosition.row, currentPosition.col, "right");

        var directions = [this.clone(up), this.clone(down), this.clone(left), this.clone(right)];
        var nextDirection = [this.clone(up), this.clone(down), this.clone(left), this.clone(right)];
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

        // if relative direction.x < 0 || relativeDirection.x > 9 || relativeDirection.y < 0 || relativeDirection.y > 9 { relativeDirection = false;}
        // if relativeDirection is undefined (empty tile) => false
        // if relativeDirection of frog at relativePosition is another frog => false
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
            selector.addClass('choice');
        }
    }

    clearTiles() {
        $('div.leaf').removeClass('choice');
    }

    clone(src) {
        return Object.assign({}, src);
    }

    isValidEndMove(frog){

            var currentPosition = frog.getPosition(); // {x: this.x, y: this.y}; {x: 1, y: 1}

            var up = this.checkInDirection(currentPosition.row, currentPosition.col, "up"); // {row: 1, col:2}
            var down = this.checkInDirection(currentPosition.row, currentPosition.col, "down"); // {row:1, col:0}
            var left = this.checkInDirection(currentPosition.row, currentPosition.col, "left"); // {row:-1, col:0}
            var right = this.checkInDirection(currentPosition.row, currentPosition.col, "right");

            var directions = [this.clone(up), this.clone(down), this.clone(left), this.clone(right)];
            var nextDirection = [this.clone(up), this.clone(down), this.clone(left), this.clone(right)];
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

    winCondition(type){
        var allFalse = true;
        var maxScoreReached = false;
        if (this.playerArray[0].calculateScore() > 10 || this.playerArray[1].calculateScore() > 10){
            maxScoreReached = false;
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
        // if(allFalse){
            return true;
        }else {
            return false;
        }

    }
}
