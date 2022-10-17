/**
 * Data class to store x and y coordinates of the matrix.
 * Has some methods to get coordinates of the cell on canvas.
 */

class Cell extends Point {
    get_canvas_x() {
        return this.x * Field.cell_size + Field.line_width;
    }

    get_canvas_y() {
        return this.y * Field.cell_size + Field.line_width;
    }

    get_canvas_width() {
        return Field.cell_size - Field.line_width;
    }

    get_canvas_height() {
        return Field.cell_size - Field.line_width;
    }
}
