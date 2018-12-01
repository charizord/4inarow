// written by: Ehud Bartfeld  050-408-1275

$("button.before").on("click",revealTable); //click listener for the game start button

var board =[
            [    [], [], [], [], [], [], []  ],
            [    [], [], [], [], [], [], []  ],
            [    [], [], [], [], [], [], []  ],
            [    [], [], [], [], [], [], []  ],
            [    [], [], [], [], [], [], []  ],
            [    [], [], [], [], [], [], []  ]
            ];//multi-dimensional array to keep track of tokens placed
board[0].fill(0);// fill the array with 0s to signify empty locations
board[1].fill(0);
board[2].fill(0);
board[3].fill(0);
board[4].fill(0);
board[5].fill(0);
var MAXturns = 6*7;//max possible turns able to play (to calculate tie)
var numofturns =1;
var colortoken = 'red';
var boardnum = 1; //number signifying player in the board array, player1 = 1 | player2 = 10
var players ={"1":"Player1", "10":"Player2"};

function revealTable() {

    $('.before').hide(); // hide text and start button

    $('#tablet').show(); // show game table
    $('#resetContainer').show(); // show reset button

    //add click listener to all table cells except firstRow class
    $( "td").not(".firstRow").on("click",null,Game);

    $( '#resetbutton').on("click",null,function(){
        window.location.reload(true);
    });

    $('#playerturn').text(players[boardnum]+" it is your turn");
}

function Game(event){
     var id = $(event.delegateTarget).attr('id').split(',');
     var  i = parseInt(id[0]);
     var  j = parseInt(id[1]);

    //check if move is by the rules
    if(!(checkLegaMove(i,j))) {

        illeagalmove();
        return;
    }
    $( "td").off(); //turn off click listener as to not allow move until turn end
    placetoken(i,j); //in placetoken function:when animation ends, Game2 function is called
}

// second half of game after placed token animation
function Game2(i,j){

    if(checkWin(i,j,(boardnum*4))) {
        endgame();
        return;
    }
    if(gametie())
        return;
    //move to next turn
    nextturn();
    $( "td").not(".firstRow").on("click",null,Game);
}

function checkLegaMove(i,j){

    if(board[i][j] != 0) //if there is already a token in desired spot
        return false;
    if(i ==5)      //if token is in most bottom row
        return true;
    if(board[i+1][j] === 0) //if there is no token below desired spot
        return false;

    return true;
}

function illeagalmove() {
    $('#illegalmove').fadeToggle(500);
    $('#illegalmove').fadeToggle(500);
    $('#illegalmove').fadeToggle(500);
    $('#illegalmove').fadeToggle(500);
}

function placetoken(i,j){
    board[i][j] = boardnum; // playernumber into the board array
    var cons = i.toString()+"_"+j.toString();

    //place token in firstRow cells and correct column
    $('#'+j).prepend('<div class="tokenContainer" ><div class=token id='+cons+'></div></div>');

    // token color changed to the color of the current player
    $('#'+cons).css('background-color',colortoken);

    var alg = (i+1)*50; //number of pixels need to drop token to the correct row

    //animate falling token through game board and when completed continue to Game2
    $('#'+cons).animate({top: alg+'px' },2000,function(){
        Game2(i,j);
    });
}

// change constant variables for the next player
function nextturn(){
    numofturns = numofturns+1;
    switch (colortoken) {
        case 'red':
            colortoken = 'yellow';
            break;
        case 'yellow':
            colortoken = 'red';
            break;
    }
    switch (boardnum){
        case 1:
            boardnum = 10;
            break;
        case 10:
            boardnum = 1;
            break;
    }
    $('#playerturn').text(players[boardnum]+" it is your turn");

}

//checks all possible winning conditions true = win
function checkWin(i,j,winNum){
   var iLength = board.length;
   var jLength =  board[0].length;
   var up,down,left,right = false; // conditions to check diagonal victory without out of bounds exceptions
   var sum;
   var arr;
    //check down
    if(iLength - i > 3){
         down = true;
         arr = [board[i][j],
                     board[i+1][j],
                     board[i+2][j],
                     board[i+3][j]
                    ];
          sum = arr.reduce(getSum);
          if(sum == winNum)
               return true;
   }
    //check up (only needed to make sure no out of bounds during diagonal check)
    if(i >= 3){
          up = true;
     }
    //check right direction
    if(jLength -j > 3){
         right = true;
          arr = [
                    board[i][j],
                    board[i][j+1],
                    board[i][j+2],
                    board[i][j+3]
                    ];
        sum = arr.reduce(getSum);
        if(sum == winNum)
            return true;
    }

    //check left direction
    if(j>= 3) {
         left = true;
          arr = [
                    board[i][j],
                    board[i][j-1],
                    board[i][j-2],
                    board[i][j-3]
         ];

        sum = arr.reduce(getSum);

        if(sum == winNum)
            return true;

    }

    //check upper right diagonal
    if(up == true && right == true){
          arr = [
                     board[i][j],
                     board[i-1][j+1],
                     board[i-2][j+2],
                     board[i-3][j+3]
                     ]; //upper right
        sum = arr.reduce(getSum);
        console.log(sum);
        if(sum == winNum)
            return true;
    }

    //check upper left diagonal
    if(up == true && left == true){
        arr = [
            board[i][j],
            board[i-1][j-1],
            board[i-2][j-2],
            board[i-3][j-3]
        ]; //upper right
        sum = arr.reduce(getSum);
        if(sum == winNum)
            return true;
    }

    //check lower right diagonal
    if(down == true && right == true){
         arr = [
            board[i][j],
            board[i+1][j+1],
            board[i+2][j+2],
            board[i+3][j+3]
        ];
        sum = arr.reduce(getSum);

        if(sum == winNum)
            return true;
    }

    //check lower left diagonal
    if(down == true && left == true){
        arr = [
            board[i][j],
            board[i+1][j-1],
            board[i+2][j-2],
            board[i+3][j-3]
        ]; //upper right
        sum = arr.reduce(getSum);
        if(sum == winNum)
            return true;
    }

     return false;
}

function gametie(){
    if(numofturns === MAXturns) {
        $('td').off(); // remove click listener from table cells
        $('#playerturn').text("Game ended in a tie!");
        return true;
    }
    return false;
}

function endgame(){
    $('td').off();   // remove click listener from table cells
    $('#playerturn').text(players[boardnum]+" has won the game!");
}

// array sum function
function getSum(total, num) {
    return total + num;
}