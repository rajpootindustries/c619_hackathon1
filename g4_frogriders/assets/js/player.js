class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
        this.frogBag = {'red': 0, 'yellow': 0, 'blue': 0, 'brown': 0}; // stores number of frogs belonging to player {'red': 4, 'blue': 3}

        this.bag = {"red": [], "blue": [], "yellow": [], "brown": []};
        this.privateDeck = new Deck("private");
        this.publicDeck = new Deck('public')
    }
    setScore(score){
        this.score += score;
    }
    getScore(){
        return this.score;
    }
    calculateScore(){ // simplified rules
        // ☺return Object.values(this.frogBag).reduce((accumulator, currentValue) => accumulator + currentValue);
        return parseInt(this.frogBag.red) + parseInt(this.frogBag.brown) + parseInt(this.frogBag.yellow) + parseInt(this.frogBag.blue);
    }
    setFrogBag(color){
        if(color === 'red'){
            this.frogBag.red += 1;
        }
        else if(color === 'brown'){
            this.frogBag.brown += 2;
        }
        else if(color === 'yellow'){
            this.frogBag.yellow += 3 ;
        }
        else if (color === 'blue'){
            this.frogBag.blue += 4;
        }
        else{
            console.log("error: incorrect color specified");
        }
    }
    getFrogBag(){
        return this.frogBag;
    }

    keep(frog) {
        var frogColor = frog.getColor();
        this.bag[frogColor].push(frog);
    }

}
