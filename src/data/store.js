export default class Snake {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
    }

    moveRight() {
        this.direction = "right";
        this.x == 10 ? (this.x = 1) : this.x++;
    }

    moveDown() {
        this.direction = "down";
        this.y == 10 ? (this.y = 1) : this.y++;
    }

    moveLeft() {
        this.direction = "left";
        this.x == 1 ? (this.x = 10) : this.x--;
    }

    moveUp() {
        this.direction = "up";
        this.y == 1 ? (this.y = 10) : this.y--;
    }
}
