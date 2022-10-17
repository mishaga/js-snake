class Field {
    static empty_code = 0;
    static border_code = 1;
    static cells_colour = 'black';
    static border_colour = 'lightblue';
    static cell_size = 20;
    static line_width = 1;

    constructor(size) {
        this.size = size;
        const last = size - 1;
        this.matrix = new Array(size);
        for (let i = 0; i < size; i++) {
            if (i === 0 || i === last) {
                this.matrix[i] = new Array(size).fill(Field.border_code);
            }
            else {
                this.matrix[i] = new Array(size).fill(Field.empty_code);
                this.matrix[i][0] = this.matrix[i][last] = Field.border_code;
            }
        }
    }

    add_snake(snake) {
        // add snake to the matrix
        for (let i in snake.coordinates) {
            const x = snake.coordinates[i][0];
            const y = snake.coordinates[i][1];
            this.matrix[y][x] = Snake.code;
        }
    }

    add_apple(apple) {
        this.matrix[apple.y][apple.x] = Apple.code;
    }

    is_cell_available(point) {
        // Check if it's possible to move to the cell.
        // The cell should be empty or has apple.
        // Other words, it shouldn't contain either snake or border.
        const x = point[0];
        const y = point[1];
        return [Field.border_code, Snake.code].indexOf(this.matrix[y][x]) === -1;
    }

    get_random_free_cell() {
        // Get random free cell to put an apple to
        const free_cells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.is_cell_available([j, i])) {
                    free_cells.push([j, i]);
                }
            }
        }
        const idx = Math.floor(Math.random() * free_cells.length) + 1;
        return free_cells[idx];
    }

    save_snake_out(x, y) {
        // "Cut" the snake tail when it leaves the cell.
        this.matrix[y][x] = Field.empty_code;
    }

    save_snake_in(x, y) {
        // "Move" the snake head when it's on the cell.
        this.matrix[y][x] = Snake.code;
    }

    draw(ctx) {
        this.#draw_cell_net(ctx);
        this.#draw_field(ctx);
    }

    #get_cell_coordinates(i, j) {
        const x = j * Field.cell_size;
        const y = i * Field.cell_size;
        return [x, y];
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
        const width_height = Field.cell_size - Field.line_width;
        const what_to_draw = [Field.border_code, Snake.code, Apple.code];
        const colours = [Field.border_colour, Snake.colour, Apple.colour];
        let center;
        let idx;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                idx = what_to_draw.indexOf(this.matrix[i][j]);
                if (idx > -1) {
                    center = this.#get_cell_coordinates(i, j);
                    ctx.fillStyle = colours[idx];
                    ctx.beginPath();
                    ctx.rect(
                        center[0] + Field.line_width,
                        center[1] + Field.line_width,
                        width_height, width_height
                    );
                    ctx.fill();
                }
            }
        }
    }
}
