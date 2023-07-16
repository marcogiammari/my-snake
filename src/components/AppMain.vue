<script>
import Snake from "/src/data/store.js";

export default {
    name: "AppMain",
    data() {
        return {
            Snake,
            snakes: [],
            turns: {
                right: [],
                down: [],
                left: [],
                up: [],
            },
            eventKeys: ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"],
            movement: null,
            lastDir: null,
            apple: { x: 5, y: 1 },
            positions: null,
            speed: 200,
            points: 0,
            gameOver: false,
        };
    },
    mounted() {
        for (let i = 1; i < 2; i++) {
            let newSnake = new this.Snake(i, 1, "right");
            this.snakes.push(newSnake);
        }
    },
    methods: {
        newSnake() {
            let lastSnake = this.snakes[0];
            if (lastSnake.direction == "right") {
                this.snakes.unshift(
                    new this.Snake(
                        this.snakes[0].x == 1 ? 10 : this.snakes[0].x - 1,
                        this.snakes[0].y,
                        null
                    )
                );
            } else if (lastSnake.direction == "down") {
                this.snakes.unshift(
                    new this.Snake(
                        this.snakes[0].x,
                        this.snakes[0].y == 1 ? 10 : this.snakes[0].y - 1,
                        null
                    )
                );
            } else if (lastSnake.direction == "left") {
                this.snakes.unshift(
                    new this.Snake(
                        this.snakes[0].x == 10 ? 1 : this.snakes[0].x + 1,
                        this.snakes[0].y
                    )
                );
            } else if (lastSnake.direction == "up") {
                this.snakes.unshift(
                    new this.Snake(
                        this.snakes[0].x,
                        this.snakes[0].y == 10 ? 1 : this.snakes[0].y + 1,
                        null
                    )
                );
            }
        },
        newApple() {
            let apple = {
                x: Math.floor(Math.random() * 10) + 1,
                y: Math.floor(Math.random() * 10) + 1,
            };

            if (!this.positions.includes(`${apple.x}${apple.y}`)) {
                this.apple = apple;
            } else {
                this.newApple();
            }
        },
        hasApple(x, y) {
            if (x == this.apple.x && y == this.apple.y) {
                return true;
            }
        },
        hasSnake(x, y) {
            for (let i = 0; i < this.snakes.length; i++) {
                const snake = this.snakes[i];
                if (x == snake.x && y == snake.y) {
                    return true;
                }
            }
        },
        hasEaten(x, y) {
            if (x == this.apple.x && y == this.apple.y) {
                return true;
            }
        },
        move($event) {
            if (
                ($event.key == "ArrowRight" && this.lastDir != "ArrowLeft") ||
                ($event.key == "ArrowDown" && this.lastDir != "ArrowUp") ||
                ($event.key == "ArrowLeft" && this.lastDir != "ArrowRight") ||
                ($event.key == "ArrowUp" && this.lastDir != "ArrowDown")
            ) {
                this.lastDir = $event.key;
                clearInterval(this.movement);
                this.movement = setInterval(() => {
                    let newTurn = `${this.snakes[this.snakes.length - 1].x}${
                        this.snakes[this.snakes.length - 1].y
                    }`;

                    if ($event.key == "ArrowRight") {
                        if (!this.turns.right.includes(newTurn)) {
                            this.turns.right.push(newTurn);
                        }
                    }
                    if ($event.key == "ArrowDown") {
                        if (!this.turns.down.includes(newTurn)) {
                            this.turns.down.push(newTurn);
                        }
                    }
                    if ($event.key == "ArrowLeft") {
                        if (!this.turns.left.includes(newTurn)) {
                            this.turns.left.push(newTurn);
                        }
                    }
                    if ($event.key == "ArrowUp") {
                        if (!this.turns.up.includes(newTurn)) {
                            this.turns.up.push(newTurn);
                        }
                    }

                    let appleEaten = false;

                    for (let i = 0; i < this.snakes.length; i++) {
                        const snake = this.snakes[i];
                        let position = `${snake.x}${snake.y}`;
                        if (this.turns.right.includes(position)) {
                            snake.moveRight();
                            appleEaten = this.hasEaten(snake.x, snake.y);
                        } else if (this.turns.down.includes(position)) {
                            snake.moveDown();
                            appleEaten = this.hasEaten(snake.x, snake.y);
                        } else if (this.turns.left.includes(position)) {
                            snake.moveLeft();
                            appleEaten = this.hasEaten(snake.x, snake.y);
                        } else if (this.turns.up.includes(position)) {
                            snake.moveUp();
                            appleEaten = this.hasEaten(snake.x, snake.y);
                        }
                    }

                    if (appleEaten) {
                        this.newSnake();
                        this.newApple();
                        this.speed >= 150 ? (this.speed -= 10) : "";
                        this.points++;
                    }

                    this.positions = [];
                    this.snakes.forEach((snake) => {
                        this.positions.push(`${snake.x}${snake.y}`);
                    });

                    if (
                        new Set(this.positions).size !== this.positions.length
                    ) {
                        clearInterval(this.movement);
                        this.gameOver = true;
                    }

                    for (const dir in this.turns) {
                        const array = this.turns[dir];
                        for (let i = 0; i < array.length; i++) {
                            const turn = array[i];
                            if (!this.positions.includes(turn)) {
                                const index = array.indexOf(turn);
                                array.splice(index, 1);
                                break;
                            }
                        }
                    }
                }, this.speed);
            }
        },
    },
};
</script>

<template>
    <main
        tabindex="0"
        @keyup.right="move($event)"
        @keyup.down="move($event)"
        @keyup.left="move($event)"
        @keyup.up="move($event)"
        class="bg-slate-900 flex items-center justify-center h-[calc(100vh-4rem)]"
    >
        <div class="wrapper h-1/2">
            <div class="text-center text-green-500 font-bold mb-8">
                Points: {{ points }}
            </div>
            <div class="board grid grid-cols-10 h-full">
                <div
                    v-for="x in 10"
                    class="square w-10 h-10 bg-slate-500 border border-slate-950"
                >
                    <div
                        v-for="y in 10"
                        class="square w-10 h-10 bg-slate-500 border border-slate-950"
                        :class="{
                            apple: hasApple(x, y),
                            snake: hasSnake(x, y),
                        }"
                    ></div>
                </div>
            </div>
            <div
                v-if="gameOver"
                class="text-center text-green-500 font-bold mt-8"
            >
                <p>Game Over!</p>
                <p>You scored {{ points }} points</p>
            </div>
        </div>
    </main>
</template>

<style>
.snake {
    background-color: lime;
}

.apple {
    background-color: crimson;
}
</style>
