import { ENEMY_TYPE, SOUND_FX } from './../constans/game-contstans';
import { Engine } from '../Engine/engine';
import { DEBUGGER, PLAYER_ANIMATION_NAME } from "@/constans/game-contstans";
import { controls } from "@/core/controls";
import { CollisionBlock } from "./CollisionBlock";
import { Animations, Box } from '@/model/common.model';
import { Sprite } from '../Engine/Sprite';
import { PlayerHUD } from './PlayerHUD';
import { ParticleSystem } from '@/Engine/ParticleSystem';
import { HealthUpgrade } from './HealthUpgrade';
import { screenShake } from '@/Engine/ScreenShake';
import { audio } from '@/core/audio';
// import { audioFX } from '@/core/SFX';

export class Player extends Sprite {
    public isAlive: boolean = true;
    public position: DOMPoint = new DOMPoint();
    public velocity: DOMPoint = new DOMPoint();
    public collisionBlocks: Array<CollisionBlock> = [];
    public hitBox: Box = new Box();
    public attackBox: Box = new Box();
    public collidedWith!: string;
    public preventInput: boolean = false;

    public isDoorCollided: boolean = false;
    public hasKey: boolean = false;

    private _isEnemyCollided: boolean = false;
    public set isEnemyCollided(value: boolean) {
        this._isEnemyCollided = value;
    }

    private _maxHealth: number = 5;
    private _health: number = 3;
    get health() {
        if (this._health <= 0) {
            this.isAlive = false;
        }
        this._health = Engine.clamp(this._health, 0, this._maxHealth);
        return this._health;
    }
    set health(value) {
        this._health = Engine.clamp(value, 0, this._maxHealth);
    }

    public healthArray: Array<PlayerHUD> = [];

    public _isDamageTaken: boolean = false;
    get isDamageTaken() {
        return this._isDamageTaken;
    }
    set isDamageTaken(value: boolean) {
        if (value) {
            this._isDamageTaken = value;
        }
    }

    public isInvincible: boolean = false;
    private invincibilityDuration: number = 2000; // 2 seconds
    public lastHitTime: number = 0;
    public isVisible: boolean = false;
    public flashDuration: number = 100;
    public startFlashing: number = 0;


    public playerDirection = 0;
    public acceleration = 0.1;
    public deceleration = 0.05;
    public isAttacking = false;
    public attackPower = 1;

    private defaultSpeed: number = 2;
    private speed: number = this.defaultSpeed;;

    public speedWhenGetHits: number = 0.4;

    public particalSystem!: ParticleSystem;

    public isDashing: boolean = false;
    private dashSpeed: number = 6; // Adjust this value for dash speed
    private dashDuration: number = 200; // Duration in milliseconds
    private dashCooldown: number = 1000; // Cooldown in milliseconds
    private dashTimeElapsed: number = 0;
    private dashCooldownTimeElapsed: number = 0;

    public isGameWin: boolean = false;

    public startTimer: boolean = false;


    constructor(collisionBlocks: Array<CollisionBlock>, position: DOMPoint, src: string, animations: Array<Animations>, frameCount: number, frameBuffer: number, loop = true) {
        super(position, src, animations, frameCount, frameBuffer, loop);
        this.position = position;
        this.velocity = new DOMPoint(0, 0);
        this.collisionBlocks = collisionBlocks;

        this.particalSystem = new ParticleSystem();

    }

    public update(delta: number) {

        this.particalSystem.updateAndDraw(delta);


        if (this.isVisible) {

            this.draw();
        }

        this.playerInvincibleFrames(delta);


        if (DEBUGGER) {
            Engine.debugBox(new Box(this.position, this.width, this.height), 'blue');
        }

        this.playerAndCollisionBlocks();
        this.controls(delta);
        this.playerDied(delta);


        // console.log('Player Health: ', this.health);
    }

    public drawAndUpdate(delta: number) {
        this.draw();
        this.update(delta);
    }

    private updateHitBox() {
        this.hitBox.position.x = this.position.x + 11;
        this.hitBox.position.y = this.position.y + 8;
        this.hitBox.width = 10;
        this.hitBox.height = 16;
    }

    private updateAttackBox() {
        this.attackBox.position.x = this.position.x + ((this.playerDirection < 0) ? 0 : 17); //this.position.x + 25;
        this.attackBox.position.y = this.position.y + 4; //this.position.y + 4;
        this.attackBox.width = 15;
        this.attackBox.height = 24;

    }

    private playerAndCollisionBlocks() {
        // Calculate potential new positions
        const potentialPositionX = this.position.x + this.velocity.x;
        const potentialPositionY = this.position.y + this.velocity.y;

        // Temporarily update position based on velocity
        this.position.x = potentialPositionX;
        this.position.y = this.position.y; // Keep Y position for now

        this.updateHitBox();
        this.updateAttackBox();



        this.checkForHorizontalCollision(
            this.collisionBlocks,
            this.position,
            this.hitBox,
            this.velocity
        );

        this.position.y = potentialPositionY; // Update position for vertical movement
        this.updateHitBox();
        this.updateAttackBox();

        this.checkForVerticalCollision(
            this.collisionBlocks,
            this.position,
            this.hitBox,
            this.velocity);

        if (DEBUGGER) {
            Engine.debugBox(this.hitBox, 'green');
            Engine.debugBox(this.attackBox, '#c65197');
        }
    }

    public checkForVerticalCollision(collisionBlocks: Array<CollisionBlock>, position: DOMPoint, hitBox: Box, velocity: DOMPoint) {
        for (let i = 0; i < collisionBlocks.length; i++) {
            let collisionBlock = collisionBlocks[i];

            if (Engine.collisions(hitBox, collisionBlock)) {
                if (velocity.y < 0) {
                    velocity.y = 0;
                    const offSet = hitBox.position.y - position.y;
                    position.y = collisionBlock.position.y + collisionBlock.height - offSet + 0.01;
                    break;
                }
                if (velocity.y > 0) {
                    velocity.y = 0;
                    const offSet = hitBox.position.y - position.y + hitBox.height;
                    position.y = collisionBlock.position.y - offSet - 0.01;
                    break;
                }
            }
        }
    }

    public checkForHorizontalCollision(collisionBlocks: Array<CollisionBlock>, position: DOMPoint, hitBox: Box, velocity: DOMPoint) {
        for (let i = 0; i < collisionBlocks.length; i++) {
            let collisionBlock = collisionBlocks[i];

            if (Engine.collisions(hitBox, collisionBlock)) {
                if (velocity.x < 0) {
                    velocity.x = 0;
                    const offSet = hitBox.position.x - position.x;
                    position.x = collisionBlock.position.x + collisionBlock.width - offSet + 0.01;
                    break;
                }
                if (velocity.x > 0) {
                    velocity.x = 0;
                    const offSet = hitBox.position.x - position.x + hitBox.width;
                    position.x = collisionBlock.position.x - offSet - 0.01;
                    break;
                }
            }
        }

    }


    private playerDirectionVer = 0;
    private controls(delta: number) {

        if (this.preventInput) return;

        // this.changeColor();
        this.dashMove(delta)

        this.velocity.x = 0;
        this.velocity.y = 0;

        let horizontalMovement = 0;
        let verticalMovement = 0;


        // Check horizontal movement
        if (controls.isLeft) {
            horizontalMovement = -1;
        } else if (controls.isRight) {
            horizontalMovement = 1;
        }

        // Check vertical movement
        if (controls.isUp) {
            verticalMovement = -1;
        } else if (controls.isDown) {
            verticalMovement = 1;
        }
        // if (this.isDashing) {
        //     this.velocity.x = horizontalMovement * this.dashSpeed;
        //     this.velocity.y = verticalMovement * this.dashSpeed;
        // } else {
        //     this.velocity.x = horizontalMovement * this.speed;
        //     this.velocity.y = verticalMovement * this.speed;
        // }

        if (horizontalMovement !== 0 && verticalMovement !== 0) {
            const diagonalSpeed = (this.isDashing ? this.dashSpeed : this.speed) / Math.sqrt(2);// Proper diagonal speed normalization
            this.velocity.x = controls.inputDirection.x * diagonalSpeed;
            this.velocity.y = controls.inputDirection.y * diagonalSpeed;
            // console.log(diagonalSpeed, '----dash')
        } else {
            // this.velocity.x += this.acceleration;
            this.velocity.x = controls.inputDirection.x * (this.isDashing ? this.dashSpeed : this.speed);
            this.velocity.y = controls.inputDirection.y * (this.isDashing ? this.dashSpeed : this.speed);
            // this.switchSprite(PLAYER_ANIMATION_NAME.RUN);
            // console.log(this.speed, '----normal')
        }

        

        if (controls.isAttack) {
            if (!controls.previousState.isAttack) {                
                if(SOUND_FX) audio.playSwordAttackFx();
            }

            this.isAttacking = true;
            this.velocity.x = horizontalMovement * 0.1;
            this.velocity.y = 0;
            this.switchSprite(PLAYER_ANIMATION_NAME.ATTACK, this.playerDirection < 0);
        } else if (controls.isLeft && !controls.previousState.isRight) {
            this.isAttacking = false;
            this.playerDirection = -1;
            this.switchSprite(PLAYER_ANIMATION_NAME.RUN, true);
        } else if (controls.isRight && !controls.previousState.isLeft) {
            this.isAttacking = false;
            this.playerDirection = 1;
            this.switchSprite(PLAYER_ANIMATION_NAME.RUN);
        } else if (controls.isUp && !controls.previousState.isDown) {
            this.isAttacking = false;
            this.playerDirectionVer = -1;
            if (this.playerDirection < 0) {
                this.switchSprite(PLAYER_ANIMATION_NAME.RUN, true);
            } else if (this.playerDirection > 0) {
                this.switchSprite(PLAYER_ANIMATION_NAME.RUN);
            }
        } else if (controls.isDown && !controls.previousState.isUp) {
            this.isAttacking = false;
            this.playerDirectionVer = 1;
            if (this.playerDirection < 0) {
                this.switchSprite(PLAYER_ANIMATION_NAME.RUN, true);
            } else if (this.playerDirection > 0) {
                this.switchSprite(PLAYER_ANIMATION_NAME.RUN);
            }
        } else {
            this.isAttacking = false;
            this.switchSprite(PLAYER_ANIMATION_NAME.IDLE, this.playerDirection < 0);
        }

        // Normalize diagonal movement speed
        // if (horizontalMovement !== 0 && verticalMovement !== 0) {
        //     const diagonalSpeed = (this.isDashing ? this.dashSpeed : this.speed) / Math.sqrt(2);
        //     this.velocity.x = horizontalMovement * diagonalSpeed;
        //     this.velocity.y = verticalMovement * diagonalSpeed;

        // }

        

    }

    public takeDamage(amount: number) {
        if (!this.isInvincible) {
            if (this.isAlive) {
                screenShake.hitShake();
                if (SOUND_FX) audio.playPlayerGetHitFx();
            }

            this.health -= amount;
            this.isInvincible = true;
            this.lastHitTime = 0; // Reset last hit time
        }
    }

    public transitionToNextLevel(isFreeze: boolean) {
        if (isFreeze) {
            this.preventInput = true;
            this.switchSprite(PLAYER_ANIMATION_NAME.RUN);
        } else {
            this.preventInput = false;
        }
    }

    private isPlayingPlayerDie = false;
    public playerDied(delta?: number) {
        if (!this.isAlive) {

            this.velocity.x = 0;
            this.velocity.y = 0;
            this.isInvincible = false;
            this.preventInput = true;

            if (!this.isPlayingPlayerDie) {
                if (SOUND_FX) audio.playPlayerDieFx();
                this.isPlayingPlayerDie = true;
            }

            this.switchSprite(PLAYER_ANIMATION_NAME.DIE);
        }
    }

    private playerInvincibleFrames(delta: number) {
        if (this.isInvincible && this.isAlive) {

            this.lastHitTime += delta;
            this.startFlashing += delta;
            if (this.lastHitTime >= this.invincibilityDuration) {
                this.isInvincible = false;
            } else if (this.startFlashing >= this.flashDuration) {
                this.isVisible = !this.isVisible;
                this.startFlashing = 0;
            }
        } else {
            this.isVisible = true; // Ensure the player is visible when not invincible
        }
    }

    public attackEnemy(enemy: any, index: number, enemiesArray: Array<any>) {
        let attackedEnemy: any = {};
        if (this.collidedWith === enemy.name && this.isAttacking && enemy.isEnemyAttackedByPlayer) {
            attackedEnemy = enemy;
            if (attackedEnemy.health > 0) {
                attackedEnemy.health -= this.attackPower;

                attackedEnemy.position.x += 2 * this.playerDirection; // To knock back enemy while hitting.

                let attackParticalPosition: DOMPoint = new DOMPoint();
                attackParticalPosition.x = this.attackBox.position.x + (this.playerDirection > 0 ? 11 : -1);
                attackParticalPosition.y = this.attackBox.position.y + 8;
                this.particalSystem.burst(attackParticalPosition, 4, '#e7d5b3');

                return {};
            }
            if (attackedEnemy.health <= 0) {
                const id = enemiesArray.findIndex(obj => obj.name === this.collidedWith);
                this.collidedWith = '';
                enemiesArray.splice(id, 1);
                this.isEnemyCollided = false;
                this.particalSystem.resetBurst();

                if (enemy.enemyType === ENEMY_TYPE.BAT) {
                    if (SOUND_FX) audio.playBatEnemyHitFx();
                } else if (enemy.enemyType === ENEMY_TYPE.SKULL) {
                    if (SOUND_FX) audio.playSkullEnemyHitFx();
                }
            }

        }
        return attackedEnemy;

    }

    public getHealthUpgrade(healthUpgrade: HealthUpgrade, healthArray: Array<HealthUpgrade>) {
        if (this.collidedWith === healthUpgrade.name && healthUpgrade.isCollidedWithPlayer) {
            const id = healthArray.findIndex(obj => obj.name === this.collidedWith);
            healthArray.splice(id, 1);
            this.collidedWith = '';

            this.particalSystem.burst(healthUpgrade.position, 50, '#090a14');

        }
        this.particalSystem.resetBurst();

        // this.upgradeHealth();
    }

    public isDashAvailable: boolean = false;
    private dashMove(delta: number) {
        this.isDashAvailable = this.dashCooldownTimeElapsed >= this.dashCooldown;
        if (controls.isDash && !this.isDashing && this.dashCooldownTimeElapsed >= this.dashCooldown) {
            if (SOUND_FX) audio.playDashFx();

            let dashBurstPosition = new DOMPoint();
            dashBurstPosition.x = this.position.x + 16;
            dashBurstPosition.y = this.position.y + 16;
            this.isDashing = true;
            this.dashTimeElapsed = 0;
            this.dashCooldownTimeElapsed = 0;
            // screenShake.startShake(20, 1);
            this.particalSystem.burst(dashBurstPosition, 7, '#c7cfcc');
        }

        if (this.isDashing) {
            this.dashTimeElapsed += delta;
            if (this.dashTimeElapsed >= this.dashDuration) {
                this.particalSystem.resetBurst();
                this.isDashing = false;
            }
        } else {
            this.dashCooldownTimeElapsed += delta;
        }
    }

    private switchSprite(name: string, isFlip?: boolean) {
        if (this.animations) {
            for (let i = 0; i < this.animations.length; i++) {
                if (this.animations[i].animationName === name) {
                    if (this.image === this.animations[i].props.image) return;

                    this.currentframe = 0;
                    this.image = this.animations[i].props.image;
                    this.frameCount = this.animations[i].props.frameCount;
                    this.frameBuffer = this.animations[i].props.frameBuffer;
                    this.loop = this.animations[i].props.loop;
                    this.isHozFlip = isFlip;
                    this.isVertFlip = false;
                    this.currentAnimation = this.animations[i];
                }
            }
        }
    }

}

