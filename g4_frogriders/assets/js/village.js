class Village {
    constructor() {
        this.frogs = {'red': [], 'yellow': [], 'blue': []};
    }
    update() {
        $('#villageRed').text(this.frogs['red'].length);
        $('#villageYellow').text(this.frogs['yellow'].length);
        $('#villageBlue').text(this.frogs['blue'].length);
    }
    getFrog(color) {
        if(this.frogs[color].length > 0) {
            var frog = this.frogs[color].pop();
            this.update();
            return frog;
            
        }
        else {
            return null;
        }
        
    }

    addFrog(frog) {
        //if red, roll again
        var frogColor = frog.color;
        if(frogColor === "red") {
            this.frogs[frogColor].push(frog);
            this.update();
        }
        //if blue get cards
        else if(frogColor === "blue") {
            this.frogs[frogColor].push(frog);   
            this.update();     
        }
        //if yellow trade frogs
        else if(frogColor === "yellow") {
            this.frogs[frogColor].push(frog);  
            this.update();      
        }
        else if(frogColor === "brown") {
            //if brown, send error
            this.frogs[frogColor].push(frog);    
            this.update();    
        }
        else {
            console.log("Village: not a frog");
            return null;
        }
        
    }
}