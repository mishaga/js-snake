class Game {
    static speed_list = [450, 400, 350, 300, 270, 240, 200, 160, 140, 120, 110, 100, 90, 80, 70];

    constructor(field_size, snake_length, canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.field = new Field(field_size);
        this.snake = new Snake(field_size, snake_length);
        this.apple = null;

        this.speed_index = 0;
        this.apples_counter = 0;

        this.wait_for_apple = 0;
        this.no_apple_delay = 3;

        this.canvas.width = Field.cell_size * this.field.size + Field.line_width;
    }

    init() {
        this.field.add_snake(this.snake);
        this.ready();
        this.animate();
        this.#print_statistics();
    }

    ready() {
        this.status = 'READY';
    }

    start() {
        this.status = 'ACTION';
        this.#reset_timer(this.speed_index);
    }

    over() {
        this.status = 'OVER';
        this.#stop_timer();
    }

    increase_speed() {
        if (this.speed_index + 1 < Game.speed_list.length) {
            this.speed_index++;
            this.#reset_timer();
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(()=>{this.animate()});
    }

    draw() {
        this.canvas.height = Field.cell_size * this.field.size + Field.line_width;
        this.field.draw(this.ctx);
    }

    #stop_timer() {
        clearInterval(this.tick);
    }

    #reset_timer() {
        this.#stop_timer();
        this.tick = setInterval(() => {this.#move()}, Game.speed_list[this.speed_index]);
    }

    #move() {
        const point = this.snake.get_next_step();
        const x = point[0];
        const y = point[1];
        if (this.field.is_cell_available(point)) {
            if (this.apple && this.apple.x === x && this.apple.y === y) {
                // ate apple (should leave tail position)
                this.apple = null;
                this.increase_speed();
                this.apples_counter++;
                this.wait_for_apple = 0;
                this.no_apple_delay = Math.floor(Math.random() * 7) + 1; // it takes 1..7 steps to get new apple
            }
            else {
                // regular move (should move tail forward)
                const tail = this.snake.coordinates.shift();
                this.field.save_snake_out(tail[0], tail[1]);
                // generate new apple if needed
                if (this.apple === null) {
                    this.wait_for_apple++;
                    if (this.wait_for_apple === this.no_apple_delay) {
                        const random_point = this.field.get_random_free_cell();
                        this.apple = new Apple(random_point[0], random_point[1]);
                        this.field.add_apple(this.apple);
                    }
                }
            }
            this.snake.coordinates.push(point);
            this.field.save_snake_in(x, y);
        }
        else {
            this.over();
        }

        this.#print_statistics();
    }

    #print_statistics() {
        let text;
        if (this.status === 'READY') {
            text = [
                'JS Snake game',
                'Press enter to start',
            ];
        }
        else {
            text = [
                'Apples: ' + this.apples_counter,
                'Speed: ' + (this.speed_index + 1) + '/' + Game.speed_list.length,
            ];
        }
        if (this.status === 'OVER') {
            text.push('Game over. Press Esc to restart');
        }
        const statistics_field = document.getElementById('statistics');
        statistics_field.innerHTML = text.join('<br />');
    }
}
