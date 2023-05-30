const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.4;

class Sprite{
    //by passing the arguments as objects, they are not required and order doesn't matter.
    //if you pass it as argument, order is important and they are required.
    constructor({position, velocity, color = 'darkred', offset}){
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 80,
            height: 50
        }
        this.color = color;
        this.isAttacking;
        this.health = 100;
    }

    draw() {
        //draws the players
        c.fillStyle = this.color;
        c.fillRect (this.position.x, this.position.y, this.width, this.height);

        //draws the attacks
        if (this.isAttacking){
            c.fillStyle = 'green'
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }
    }

    update(){
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.x += this.velocity.x;

        this.position.y += this.velocity.y;

        if (this.velocity.y + this.height + this.position.y >= canvas.height){
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;

        }
    }

    attack(){
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }
}

const player = new Sprite({
    position: {
        x: 0,
        y: 5
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    }
});

const enemy = new Sprite({
    position: {
        x: 200,
        y: 40
    },
    velocity: {
        x: 0,
        y: 0
    },
    color:'blue',
    offset: {
        x: -30,
        y: 0
    }
});

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    s: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
}

function rectCollision({rect1, rect2}){
    return(
        rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x
        && rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
        rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
        rect1.attackBox.position.y <= rect2.position.y + rect2.height
    )
}

function determineWinner({player, enemy, timerId}){
    clearTimeout(timerId)
    document.querySelector('.textOnScreen').style.display = 'flex'
    if (player.health === enemy.health){
        document.querySelector('.textOnScreen').innerHTML = 'Tie!!'
    } else if (player.health > enemy.health){
        document.querySelector('.textOnScreen').innerHTML = 'Player 1 Wins!'
    } else if (player.health < enemy.health){
        document.querySelector('.textOnScreen').innerHTML = 'Player 2 Wins!'
    }
}

let timer = 30;
let timerId;
function decreaseTimer(){
    if (timer > 0 ) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--; 
        document.querySelector('.timer').innerHTML = timer;
    }

    if (timer === 0) determineWinner({player, enemy, timerId})
    }

decreaseTimer();

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player if statement movement
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -1.2
    } else if (keys.d.pressed && player.lastKey === 'd')
        player.velocity.x = 1.2

    //enemy if statement movement
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -1.2
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 1.2
        
    }

    //detect collision
    if(rectCollision({
        rect1: player,
        rect2: enemy
    }) && player.isAttacking){
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector('#enemyHp').style.width = enemy.health + '%';
    }

    if(rectCollision({
        rect1: enemy,
        rect2: player
    }) && enemy.isAttacking){
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector('#playerHp').style.width = player.health + '%';
    }

    //end game based on health
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})
        setTimeout(() => {
            location.reload()
        }, 2000);
    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key){
        //player Controls
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
        break;
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
        break;
        case 'w':
            player.velocity.y = -10
        break;
        case ' ':
            player.attack()
        break;

        //enemy Controls
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
        break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
        break;
        case 'ArrowUp':
            enemy.velocity.y = -10
        break;
        case 'End':
            enemy.attack()
        break;
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key){
        case 'd':
            keys.d.pressed = false
        break
        case 'a':
            keys.a.pressed = false
        break;
        case 's':
            keys.s.pressed = false
        break;


        case 'ArrowRight':
            keys.ArrowRight.pressed = false
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
        break;
    }
    
})
