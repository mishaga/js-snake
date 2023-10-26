class Game {
    static speedList = [450, 400, 350, 300, 270, 240, 200, 160, 140, 120, 110, 100, 90, 80, 70]

    constructor(fieldSize, snakeLength, canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.stage = new Stage(1, fieldSize)
        this.field = new Field(fieldSize)
        this.snake = null
        this.apple = null

        this.speedIndex = 0
        this.applesCounter = 0
        this.waitForApple = 0

        this.tick = null
        this.noAppleDelay = 4
        this.winApplesCount = 50
        this.initialSnakeLength = snakeLength

        this.canvasSize = fieldSize * Field.cellSize + Field.lineWidth
        this.canvas.width = this.canvasSize
        this.canvas.height = this.canvasSize
    }

    init() {
        this.snake = new Snake(this.field.size, this.initialSnakeLength)
        this.apple = null

        this.speedIndex = 0
        this.applesCounter = 0
        this.waitForApple = 0

        this.field.setStage(this.stage)
        this.field.addSnake(this.snake)

        this.#ready()
        this.animate()
        this.#printStatistics()
    }

    increaseSpeed() {
        if (this.speedIndex + 1 < Game.speedList.length) {
            this.speedIndex++
            this.#resetTimer()
        }
    }

    animate() {
        this.draw()
        requestAnimationFrame(()=>{this.animate()})
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize)
        this.field.draw(this.ctx)
    }

    start() {
        this.status = 'ACTION'
        this.#resetTimer(this.speedIndex)
    }

    #ready() {
        this.status = 'READY'
        this.#stopTimer()
    }

    #over() {
        this.status = 'OVER'
        this.#stopTimer()
    }

    #stageComplete() {
        this.status = 'COMPLETE'
        this.#stopTimer()
        if (this.stage.number === Stage.maxNumber) {
            this.#win()
        }
        else {
            setTimeout(() => {
                this.stage = new Stage(this.stage.number + 1, this.field.size)
                this.init()
            }, 2500)
            this.#printStatistics()
        }
    }

    #win() {
        this.status = 'WIN'
        this.#stopTimer()
        this.#printStatistics()
    }

    #stopTimer() {
        clearInterval(this.tick)
    }

    #resetTimer() {
        this.#stopTimer()
        this.tick = setInterval(() => {this.#move()}, Game.speedList[this.speedIndex])
    }

    #move() {
        const point = this.snake.getNextStep(this.field.size)
        if (this.field.isCellAvailable(point)) {
            this.snake.coordinates.push(point)
            this.field.saveSnakeIn(point)
            if (this.apple && this.apple.x === point.x && this.apple.y === point.y) {
                // ate apple (should leave tail's position)
                this.increaseSpeed()
                this.apple = null
                this.applesCounter++
                this.waitForApple = 0
                if (this.applesCounter === this.winApplesCount) {
                    this.#stageComplete()
                }
            }
            else {
                // regular move (should move tail forward)
                const tail = this.snake.coordinates.shift()
                this.field.saveSnakeOut(tail)
                // generate new apple if needed
                if (this.apple === null) {
                    this.waitForApple++
                    if (this.waitForApple === this.noAppleDelay) {
                        const randomPoint = this.field.getRandomFreeCell()
                        this.apple = new Apple(randomPoint.x, randomPoint.y)
                        this.field.addApple(this.apple)
                    }
                }
            }
        }
        else {
            this.#over()
        }

        this.#printStatistics()
    }

    #printStatistics() {
        const stageInfo = `Stage: ${this.stage.number} / ${Stage.maxNumber}`
        const applesInfo = `Apples: ${this.applesCounter} / ${this.winApplesCount}`
        let text
        switch (this.status) {
            case 'READY':
                text = [
                    this.stage.number === 1 ? 'JS Snake game' : stageInfo,
                    'Press Enter to start',
                ]
                break
            case 'ACTION':
                text = [stageInfo, applesInfo]
                break
            case 'COMPLETE':
                text = [`Stage ${this.stage.number} is complete`, 'Congratulations']
                break
            case 'WIN':
                text = ['You won! Congratulations', 'Press Escape to restart']
                break
            case 'OVER':
                text = [stageInfo, applesInfo, 'Game over. Press Escape to restart']
                break
        }
        const statisticsField = document.getElementById('statistics')
        statisticsField.innerHTML = text.join('<br />')
    }
}
