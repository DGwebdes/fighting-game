const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.4;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './imgs/background.png'
});
const shop = new Sprite({
    position: {
        x: 600,
        y: 97
    },
    imageSrc: './imgs/shop.png',
    scale: 3,
    framesMax: 6
});

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './imgs/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './imgs/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './imgs/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './imgs/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './imgs/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './imgs/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './imgs/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './imgs/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    weaponBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 30
    }
});

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './imgs/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './imgs/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './imgs/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './imgs/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './imgs/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './imgs/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './imgs/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './imgs/kenji/Death.png',
            framesMax: 7
        }
    },
    weaponBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 30
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

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();

    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    enemy.update();
    

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player if statement movement
    
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -1.2
        player.switchSprites('run');
    } else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 1.2
        player.switchSprites('run');
    } else {
        player.switchSprites('idle');
    }
    
    //jumping statement
    if (player.velocity.y < 0){
        player.switchSprites('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprites('fall');
    }

    //enemy if statement movement
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -1.2
        enemy.switchSprites('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 1.2
        enemy.switchSprites('run');
    } else {
        enemy.switchSprites('idle');
    }

    //enemy jumping statement
    if (enemy.velocity.y < 0){
        enemy.switchSprites('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprites('fall');
    }

    //detect collision
    //check for player Attacks
    if(rectCollision({
        rect1: player,
        rect2: enemy
    }) && player.isAttacking && player.framesCurrent === 4 ) {
        enemy.takeHit();
        player.isAttacking = false;
        
        gsap.to('#enemyHp', {
            width: enemy.health + '%'
        })
    }

    //if player misses attack 
    if (player.isAttacking && player.framesCurrent === 4) {
        
        player.isAttacking = false;
    }


    //Check for enemy attacks
    if(rectCollision({
        rect1: enemy,
        rect2: player
    }) && enemy.isAttacking  && enemy.framesCurrent === 2) {
        player.takeHit();
        enemy.isAttacking = false;
        
        gsap.to('#playerHp', {
            width: player.health + '%'
        })
    }
    //if enemy misses attack 
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
    
        enemy.isAttacking = false;
    }

    //end game based on health
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})
        setTimeout(() => {
            location.reload()
        }, 2000);
    }
}

decreaseTimer();
animate()

window.addEventListener('keydown', (event) => {
    
    if (!player.dead) {
        //player Controls
        switch (event.key){
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
        }
    }
    if (!enemy.dead){
        //enemy Controls
        switch (event.key){ 
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
