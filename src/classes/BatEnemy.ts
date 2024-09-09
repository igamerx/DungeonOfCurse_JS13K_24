import { Engine } from '../Engine/engine';
import { Animations } from "@/model/common.model";
import { Enemy } from "./Enemy";
import { Player } from "./Player";
import { DEBUGGER, ENEMY_ANIMATION_NAME, ENEMY_TYPE } from '@/constans/game-contstans';

export class BatEnemy extends Enemy {

    hopPosition: DOMPoint = new DOMPoint();
    canHop: boolean = false;

    constructor(position: DOMPoint, src: string, player: Player, animations: Array<Animations>, loop?: boolean) {
        super(position, src, player, animations, loop, 2, 8);
        this.name = 'bat_skull';
        this.enemyType = ENEMY_TYPE.BAT;


        this.moveSpeed = 0.05;
        this.damage = 1;
        this.health = 15;
        this.canHop = true;
        this.hopPosition.x = Math.random() * Math.PI * 2;
        this.hopPosition.y = this.hopPosition.x;
        // this.hopPosition.y = this.hopPosition.y * 2;
    }

    public updateAndDraw(delta: number) {
        this.draw();
        this.update(delta);
        this.drawBatEnemyAreaBox();
        this.followPlayer(delta);

        this.enemyCollidePlayer();
    }

    public drawBatEnemyAreaBox() {
        this.enemyAreaBox.position.x = this.position.x - 62.5;
        this.enemyAreaBox.position.y = this.position.y - 50;
        this.enemyAreaBox.width = this.width + 125;
        this.enemyAreaBox.height = this.height + 100;

        if (DEBUGGER) {
            Engine.debugBox(this.enemyAreaBox, '#cf573c');
        }
    }

    public followPlayer(delta?: number) {
        const isCollided = Engine.collisions(this.player.hitBox, this.enemyAreaBox);

        const dx = this.player.position.x - this.position.x;
        const dy = this.player.position.y - this.position.y;

        if (isCollided && delta) {
            const distance = Math.sqrt(dx * dx + dy * dy);
            const dirX = dx / distance;
            const dirY = dy / distance;

            this.velocity.x = dirX;
            this.velocity.y = dirY;


            this.position.x += Engine.clamp(this.velocity.x * delta * this.moveSpeed, -1, 1);
            this.position.y += Engine.clamp(this.velocity.y * delta * this.moveSpeed, -1, 1);

            // Flip based on direction
            const shouldFlip = this.velocity.x >= 0 && this.player.velocity.x < 0;
            this.playAnimation(ENEMY_ANIMATION_NAME.FLY, shouldFlip, false);
            // console.log(this.name + ' move', shouldFlip ? 'left' : 'right');
        } else {
            this.velocity.x = 0;
            this.velocity.y = 0;

            if (this.canHop) {
                this.hopPosition.x += 0.2;
                this.hopPosition.y += 0.2;
    
                this.position.x = this.position.x + Math.cos(this.hopPosition.x) * 0.0;
                this.position.y = this.position.y + Math.sin(this.hopPosition.y) * 0.5;
            }



            this.playAnimation(ENEMY_ANIMATION_NAME.FLY, this.velocity.x <= 0 && this.player.velocity.x > 0, false);  // Switch to idle if not moving
        }

    }



}