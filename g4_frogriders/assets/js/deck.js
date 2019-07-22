class Deck {
    constructor(type) {
        this.private = [];
        this.public= [];
        this.privilage = [null, null, null, null];
        this.type = type;

    }

    shuffle() {
        for (var i = 0; i < this.stack.length - 1; i++) {
            var randIndex = Math.floor(Math.random() * (this.stack.length - i));
            var temp = this.stack[randIndex];
            this.stack[randIndex] = this.stack[i];
            this.stack[i] = temp;
        }
    }

    initializePublicCards() {
        //create public set deck
        // public: 1 red 1 blue 3 trophy
        //         1 red 1 brown 2 trophy
        //         5 any 5 trophy
        //         1 red 1 yellow 3 trohpy
        //         1 yellow 1 brown 2 trophy
        //         1 blue 1 brown 2 trophy

        var publicCardArray = [[{"required": {"red": 1, "yellow": 0, "blue": 1, "brown": 0, "any": 0}}, //1 red 1 blue 3 trophy
                            {"given": {"red": 0, "yellow": 0, "blue": 0, "brown": 0, "any": 0}}, 
                            {"points": 3}, {"type": "public"}],
                         [{"required": {"red": 1, "yellow": 0, "blue": 0, "brown": 1, "any": 0}}, //1 red 1 brown 2 trophy
                            {"given": {"red": 0, "yellow": 0, "blue": 0, "brown": 0, "any": 0}}, 
                            {"points": 2}, {"type": "public"}],
                         [{"required": {"red": 0, "yellow": 0, "blue": 0, "brown": 0, "any": 5}}, //5 any 5 trophy
                            {"given": {"red": 0, "yellow": 0, "blue": 0, "brown": 0, "any": 0}},
                            {"points": 5}, {"type": "public"}],
                        [{"required": {"red": 1, "yellow": 1, "blue": 0, "brown": 0, "any": 0}}, //1 red 1 yellow 3 trohpy
                            {"given": {"red": 0, "yellow": 0, "blue": 0, "brown": 0, "any": 0}},
                            {"points": 3}, {"type": "public"}],
                         [{"required": {"red": 0, "yellow": 1, "blue": 0, "brown": 1, "any": 0}}, //1 yellow 1 brown 2 trophy
                            {"given": {"red": 0, "yellow": 0, "blue": 0, "brown": 0, "any": 0}},
                            {"points": 2}, {"type": "public"}],
                         [{"required": {"red": 0, "yellow": 0, "blue": 1, "brown": 1, "any": 0}}, //1 blue 1 brown 2 trophy
                            {"given": {"red": 0, "yellow": 0, "blue": 0, "brown": 0, "any": 0}},
                            {"points": 2}, {"type": "public"}]]; 

        var index = Math.floor(Math.random() * publicCardArray.length);
        var returnPublicCards = [];
        returnPublicCards.push(publicCardArray[index]);
        publicCardArray.splice(index, 1);
        index = Math.floor(Math.random() * publicCardArray.length);
        returnPublicCards.push(publicCardArray[index]);
        this.public = returnPublicCards;

        var newDeck = new Deck("public");
        for(var i = 0; i < returnPublicCards.length; i++) {
            var newCard = new Card(returnPublicCards[i][0]["required"], 
                                    returnPublicCards[i][1]["given"],
                                    returnPublicCards[i][2]["points"],
                                    returnPublicCards[i][3]["type"])

            newDeck.public.push(newCard);
        }
        return newDeck;
    }

    drawPrivilageCard() {
        
        /*
            public: 1 red 1 blue 3 trophy
                    1 red 1 brown 2 trophy
                    5 any 5 trophy
                    1 red 1 yellow 3 trohpy
                    1 yellow 1 brown 2 trophy
                    1 blue 1 brown 2 trophy

            privlage: 2 red/blue/yellow-2 trophy (x6)
                      move (x3) 2, 2, 3 trophy (diagonal, l shaped, runningstart) (x6)
                      pure trophy 4 trophy (x2)
                      1 trophy per 1 brown, 2 trophy for 2 privlage cards, 1 privilage and 1 frog pair for 2 trophy (9x)
                      required: fewest trohpy cards 5 trophy (x1) fewer frog by 5, by 3 (+5, +3) (x3)

            private:  2 red, 5 (x2)
                      2 yellow, 6 (x2)
                      4 all, 5 (x5)
                      2 blue, 6 (x1)
                      1 red 1 yellow 1 blue, 4 (x1)
                      1 red 1 yellow 1 brown, 4 (x1)
                      1 blue, 1 brown, 
        */
        var privilageCardArray = [[{"required": {"red": 0, "yellow": 0, "blue": 0, "brown": 0, "any": 0}}, //+2 red
                                    {"given": {"red": 2, "yellow": 0, "blue": 0, "brown": 0, "any": 0}}, 
                                    {"points": -2}, {"type": "privilage"}],
                                [{"required": {"red": 0, "yellow": 0, "blue": 0, "brown": 0, "any": 0}}, //+2 yellow
                                    {"given": {"red": 0, "yellow": 2, "blue": 0, "brown": 0, "any": 0}}, 
                                    {"points": -2}, {"type": "privilage"}],
                                [{"required": {"red": 0, "yellow": 0, "blue": 0, "brown": 0, "any": 0}}, //+2 blue
                                    {"given": {"red": 0, "yellow": 0, "blue": 2, "brown": 0, "any": 0}},
                                    {"points": -2}, {"type": "privilage"}],
                                [{"required": {"red": 0, "yellow": 0, "blue": 0, "brown": 0, "any": 0}}, //4 trophy
                                    {"given": {"red": 0, "yellow": 0, "blue": 0, "brown": 0, "any": 0}},
                                    {"points": 4}, {"type": "privilage"}],
                                [{"required": {"red": 0, "yellow": 0, "blue": 0, "brown": 1, "any": 0}}, //+1 brown
                                    {"given": {"red": 0, "yellow": 0, "blue": 0, "brown": 0, "any": 0}},
                                    {"points": 1}, {"type": "privilage"}]];   
        var index = Math.floor(Math.random() * privilageCardArray.length);

        var newCard = new Card(privilageCardArray[index][0]["required"], 
                                privilageCardArray[index][1]["given"],
                                privilageCardArray[index][2]["points"],
                                privilageCardArray[index][3]["type"])
    
        console.log(newCard);
        return newCard;
    }

    initializePrivateCard() {
        // private:  2 red, 5 (x2)
        //               2 yellow, 6 (x2)
        //               4 all, 5 (x5)
        //               2 blue, 6 (x1)
        //               1 red 1 yellow 1 blue, 4 (x1)
        //               1 red 1 yellow 1 brown, 4 (x1)
        //               1 blue, 1 brown, 
        var privateCardArray = [[{"required": {"red": 2, "yellow": 0, "blue": 0, "brown": 0, "any": 0}}, //+2 red
                                    {"given": {"red": 0, "yellow": 0, "blue": 0, "brown": 0, "any": 0}}, 
                                    {"points": 5}, {"type":"private"}],
                                [{"required": {"red": 0, "yellow": 2, "blue": 0, "brown": 0, "any": 0}}, //+0 yellow
                                    {"given": {"red": 0, "yellow": 0, "blue": 0, "brown": 0, "any": 0}}, 
                                    {"points": 6}, {"type":"private"}],
                                [{"required": {"red": 0, "yellow": 0, "blue": 0, "brown": 0, "any": 4}}, //+0 blue
                                    {"given": {"red": 0, "yellow": 0, "blue": 0, "brown": 0, "any": 0}},
                                    {"points": 5}, {"type":"private"}],
                                [{"required": {"red": 0, "yellow": 0, "blue": 2, "brown": 0, "any": 0}}, //4 trophy
                                    {"given": {"red": 0, "yellow": 0, "blue": 0, "brown": 0, "any": 0}},
                                    {"points": 6}, {"type":"private"}],
                                [{"required": {"red": 1, "yellow": 1, "blue": 1, "brown": 0, "any": 0}}, //+1 brown
                                    {"given": {"red": 0, "yellow": 0, "blue": 0, "brown": 0, "any": 0}},
                                    {"points": 4}, {"type":"private"}],
                                [{"required": {"red": 1, "yellow": 1, "blue": 0, "brown": 1, "any": 0}}, //4 trophy
                                    {"given": {"red": 0, "yellow": 0, "blue": 0, "brown": 0, "any": 0}},
                                    {"points": 4}, {"type":"private"}]];   

        var index = Math.floor(Math.random(privateCardArray.length));
        var returnPrivateCards = [];
        returnPrivateCards.push(privateCardArray[index]);
        privateCardArray.splice(index, 1);
        index = Math.floor(Math.random(privateCardArray.length));
        returnPrivateCards.push(privateCardArray[index]);
    }
}