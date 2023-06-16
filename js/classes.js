class Sprite
{
    //by passing the arguments as objects, they are not required and order doesn't matter.
    //if you pass it as argument, order is important and they are required.
    constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x:0, y:0}}){
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.offset = offset;

    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,

            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax)* this.scale,
            this.image.height * this.scale
        )
    }

    animateFrames(){
        this.framesElapsed++;
        
        if (this.framesElapsed % this.framesHold === 0){
            if(this.framesCurrent < this.framesMax - 1){
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
        }
    }

    update(){
        this.draw();
        this.animateFrames();
    }
}
class Fighter extends Sprite{

    constructor(
        {position,
            velocity,
            imageSrc,
            color = "red",
            scale = 1,
            framesMax = 1,
            offset = {x:0, y:0},
            sprites,
            weaponBox = { offset: {}, width: undefined, height: undefined }
        }){
        
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.weaponBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: weaponBox.offset,
            width: weaponBox.width,
            height: weaponBox.height

        }
        this.color = color;
        this.isAttacking;
        this.health = 100;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.sprites = sprites;
        this.dead = false;

        for (let sprite in sprites){
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }


    update(){
        this.draw();
        if (!this.dead) this.animateFrames();

        //attack box statements
        this.weaponBox.position.x = this.position.x + this.weaponBox.offset.x;
        this.weaponBox.position.y = this.position.y + this.weaponBox.offset.y;

        //draws attackbox
        // c.fillStyle = 'red';
        
        // c.fillRect(this.weaponBox.position.x, this.weaponBox.position.y, this.weaponBox.width, this.weaponBox.height)
        
         //players positions
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        //gravity function
        if (this.velocity.y + this.height + this.position.y >= canvas.height - 95){
            this.velocity.y = 0;
            this.position.y = 331;
        } else {
            this.velocity.y += gravity;

        }
    }

    attack(){
        this.switchSprites('attack1')
        this.isAttacking = true;
    }

    takeHit(){
        this.health -= 10;

        if ( this.health <= 0) {
            this.switchSprites('death')
        } else {
            this.switchSprites('takeHit')
        }
    }



    switchSprites(sprite){
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax -1) this.dead = true
            return}

        //overriding all other animations with attack animation
        if (this.image === this.sprites.attack1.image &&
            this.framesCurrent < this.sprites.attack1.framesMax -1) return

        //overides animations when hit taken
        if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax -1) return

        switch (sprite){
            case 'idle': 
                if (this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0;
                }
            break;
            case 'run':
                if (this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent = 0;
                }
            break;
            case 'jump':
                if (this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                }
            break;
            case 'fall':
                if (this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                }
            break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.framesCurrent = 0;
                }
            break;
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image){
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.framesCurrent = 0;
                }
            break;
            case 'death':
                if (this.image !== this.sprites.death.image){
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.framesCurrent = 0;
                }
            break;
        }
    }
}