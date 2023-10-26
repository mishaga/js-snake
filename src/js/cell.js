/**
 * Data class to store x and y coordinates of the matrix.
 * Has some methods to get coordinates of the cell on canvas.
 */

class Cell extends Point {
    getCanvasX() {
        return this.x * Field.cellSize + Field.lineWidth
    }

    getCanvasY() {
        return this.y * Field.cellSize + Field.lineWidth
    }

    getCanvasWidth() {
        return Field.cellSize - Field.lineWidth
    }

    getCanvasHeight() {
        return Field.cellSize - Field.lineWidth
    }
}
