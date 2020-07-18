canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

document.addEventListener("keydown", keyPush);

class Helper
{
    static getRandomInt(min, max)
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static removeIndex(array, index)
    {
        if (index >= array.length || array.length <= 0)
        {
            return;
        }
        array[index] = array[array.length - 1];
        array[array.length - 1] = undefined;
        array.length = array.length - 1;
    }
}

function keyPush()
{
    if (event.keyCode === 37)
    {
        game.ship.x -= game.ship.dx;
    }

    if (event.keyCode === 39)
    {
        game.ship.x += game.ship.dx;
    }
}

class Ship
{
    constructor(x, y, dx, context) {
        this.x = x;
        this.y = y;
        this.w = 82;
        this.h = 96;
        this.dx = dx;
        this.ctx = context;
        this.img = new Image();
        this.img.src = 'img/spaceship.png';
    }

    update()
    {
    }

    draw()
    {
        this.ctx.drawImage(
            this.img,
            this.x, this.y,
            this.w, this.h
        )
    }
}

class Enemy
{
    constructor(x, y, dx, dy, enemyDirection, context) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.enemyDirection = enemyDirection;
        this.w = 51;
        this.h = 40;
        this.ctx = context;
        this.img = new Image();
        this.img.src = 'img/enemy.png';
    }

    update()
    {
    }

    draw()
    {
        this.ctx.drawImage(
            this.img,
            this.x, this.y,
            this.w, this.h
        )
    }
}

class Game
{
    constructor(context) {
        this.ctx = context;
        this.ship = new Ship(100, 550, 12, this.ctx);
        this.enemy = new Enemy(2000, 0, Helper.getRandomInt(1,2),Helper.getRandomInt(2,3),Helper.getRandomInt(0,1),this.ctx);
        this.enemies = [];
        this.enemyTimer = 0;
        this.enemySpawnInterval = 50;
        this.loop();
    }

    loop()
    {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    update()
    {
        this.ship.update();
        this.enemy.update();

        if (this.enemyTimer % this.enemySpawnInterval === 0)
        {
            this.enemies.push(new Enemy(
                Helper.getRandomInt(1, 800 - this.enemy.w),
                -50,
                Helper.getRandomInt(1,2),
                Helper.getRandomInt(2,3),
                Helper.getRandomInt(0,1),
                this.ctx
            ));

            this.enemyTimer = 0;
        }

        this.enemyTimer++;

        this.enemies.forEach((enemy, index) => {

            if (enemy.enemyDirection === 0)
            {
                enemy.x -= enemy.dx;
                enemy.y += enemy.dy;
            }
            if (enemy.enemyDirection === 1)
            {
                enemy.x += enemy.dx;
                enemy.y += enemy.dy;
            }

            if (enemy.y > 700)
            {
                Helper.removeIndex(this.enemies, index);
            }

            enemy.update();
        });
    }

    draw()
    {
        ctx.clearRect(0,0,800,700);
        this.ship.draw();
        this.enemy.draw();
        for (let i in this.enemies)
        {
            if (this.enemies.hasOwnProperty(i))
            {
                this.enemies[i].draw();
            }
        }
    }
}

game = new Game(ctx);
game.update();
game.draw();