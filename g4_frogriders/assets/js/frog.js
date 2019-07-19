class Frog {
    constructor(color, domElement) {
        this.color = color;
        this.row = null;
        this.col = null;
        this.domElement = $(domElement);
        this.caught = false;
    }
    getColor(){
        return this.color;
    }
    setPosition(row, col){
        this.row = row;
        this.col = col;
        
    }
    getPosition(){
        return {row: this.row, col: this.col};
    }

    getFrog() {
        return $('<div>').addClass("frog " + this.color);
    }

    tag() {
        this.row = null;
        this.col = null;
        this.domElement = null;
        this.caught = true;
    }
}
