class Game {
    static speed_list = [450, 400, 350, 300, 270, 240, 200, 160, 140, 120, 110, 100, 90, 80, 70];

    constructor(field_size, snake_length, canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stage = new Stage(1, field_size);
        this.field = new Field(field_size);
        this.snake = null;
        this.apple = null;

        this.speed_index = 0;
        this.apples_counter = 0;
        this.wait_for_apple = 0;

        this.tick = null;
        this.no_apple_delay = 4;
        this.win_apples_count = 50;
        this.initial_snake_length = snake_length;

        this.canvas_size = field_size * Field.cell_size + Field.line_width;
        this.canvas.width = this.canvas_size;
        this.canvas.height = this.canvas_size;
    }

    init() {
        this.snake = new Snake(this.field.size, this.initial_snake_length);
        this.apple = null;

        this.speed_index = 0;
        this.apples_counter = 0;
        this.wait_for_apple = 0;

        this.field.set_stage(this.stage);
        this.field.add_snake(this.snake);

        this.#ready();
        this.animate();
        this.#print_statistics();
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
        this.ctx.clearRect(0, 0, this.canvas_size, this.canvas_size);
        this.field.draw(this.ctx);
    }

    start() {
        this.status = 'ACTION';
        this.#reset_timer(this.speed_index);
    }

    #ready() {
        this.status = 'READY';
        this.#stop_timer();
    }

    #over() {
        this.status = 'OVER';
        this.#stop_timer();
    }

    #stage_complete() {
        this.status = 'COMPLETE';
        this.#stop_timer();
        if (this.stage.number === Stage.max_number) {
            this.#win();
        }
        else {
            setTimeout(() => {
                this.stage = new Stage(this.stage.number + 1, this.field.size);
                this.init();
            }, 2500);
            this.#print_statistics();
        }
    }

    #win() {
        this.status = 'WIN';
        this.#stop_timer();
        this.#print_statistics();
    }

    #stop_timer() {
        clearInterval(this.tick);
    }

    #reset_timer() {
        this.#stop_timer();
        this.tick = setInterval(() => {this.#move()}, Game.speed_list[this.speed_index]);
    }

    #move() {
        const point = this.snake.get_next_step(this.field.size);
        if (this.field.is_cell_available(point)) {
            this.snake.coordinates.push(point);
            this.field.save_snake_in(point);
            if (this.apple && this.apple.x === point.x && this.apple.y === point.y) {
                // ate apple (should leave tail's position)
                this.increase_speed();
                this.apple = null;
                this.apples_counter++;
                this.wait_for_apple = 0;
                if (this.apples_counter === this.win_apples_count) {
                    this.#stage_complete();
                }
            }
            else {
                // regular move (should move tail forward)
                const tail = this.snake.coordinates.shift();
                this.field.save_snake_out(tail);
                // generate new apple if needed
                if (this.apple === null) {
                    this.wait_for_apple++;
                    if (this.wait_for_apple === this.no_apple_delay) {
                        const random_point = this.field.get_random_free_cell();
                        this.apple = new Apple(random_point.x, random_point.y);
                        this.field.add_apple(this.apple);
                    }
                }
            }
        }
        else {
            this.#over();
        }

        this.#print_statistics();
    }

    #print_statistics() {
        const stage_info = `Stage: ${this.stage.number} / ${Stage.max_number}`;
        const apples_info = `Apples: ${this.apples_counter} / ${this.win_apples_count}`;
        let text;
        switch (this.status) {
            case 'READY':
                text = [
                    this.stage.number === 1 ? 'JS Snake game' : stage_info,
                    'Press Enter to start',
                ];
                break;
            case 'ACTION':
                text = [stage_info, apples_info];
                break;
            case 'COMPLETE':
                text = [`Stage ${this.stage.number} is complete`, 'Congratulations'];
                break;
            case 'WIN':
                text = ['You won! Congratulations', 'Press Escape to restart'];
                break;
            case 'OVER':
                text = [stage_info, apples_info, 'Game over. Press Escape to restart'];
                break;
        }
        const statistics_field = document.getElementById('statistics');
        statistics_field.innerHTML = text.join('<br />');
    }
}
