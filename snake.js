class Snake {
    static code = 2
    static colour = 'lightgreen';

    constructor(field_size, snake_length) {
        const coordinates = [];
        const mid = Math.floor(field_size / 2);
        for (let i = 0; i < snake_length; i++) {
            coordinates.push([mid + i - 1, mid]);
        }
        this.coordinates = coordinates;
        this.direction = 'R';
    }

    redirect(direction) {
        if (['L', 'U', 'R', 'D'].indexOf(direction) > -1) {
            const curren_direction = this.direction;
            this.direction = direction;
            // detect and prevent moving inside of snake
            const nxt = this.get_next_step();
            const neck = this.coordinates[this.coordinates.length - 2];
            if (nxt[0] === neck[0] && nxt[1] === neck[1]) {
                this.direction = curren_direction;
            }
        }
    }

    get_next_step() {
        const last = this.coordinates.length - 1;
        const x = this.coordinates[last][0];
        const y = this.coordinates[last][1];
        switch (this.direction) {
            case 'R':
                return [x + 1, y];
            case 'L':
                return [x - 1, y];
            case 'U':
                return [x, y - 1];
            default:
                return [x, y + 1];
        }
    }
}
