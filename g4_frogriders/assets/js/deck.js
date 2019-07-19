class Deck {
    constructor() {
        this.stack = [];
        this.privateSetDeck = [];
        this.publicDeck= [];
        this.privilageDeck = [];

        this.createStartingDecks();
    }

    shuffle() {
        for (var i = 0; i < this.stack.length - 1; i++) {
            var randIndex = Math.floor(Math.random() * (this.stack.length - i));
            var temp = this.stack[randIndex];
            this.stack[randIndex] = this.stack[i];
            this.stack[i] = temp;
        }
    }

    createStartingDecks() {
        //create private set deck
        this.createPrivateSetDeck();
    }

    createPrivateSetDeck() {
        //create card;
        var card = this.addCard("private")
        this.privateSetDeck.push()
    }

    customCardMaker(frogs, points) {

    }
    
    addCard(type) {
        var newCard = new Card();

        if(type === "private") {
            newCard.createPrivateSetCard();
        }
        else if (type === "privilage") {
            newCard.createPrivilageCard();
        }
        else if (type === "public") {
            newCard.createPublicCard();
        }
        return newCard;
    }
}