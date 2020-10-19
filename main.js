/*
FIND YOUR HAT

An interactve game where the user must navigate a treacherous hole
filled field to in order to find the mysterious hat. 

Zane Hawken 2020 
*/

//###check index's - may be indexing 1 step top far in places 


//Define constants
const prompt = require('prompt-sync')({sigint: true});
const hat = '^';    //the wining token
const hole = 'O';   //Hole character which users try to avoid
const fieldCharacter = '░'; //Used to fill blank space in a field
const pathCharacter = '*';  //Used to represent the path taken by the user

//Field is a an object class that represents the game board and all gameplay functions
class Field{

    //Constructor for the field object 
    constructor(blankField){
        this._field = blankField;           //_field is the game field
        this._nrows = blankField.length;    //_nrows is the number of rows in the field
        this._ncols = blankField[0].length; //_ncols is the number of columns in the field
        this._moveCount = 0;                //_moveCount is the number of moves taken in the game
        this._gameWon = false;              //_gameWon is true if the game is won
        this._gameComplete = false;         //_gameComplete is true if the game has finished
        this.currentPosition = [0,0];       //currentPosition is the current position the user has navigated to
    };

    //Prints a formated representation of the game field
    get field(){
        for(let n = 0; n< this._field.length; n += 1){
            console.log(this._field[n].join(''))
        }
    };

    //Static method to generate a field
    static generateField(nCols, nRows){
        let field = []; //Array resresentation of a field
        let complexity = 10;
        let filledPositions = []; //Array to track the positions on the field filled by hats & holes


        //For loop to generate a field of size nCols x nRows of field characters
        for(let i = 0; i < nRows; i += 1){
            field.push(Array(nCols).fill(fieldCharacter))
        }

        //Generates a random position for the hat
        let hatPosition = Field.randomPosition(nRows, nCols);
        field[hatPosition[0]][hatPosition[1]] = hat; //Update field with hat position
        filledPositions.push(hatPosition); //Updates the filledPositions arrray

        //Fills the field with a number of holes dependant on the given complexity
        let holePositions = [];
        for(let nHole = 0; nHole < complexity; nHole +=1){
            let position = (Field.randomPosition(nRows, nCols))   //Generate a position

            //Check the position is not taken
            if(filledPositions.some(e => JSON.stringify(e) == JSON.stringify(position))){
                nHole --; //set the step back one to repeat the step
            }else{
                holePositions.push(position);  //Adds position to holePosiiton array
                filledPositions.push(position);//Adds position to filled position array 
            }
        }
        holePositions.forEach(e => field[e[0]][e[1]] = hole); //Draws the holes on the field

        return field
    }

    //randomPosition generates an array representing a non [0,0] position
    //on a field of size nRows x nCols
    static randomPosition(nRows, nCols){
        let position = [0,0];
        while(position[0] == 0 && position[1] == 0){
            position = [
                Math.floor(nRows*Math.random()),
                Math.floor(nCols*Math.random())
            ];
        };
        return position;
    }

    //playgame 
    playgame(){
        this.intro()            //Display the intro screen
        this.moveUser([0,0])    //Sets the starting position of the user to [0,0]
        console.clear();        //Clears the console
        this.field;             //Displays the starting game board

        //loop to request a move from the players 
        while(!this._gameWon && !this._gameComplete){
            this.makeMove()
            this._moveCount += 1;
        }

    }

    //intro displays the game name and introducton
    intro(){
        console.clear()
        console.log("FIND MY HAT\n(c) HUMMUS LAB 2020\n\nDo you have the skills to navigate the treacherous hole filled field to loacte the elusive hat?\n\n")
        prompt("Press enter to begin. ")
    }

    //makeMove runs through a move in gameplay
    makeMove(){
        try{
            let input = this.requestMove();
            this.checkInputValid(input);
            let move = this.proposedMove(input);
            this.checkMoveOnBoard(move);
            this.checkHole(move);
            this.checkHat(move);
            this.moveUser(move);
            console.clear();
            this.field;
            
        }catch(e){
            //console.log("Error Caught in Make Move method") //Print error for debugging
            //console.log(e) //Print error for debugging
        }  
    }

    //Requests a move from the player
    requestMove(){
        return prompt("Next move? ")
    }

    //CheckInputValid checks a given input to see if it is a valid 
    checkInputValid(input){
        let validMove = false;
        if(input === 'l' || input === 'r' || input === 'd'){
            validMove = true;
        }else{
            console.log('Invalid input. Use "l" (left), "r" (right) or "d" (down)');
            throw Error('Invalid input. Use "l" (left), "r" (right) or "d" (down)');
        }
    }

    //Calculates the next proposed position given a valid input
    proposedMove(input){
        let [cRow, cCol] = this.currentPosition; //Access the current field position
        if(input === 'l'){
            return [cRow, cCol-1]   //returns a reference arcoss one column
        }else if(input === 'r'){
            return [cRow, cCol+1]   //returns a reference arcoss one column
        }else if(input === 'd'){
            return [cRow+1, cCol]   //returns a reference down one row
        }else{
            console.log('Invalid move input into proposedMove method');
            throw Error('Invalid move input into proposedMove method');
        }
    }

    //Checks to see the proposed move is on the board
    checkMoveOnBoard(move){
        if(move[0] < 0 || move[0] > this._nrows - 1){
            console.log('Invalid move. Ensure move is within board');
            throw error('Invalid move. Ensure move is within board');
        }else if(move[1] < 0 || move[1] > this._ncols - 1){
            console.log('Invalid move. Ensure move is within board');
            throw Error('Invalid move. Ensure move is within board');
        }
    }

    //Checks to see if player lands on a hole
    checkHole(move){
        let boardPosition = this._field[ move[0] ][ move[1] ];
        if (boardPosition === hole){
            this._gameComplete = true;
            console.log("BAD LUCK!! YOU LANDED ON A HOLE\nGAME OVER.");
            throw Error('Game over');
        }else{
            return false;
        }
    }

    //Checks to see if player lands on the hat
    checkHat(move){
        let boardPosition = this._field[move[0]][move[1]];
        if (boardPosition === hat){
            this._gameComplete = true;
            this._gameWon = true;
            console.log("CONGRATULATIONS!! YOU FOUND THE HAT");
            throw Error('Game complete')
        }else{
            return false;
        }
    }

    //Given a valid move moves the player path to this position
    moveUser(move){
        this.currentPosition = move;
        this._field[move[0]][move[1]] = pathCharacter;   
    }

};

let x = Field.generateField(10,10);

const newGame = new Field(x)

newGame.field

newGame.playgame()




