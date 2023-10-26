const canvas = document.getElementById('snake-game')

const initialFieldSize = 25
const initialSnakeLength = 3

let game = new Game(initialFieldSize, initialSnakeLength, canvas)
game.init()

document.onkeydown = event => {
    switch (game.status) {
        case 'READY':
            if (event.code === 'Enter') {
                game.start()
            }
            break
        case 'ACTION':
            switch (event.code) {
                case 'ArrowUp':
                    game.snake.redirect('U')
                break
                case 'ArrowRight':
                    game.snake.redirect('R')
                break
                case 'ArrowDown':
                    game.snake.redirect('D')
                break
                case 'ArrowLeft':
                    game.snake.redirect('L')
                break
            }
            break
        case 'OVER':
        case 'WIN':
            if (event.code === 'Escape') {
                game = new Game(initialFieldSize, initialSnakeLength, canvas)
                game.init()
            }
            break
    }
}
