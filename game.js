canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

document.addEventListener("mousemove", move);
document.addEventListener("click", function () {
    Helper.playSound(game.bulletSound)
    game.bulletSound.play().then(() => {}).catch(() => {})
    game.bullets.push(new Bullet(
        game.ship.x + game.ship.w / 2 - 2,
        game.ship.y,
        10,
        ctx
    ));
})


function move(event) {
    game.ship.x = event.offsetX - game.ship.w / 2;
    game.ship.y = event.offsetY - game.ship.h / 2;
}


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

    static playSound(sound)
    {
        sound.pause();
        sound.currentTime = 0;
        sound.play().then(() => {}).catch(() => {})
    }
}

class Ship
{
    constructor(x, y, dx, context) {
        this.x = x;
        this.y = y;
        this.w = 88;
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

class Bullet
{
    constructor(x, y, dy, context) {
        this.x = x;
        this.y = y;
        this.dy = dy;
        this.ctx = context;
        this.w = 3;
        this.h = 12;
    }

    update()
    {
        this.y -= this.dy;
    }

    draw()
    {
        this.ctx.fillStyle = "rgb(255,255,0)";
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

class Game
{
    constructor(context) {
        this.ctx = context;
        this.ship = new Ship(Helper.getRandomInt(100,700), 550, 12, this.ctx);
        this.bullet = new Bullet(2000, this.ship.y, 10, this.ctx);
        this.enemy = new Enemy(2000, 0, Helper.getRandomInt(1,2),Helper.getRandomInt(2,3),Helper.getRandomInt(0,1),this.ctx);
        this.enemies = [];
        this.enemyTimer = 0;
        this.bulletSound = new Audio();
        this.bulletSound.src = 'sound/shot.mp3';
        this.exploseSound = new Audio();
        this.exploseSound.src = 'sound/explosion.wav';
        this.bullets = [];
        this.enemySpawnInterval = 30;
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
        this.bullet.update();
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
            for (let i in this.bullets)
            {
                const enemyCenterX = enemy.x + enemy.w;
                const enemyCenterY = enemy.y + enemy.h;
                if (
                    enemyCenterX >= this.bullets[i].x &&
                    enemy.x <= this.bullets[i].x + this.bullets[i].w &&
                    enemyCenterY >= this.bullets[i].y &&
                    enemyCenterY <= this.bullets[i].y + this.bullets[i].h
                ){
                    Helper.removeIndex(this.enemies, index);
                    this.bullets[i].y = 800;
                    this.bullets[i].x = 900;
                }
            }

            const enemyCenterX = enemy.x + enemy.w;
            const enemyCenterY = enemy.y + enemy.h;
            if (
                enemyCenterX >= this.ship.x &&
                enemy.x <= this.ship.x + this.ship.w &&
                enemyCenterY >= this.ship.y + 10 &&
                enemyCenterY <= this.ship.y + this.ship.h
            ){
                Helper.playSound(this.exploseSound);
                Helper.removeIndex(this.enemies, index);
                throw new Error("GAME OVER!");
            }

            enemy.update();
        });


        this.bullets.forEach((bullet, index) => {
            if (bullet.y < 0)
            {
                Helper.removeIndex(this.bullets, index);
            }
            bullet.update();
        });
    }

    draw()
    {
        ctx.clearRect(0,0,800,700);
        this.ship.draw();
        this.enemy.draw();
        this.bullet.draw();

        for (let i in this.enemies)
        {
            if (this.enemies.hasOwnProperty(i))
            {
                this.enemies[i].draw();
            }
        }
        for (let b in this.bullets)
        {
            if (this.bullets.hasOwnProperty(b))
            {
                this.bullets[b].draw();
            }
        }
    }
}

game = new Game(ctx);
game.update();
game.draw();