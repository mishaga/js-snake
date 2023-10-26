class Stage {
    static maxNumber = 3

    constructor(stageNumber, fieldSize) {
        this.number = stageNumber > Stage.maxNumber ? 1 : stageNumber
        this.fieldSize = fieldSize
    }

    getBorders() {
        const last = this.fieldSize - 1
        const borders = []

        if (this.number > 1) {
            for (let i = 0; i < this.fieldSize; i++) {
                if (i === 0 || i === last) {
                    for (let j = 0; j < this.fieldSize; j++) {
                        borders.push(new Cell(j, i))
                    }
                }
                else {
                    borders.push(new Cell(0, i))
                    borders.push(new Cell(last, i))
                }
            }
        }

        if (this.number === 3) {
            const mid = Math.floor(this.fieldSize / 2)
            const barLen = 13
            const startX = mid - Math.floor(barLen / 2);
            [-3, 3].forEach(idx => {
                for (let i = 0; i < barLen; i++) {
                    borders.push(new Cell(startX + i, mid + idx))
                }
            })
        }

        return borders
    }
}
