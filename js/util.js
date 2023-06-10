function rectCollision({rect1, rect2}){
    return(
        rect1.weaponBox.position.x + rect1.weaponBox.width >= rect2.position.x
        && rect1.weaponBox.position.x <= rect2.position.x + rect2.width &&
        rect1.weaponBox.position.y + rect1.weaponBox.height >= rect2.position.y &&
        rect1.weaponBox.position.y <= rect2.position.y + rect2.height
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