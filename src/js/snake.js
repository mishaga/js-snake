class Snake {
    static code = 2
    static colour = 'lightgreen'

    constructor(fieldSize, snakeLength) {
        const coordinates = []
        const fieldMid = Math.floor(fieldSize / 2)
        const snakeMid = Math.floor(snakeLength / 2)
        const startX = fieldMid - snakeMid

        for (let i = startX; i < startX + snakeLength; i++) {
            coordinates.push(new Cell(i, fieldMid))
        }
        this.coordinates = coordinates
        this.direction = 'R'
        this.fieldSize = fieldSize
    }

    redirect(direction) {
        if (['L', 'U', 'R', 'D'].indexOf(direction) > -1) {
            const currenDirection = this.direction
            this.direction = direction
            // detect and prevent moving inside of snake
            const nxt = this.getNextStep()
            const neck = this.#getNeckCoordinates()
            if (nxt.x === neck.x && nxt.y === neck.y) {
                this.direction = currenDirection
            }
        }
    }

    getNextStep() {
        const cell = this.#getHeadCoordinates()
        let x = cell.x
        let y = cell.y
        switch (this.direction) {
            case 'R':
                x = x + 1 === this.fieldSize ? 0 : x + 1
                break
            case 'L':
                x = x === 0 ? this.fieldSize - 1 : x - 1
                break
            case 'U':
                y = y === 0 ? this.fieldSize - 1 : y - 1
                break
            default:
                y = y + 1 === this.fieldSize ? 0 : y + 1
                break
        }
        return new Cell(x, y)
    }

    #getHeadCoordinates() {
        return this.coordinates[this.coordinates.length - 1]
    }

    #getNeckCoordinates() {
        return this.coordinates[this.coordinates.length - 2]
    }
}
