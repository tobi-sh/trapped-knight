function calcRingSize(r) {
    a = 0
    for(i=0;i<r;i++) {
      a += Math.pow(2*i+1,2)
      console.log(i, ": ", 2*i+1, "(" , Math.pow(2*i+1,2), ") => ", a)
    }
    return a
}

function createBoard() {
    rings = 12
    boardSize = 2*rings - 1 
    board = []
    for (i=0;i<boardSize;i++) {
        board.push(Array(boardSize).fill(0))
    }
    x = Math.ceil(boardSize/2)-1
    y = Math.ceil(boardSize/2)-1
    v  = 1
    // init
    board[x--][y] = v
    for (r = 1 ; r<rings;r++) {
        // up
        upstart = ++v
        board[++x][--y] = upstart
        // right
        while(board[x][y+1] != 0){ 
            board[++x][y] = ++v
        }
        // down
        while(board[x-1][y] != 0){ 
            board[x][++y] = ++v
        }
        //left
        while(board[x][y-1] != 0){ 
            board[--x][y] = ++v
        }
        //up
        while(board[x+1][y] != 0 && board[x+1][y] != upstart ){ 
            board[x][--y] = ++v
        }
        // right
        while(board[x+1][y] != upstart){ 
            board[++x][y] = ++v
        }
    }
    return board
}


function debugPrintBoard(board) {
    let a = new Intl.NumberFormat('en-IN', { minimumIntegerDigits: 3 })
    xs = board.length
    ys = board[0].length
    for (y = 0; y < ys; y ++ ) {
        s = ""
        for (x = 0; x < xs ; x ++ ) {
            s += a.format(board[x][y]) + ' '
        }
        console.log(s)
    }
}

function drawBoard(board) {
    xs = board.length
    ys = board[0].length
    formatter = new Intl.NumberFormat('en-IN', { minimumIntegerDigits: 3 })
    filling = "yellow"
    //    <rect width="50" height="50" x="500" y="500" style="fill:none;stroke-width:1;stroke:rgb(0,0,0)" id=r1 />
    for (y = 0; y < ys; y ++ ) {
        for (x = 0; x < xs ; x ++ ) {
            id = "g" + board[x][y]
            if (((x+y) % 2) == 0)
                filling = "yellow"
            else
                filling = "black"
            d3.select("svg").append("g").attr("id", id).attr("transform", "translate(" +x*50 + ", " + y * 50 + ")")
            d3.select("#"+ id).append("rect").attr("width", "50").attr("height", "50").attr("style", "fill : "+filling+"; stroke: black; opacity: 0.3")
            d3.select("#"+ id).append("text").attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("x", "25").attr("y", "25").text(formatter.format(board[x][y]))
        }
    }
}

drawBoard(createBoard())