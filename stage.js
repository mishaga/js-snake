class Stage {
    static max_number = 3;

    constructor(stage_number, field_size) {
        this.number = stage_number > Stage.max_number ? 1 : stage_number;
        this.field_size = field_size;
    }

    get_borders() {
        const last = this.field_size - 1;
        const borders = [];

        if (this.number > 1) {
            for (let i = 0; i < this.field_size; i++) {
                if (i === 0 || i === last) {
                    for (let j = 0; j < this.field_size; j++) {
                        borders.push(new Cell(j, i));
                    }
                }
                else {
                    borders.push(new Cell(0, i));
                    borders.push(new Cell(last, i));
                }
            }
        }

        if (this.number === 3) {
            const mid = Math.floor(this.field_size / 2);
            const bar_len = 13;
            const start_x = mid - Math.floor(bar_len / 2);
            [-3, 3].forEach(idx => {
                for (let i = 0; i < bar_len; i++) {
                    borders.push(new Cell(start_x + i, mid + idx));
                }
            });
        }

        return borders;
    }
}
