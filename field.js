class Field {
    static empty_code = 0;
    static border_code = 1;
    static cells_colour = 'black';
    static border_colour = 'lightblue';
    static cell_size = 20;
    static line_width = 1;

    constructor(size) {
        this.size = size;

        this.matrix = [];
        this.borders = [];
    }

    set_stage(stage) {
        this.#clear_matrix();
        this.borders = stage.get_borders();
        this.borders.forEach(point => {
            this.matrix[point.y][point.x] = Field.border_code;
        });
    }

    add_snake(snake) {
        // add snake to the matrix
        snake.coordinates.forEach(point => {
            this.matrix[point.y][point.x] = Snake.code;
        });
    }

    add_apple(apple) {
        if (apple) {
            this.matrix[apple.y][apple.x] = Apple.code;
        }
    }

    is_cell_available(point) {
        // Check if it's possible to move to the cell.
        // The cell should be empty or has apple.
        // Other words, it shouldn't contain either snake or border.
        return [Field.border_code, Snake.code].indexOf(this.matrix[point.y][point.x]) === -1;
    }

    get_random_free_cell() {
        // Get random free cell to put an apple to
        const free_cells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = new Cell(j, i);
                if (this.is_cell_available(cell)) {
                    free_cells.push(cell);
                }
            }
        }
        const idx = Math.floor(Math.random() * free_cells.length);
        return free_cells[idx];
    }

    save_snake_out(point) {
        // "Cut" the snake tail when it leaves the cell.
        this.matrix[point.y][point.x] = Field.empty_code;
    }

    save_snake_in(point) {
        // "Move" the snake head when it's on the cell.
        this.matrix[point.y][point.x] = Snake.code;
    }

    draw(ctx) {
        this.#draw_cell_net(ctx);
        this.#draw_field(ctx);
    }

    #clear_matrix(){
        this.matrix = new Array(this.size);
        for (let i = 0; i < this.size; i++) {
            this.matrix[i] = new Array(this.size).fill(Field.empty_code);
        }
    }

    #draw_cell_net(ctx) {
        const line_length = Field.cell_size * this.size;
        const x = Field.cell_size;
        const y = Field.cell_size;

        ctx.fillStyle = Field.cells_colour;

        for (let i = 0; i <= this.size; i++) {
            ctx.beginPath();
            ctx.rect(x * i, 0, Field.line_width, line_length);
            ctx.fill();

            ctx.beginPath();
            ctx.rect(0, y * i, line_length, Field.line_width);
            ctx.fill();
        }
    }

    #draw_field(ctx) {
        const what_to_draw = [Field.border_code, Snake.code, Apple.code];
        const colours = [Field.border_colour, Snake.colour, Apple.colour];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const idx = what_to_draw.indexOf(this.matrix[i][j]);
                if (idx > -1) {
                    const cell = new Cell(j, i);
                    ctx.beginPath();
                    ctx.fillStyle = colours[idx];
                    ctx.rect(
                        cell.get_canvas_x(),
                        cell.get_canvas_y(),
                        cell.get_canvas_width(),
                        cell.get_canvas_height(),
                    );
                    ctx.fill();
                }
            }
        }
    }
}
