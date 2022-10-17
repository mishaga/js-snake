class Snake {
    static code = 2
    static colour = 'lightgreen';

    constructor(field_size, snake_length) {
        const coordinates = [];
        const field_mid = Math.floor(field_size / 2);
        const snake_mid = Math.floor(snake_length / 2);
        const start_x = field_mid - snake_mid;

        for (let i = start_x; i < start_x + snake_length; i++) {
            coordinates.push(new Cell(i, field_mid));
        }
        this.coordinates = coordinates;
        this.direction = 'R';
        this.field_size = field_size;
    }

    redirect(direction) {
        if (['L', 'U', 'R', 'D'].indexOf(direction) > -1) {
            const curren_direction = this.direction;
            this.direction = direction;
            // detect and prevent moving inside of snake
            const nxt = this.get_next_step();
            const neck = this.#get_neck_coordinates();
            if (nxt.x === neck.x && nxt.y === neck.y) {
                this.direction = curren_direction;
            }
        }
    }

    get_next_step() {
        const cell = this.#get_head_coordinates();
        let x = cell.x;
        let y = cell.y;
        switch (this.direction) {
            case 'R':
                x = x + 1 === this.field_size ? 0 : x + 1;
                break;
            case 'L':
                x = x === 0 ? this.field_size - 1 : x - 1;
                break;
            case 'U':
                y = y === 0 ? this.field_size - 1 : y - 1;
                break;
            default:
                y = y + 1 === this.field_size ? 0 : y + 1;
                break;
        }
        return new Cell(x, y);
    }

    #get_head_coordinates() {
        return this.coordinates[this.coordinates.length - 1];
    }

    #get_neck_coordinates() {
        return this.coordinates[this.coordinates.length - 2];
    }
}
