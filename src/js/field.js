class Field {
    static emptyCode = 0
    static borderCode = 1
    static cellsColour = 'black'
    static borderColour = 'lightblue'
    static cellSize = 20
    static lineWidth = 1

    constructor(size) {
        this.size = size

        this.matrix = []
        this.borders = []
    }

    setStage(stage) {
        this.#clearMatrix()
        this.borders = stage.getBorders()
        this.borders.forEach(point => {
            this.matrix[point.y][point.x] = Field.borderCode
        })
    }

    addSnake(snake) {
        // add snake to the matrix
        snake.coordinates.forEach(point => {
            this.matrix[point.y][point.x] = Snake.code
        })
    }

    addApple(apple) {
        if (apple) {
            this.matrix[apple.y][apple.x] = Apple.code
        }
    }

    isCellAvailable(point) {
        // Check if it's possible to move to the cell.
        // The cell should be empty or has apple.
        // Other words, it shouldn't contain either snake or border.
        return [Field.borderCode, Snake.code].indexOf(this.matrix[point.y][point.x]) === -1
    }

    getRandomFreeCell() {
        // Get random free cell to put an apple to
        const freeCells = []
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = new Cell(j, i)
                if (this.isCellAvailable(cell)) {
                    freeCells.push(cell)
                }
            }
        }
        const idx = Math.floor(Math.random() * freeCells.length)
        return freeCells[idx]
    }

    saveSnakeOut(point) {
        // "Cut" the snake tail when it leaves the cell.
        this.matrix[point.y][point.x] = Field.emptyCode
    }

    saveSnakeIn(point) {
        // "Move" the snake head when it's on the cell.
        this.matrix[point.y][point.x] = Snake.code
    }

    draw(ctx) {
        this.#drawCellNet(ctx)
        this.#drawField(ctx)
    }

    #clearMatrix(){
        this.matrix = new Array(this.size)
        for (let i = 0; i < this.size; i++) {
            this.matrix[i] = new Array(this.size).fill(Field.emptyCode)
        }
    }

    #drawCellNet(ctx) {
        const lineLength = Field.cellSize * this.size
        const x = Field.cellSize
        const y = Field.cellSize

        ctx.fillStyle = Field.cellsColour

        for (let i = 0; i <= this.size; i++) {
            ctx.beginPath()
            ctx.rect(x * i, 0, Field.lineWidth, lineLength)
            ctx.fill()

            ctx.beginPath()
            ctx.rect(0, y * i, lineLength, Field.lineWidth)
            ctx.fill()
        }
    }

    #drawField(ctx) {
        const whatToDraw = [Field.borderCode, Snake.code, Apple.code]
        const colours = [Field.borderColour, Snake.colour, Apple.colour]
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const idx = whatToDraw.indexOf(this.matrix[i][j])
                if (idx > -1) {
                    const cell = new Cell(j, i)
                    ctx.beginPath()
                    ctx.fillStyle = colours[idx]
                    ctx.rect(
                        cell.getCanvasX(),
                        cell.getCanvasY(),
                        cell.getCanvasWidth(),
                        cell.getCanvasHeight(),
                    )
                    ctx.fill()
                }
            }
        }
    }
}
