import { Animations, Box } from "@/model/common.model";
import { GameObject } from "./GameObject";
import { Player } from "./Player";
import { DEBUGGER, SOUND_FX } from "@/constans/game-contstans";
import { Engine } from "@/Engine/engine";
import { drawEngine } from "@/Engine/draw-engine";
import { ParticleSystem } from "@/Engine/ParticleSystem";
import { audio } from "@/core/audio";

export class Enemy extends GameObject {
    public static isEmenyCollided = false;

    public isAlive: boolean = false;

    public startPositionX!: number;
    public startPositionY!: number;
    public moveSpeed!: number;

    public enemyAreaBox: Box = new Box();
    public isEnemyAttackedByPlayer: boolean = false;
    public damage: number = 1;
    public health: number = 1;
    public enemyType: string = '';

    public particalSystem!: any;

    private _direction: number = 0;
    get direction() {
        return this._direction > 0 ? 1 : -1;
    }
    set direction(value) {
        this._direction = value;
    }


    constructor(position: DOMPoint, src: string, player: Player, animations: Array<Animations>, loop?: boolean,  frameCount?: number, frameBuffer?: number) {
        super(position, src, player, animations, loop, frameCount, frameBuffer);
        this.particalSystem = new ParticleSystem();

    }

    public update(delta: number): void {

        this.enemyHitbox();

        this.playerAttackedEnemy();
        this.particalSystem.updateAndDraw(delta);

    }

    public enemyHitbox() {
        this.hitBox.position.x = this.position.x + 10;
        this.hitBox.position.y = this.position.y + 10;
        this.hitBox.width = 12;
        this.hitBox.height = 14;
        if (DEBUGGER) {
            // Hit Box
            Engine.debugBox(this.hitBox, 'red');
        }
    }

    // public drawEnemyAreaBox() {
    //     this.enemyAreaBox.position.x = this.position.x - 40;
    //     this.enemyAreaBox.position.y = this.position.y - 40;
    //     this.enemyAreaBox.width = this.width + 80;
    //     this.enemyAreaBox.height = this.height + 80;

    //     if (DEBUGGER) {
    //         Engine.debugBox(this.enemyAreaBox, 'orange');
    //     }
    // }

    public playerAttackedEnemy() {
        this.isEnemyAttackedByPlayer = this.checkCollision(this.player.attackBox);
    }

    public enemyCollidePlayer() {
        const isCollided = this.checkCollision(this.player.hitBox);

        if (isCollided) {
            this.player.isEnemyCollided = true;
            if (this.velocity.x < 0) {
                this.direction = -1;
                this.position.x = this.player.position.x + this.player.hitBox.width + 0.01;
            }
            if (this.velocity.x > 0) {
                this.direction = 1;
                const offSet = this.hitBox.position.x - this.position.x;
                this.position.x = this.player.position.x - offSet - 0.01;
            }
            

            if (isCollided && !this.player.isInvincible) {
                this.player.takeDamage(this.damage);
            }

        } else {
            this.player.isEnemyCollided = false;
        }
        return isCollided;
    }


}