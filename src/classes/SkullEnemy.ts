import { Engine } from '../Engine/engine';
import { Animations } from "@/model/common.model";
import { Enemy } from "./Enemy";
import { Player } from "./Player";
import { DEBUGGER, ENEMY_ANIMATION_NAME, ENEMY_TYPE } from '@/constans/game-contstans';

export class SkullEnemy extends Enemy {


    constructor(position: DOMPoint, src: string, player: Player, animations: Array<Animations>, loop?: boolean) {
        super(position, src, player, animations, loop);
        this.name = 'enemy_skull';
        this.enemyType = ENEMY_TYPE.SKULL;


        this.moveSpeed = 1;
        this.damage = 1;
        this.health = 1;
    }

    public updateAndDraw(delta: number) {
        this.draw();
        this.update(delta);
        this.drawSkullEnemyAreaBox();
        this.followPlayer();

        this.enemyCollidePlayer();
    }

    public drawSkullEnemyAreaBox() {
        this.enemyAreaBox.position.x = this.position.x - 44;
        this.enemyAreaBox.position.y = this.position.y - 40;
        this.enemyAreaBox.width = this.width + 90;
        this.enemyAreaBox.height = this.height + 80;

        if (DEBUGGER) {
            Engine.debugBox(this.enemyAreaBox, 'orange');
        }
    }

    public followPlayer() {
        const isCollided = Engine.collisions(this.player.hitBox, this.enemyAreaBox);

        const dx = this.player.position.x - this.position.x;
        const dy = this.player.position.y - this.position.y;

        if (isCollided) {
            const distance = Math.sqrt(dx * dx + dy * dy);
            const dirX = dx / distance;
            const dirY = dy / distance;

            this.velocity.x = dirX * this.moveSpeed;
            this.velocity.y = dirY * this.moveSpeed;


            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            // Flip based on direction
            const shouldFlip = this.velocity.x >= 0 && this.player.velocity.x < 0;
            this.playAnimation(ENEMY_ANIMATION_NAME.RUN, shouldFlip);
            // console.log(this.name + ' move', shouldFlip ? 'left' : 'right');
        } else {
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.playAnimation(ENEMY_ANIMATION_NAME.DIE, this.velocity.x <= 0 && this.player.velocity.x > 0, false);  // Switch to idle if not moving
        }

    }



}