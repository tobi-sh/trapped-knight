function Position(x,y) {
    this.x = x
    this.y = y
    this.move = function(dx, dy) {
        return new Position(x + dx, y + dy)
    }
}

function Board(size) {
    this.boardSize = 2*size - 1 
    this.cellSize = 50
    this.tiles = []
    for (i=0;i<this.boardSize;i++) {
        this.tiles.push(Array(this.boardSize).fill(0))
    }
    x = Math.ceil(this.boardSize/2)-1
    y = Math.ceil(this.boardSize/2)-1
    this.center = new Position(x,y)
    v  = 1
    // init
    this.tiles[x--][y] = v
    for (r = 1 ; r<size;r++) {
        // up
        upstart = ++v
        this.tiles[++x][--y] = upstart
        // right
        while(this.tiles[x][y+1] != 0){ 
            this.tiles[++x][y] = ++v
        }
        // down
        while(this.tiles[x-1][y] != 0){ 
            this.tiles[x][++y] = ++v
        }
        //left
        while(this.tiles[x][y-1] != 0){ 
            this.tiles[--x][y] = ++v
        }
        //up
        while(this.tiles[x+1][y] != 0 && this.tiles[x+1][y] != upstart ){ 
            this.tiles[x][--y] = ++v
        }
        // right
        while(this.tiles[x+1][y] != upstart){ 
            this.tiles[++x][y] = ++v
        }
    }
}

let theBoard = new Board(20)

theBoard.draw = function() {
    xs = this.tiles.length
    ys = this.tiles[0].length
    formatter = new Intl.NumberFormat('en-IN', { minimumIntegerDigits: 3 })
    filling = "yellow"
    for (y = 0; y < ys; y ++ ) {
        for (x = 0; x < xs ; x ++ ) {
            id = "g" + this.tiles[x][y]
            if (((x+y) % 2) == 0)
                filling = "yellow"
            else
                filling = "black"
            d3.select("svg").append("g").attr("id", id).attr("transform", "translate(" +x*this.cellSize + ", " + y * this.cellSize + ")")
            d3.select("#"+ id).append("rect").attr("width", this.cellSize).attr("height", this.cellSize).attr("style", "fill : "+filling+"; stroke: black; opacity: 0.3")
            d3.select("#"+ id).append("text").attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("x", this.cellSize/2).attr("y", this.cellSize/2).text(formatter.format(this.tiles[x][y]))
        }
    }
}


theBoard.placeKnight = function() {
    d3.select("#g1").append("use").attr("xlink:href", "#knight").attr("transform", "scale(0.7)").attr("id", "knight")
    this.knight = {
        "pos" : this.center,
        "visitedFields" : new Set([])
    }
}

theBoard.moveKnight = function() {
    var current = this.knight.pos 
    var currentVal = this.tiles[current.x][current.y]
    this.knight.visitedFields.add( currentVal )
    var possibleMoves = [{"pos" : current.move(+2, +1), "value": this.tiles[current.x+2][current.y+1]}, 
                         {"pos" : current.move(+2, -1), "value": this.tiles[current.x+2][current.y-1]},
                         {"pos" : current.move(-2, +1), "value": this.tiles[current.x-2][current.y+1]},
                         {"pos" : current.move(-2, -1), "value": this.tiles[current.x-2][current.y-1]},
                         {"pos" : current.move(+1, +2), "value": this.tiles[current.x+1][current.y+2]}, 
                         {"pos" : current.move(+1, -2), "value": this.tiles[current.x+1][current.y-2]},
                         {"pos" : current.move(-1, +2), "value": this.tiles[current.x-1][current.y+2]},
                         {"pos" : current.move(-1, -2), "value": this.tiles[current.x-1][current.y-2]}]
    var visited = this.knight.visitedFields
    possibleMoves = possibleMoves.filter(function (x) {
        return !visited.has(x.value)
    }).sort(function(a,b){
        return a.value - b.value
    })
    var nextMove = possibleMoves[0].value
    this.knight.pos = possibleMoves[0].pos
    // move the knight
    d3.select("#knight").remove()
    d3.select("#g" + nextMove).append("use").attr("xlink:href", "#knightDef").attr("transform", "scale(0.7)").attr("id", "knight")
    d3.select("#g" + currentVal).attr("style", "opacity : 0.1 ")
}


theBoard.draw()
theBoard.placeKnight()

for (i = 0; i< 1000;i++){
    setTimeout(function() {theBoard.moveKnight()}, i*50)
}