canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

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

class Game
{
    constructor(context) {
        this.ctx = context;
        this.ship = new Ship(100, 450, 5, this.ctx);
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
    }

    draw()
    {
        this.ship.draw();
    }
}

game = new Game(ctx);
game.update();
game.draw();