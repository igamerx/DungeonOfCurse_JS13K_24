import { DEBUGGER, DOOR_ANIMATION_NAME, DOOR_ORIENTATION, DOOR_STATUS } from "@/constans/game-contstans";
import { GameObject } from "./GameObject";
import { Player } from "./Player";
import { Animations } from "@/model/common.model";
import { Engine } from "@/Engine/engine";

export class Door extends GameObject {
    public position: DOMPoint;
    public isDoorCollided = false;
    public isFrontDoorUp: boolean = false;
    public isFrontDoorDown: boolean = false;
    public isSideDoorLeft: boolean = false;
    public isSideDoorRight: boolean = false;

    public isDoorVertFlip: boolean = false;
    public isDoorHozFlip: boolean = false;

    public isDoorOpen: boolean = false;

    public openDoorAnimationName!: string;
    public closeDoorAnimationName!: string;

    public doorStatus: string;
    public isLocked: boolean = false;
    public isBlocked: boolean = false;

    constructor(position: DOMPoint, src: string, player: Player, animations: Array<Animations>, orientation: string, doorStatus: string = DOOR_STATUS.CLOSE, needKey?:boolean, blocked?: boolean) {
        super(position, src, player, animations, false, 1, 1)
        this.position = position;
        this.doorStatus = doorStatus;
        this.setDoorOrientation(orientation);
        this.isLocked = needKey ? needKey : false;
        this.isBlocked = blocked ? blocked : false;
    }

    public update(delta: number) {
        if (this.isFrontDoorUp || this.isFrontDoorDown) {
            this.updateFrontHitBox();
        }
        if (this.isSideDoorLeft || this.isSideDoorRight) {
            this.updateSideHitBox();
        }

        if (!this.isDoorOpen)
            this.doorCollisionWithPlayer();

        this.draw();
        if (DEBUGGER) {
            Engine.debugBox(this.hitBox, !this.isDoorOpen ? '#4f8fba' : '#e8c170');
        }

        this.status(this, this.doorStatus);
    }

    private updateFrontHitBox() {
        this.hitBox.position.x = this.position.x;
        this.hitBox.position.y = this.isFrontDoorDown ? this.position.y : this.position.y + 4;
        this.hitBox.width = 32;
        this.hitBox.height = 5;
    }

    private updateSideHitBox() {
        this.hitBox.position.x = this.isSideDoorLeft ? this.position.x + 12 : this.position.x;
        this.hitBox.position.y = this.position.y;
        this.hitBox.width = 5;
        this.hitBox.height = 32;
    }

    private doorCollisionWithPlayer() {
        const isCollided = this.checkCollision(this.player.hitBox);

        if (isCollided) {
            this.player.isDoorCollided = true;

            if (this.isSideDoorLeft) {

                if (this.player.velocity.x < 0) {
                    this.player.velocity.x = 0;
                    const offSet = this.player.hitBox.position.x - this.player.position.x;
                    this.player.position.x = this.hitBox.position.x + this.hitBox.width - offSet + 0.01;
                }

            }

            if (this.isSideDoorRight) {
                if (this.player.velocity.x > 0) {
                    this.player.velocity.x = 0;
                    const offSet = this.player.hitBox.position.x - this.player.position.x + this.player.hitBox.width;
                    this.player.position.x = this.hitBox.position.x - offSet - 0.01;
                }
            }

            if (this.isFrontDoorUp) {

                if (this.player.velocity.y < 0) {
                    this.player.velocity.y = 0;
                    const offSet = this.player.hitBox.position.y - this.player.position.y;
                    this.player.position.y = this.hitBox.position.y + this.hitBox.height - offSet + 0.01;
                }

            }

            if (this.isFrontDoorDown) {
                if (this.player.velocity.y > 0) {
                    this.player.velocity.y = 0;
                    const offSet = this.player.hitBox.position.y - this.player.position.y + this.player.hitBox.height;
                }
            }

        } else {
            this.player.isDoorCollided = false;
        }
    }

    private status(doorInstance: Door, doorStatus: string) {
        if (doorStatus === DOOR_STATUS.CLOSE) {
            this.isDoorOpen = false;
            doorInstance.playAnimation(this.closeDoorAnimationName, this.isDoorHozFlip, this.isDoorVertFlip);
        } else if (doorStatus === DOOR_STATUS.OPEN) {
            this.isDoorOpen = true;
            doorInstance.playAnimation(this.openDoorAnimationName, this.isDoorHozFlip, this.isDoorVertFlip);
        }
    }

    private setDoorOrientation(orientation: string) {
        switch (orientation) {
            case DOOR_ORIENTATION.UP:
                this.isFrontDoorUp = true;
                this.isDoorVertFlip = false;
                this.openDoorAnimationName = DOOR_ANIMATION_NAME.FRONT_OPEN;
                this.closeDoorAnimationName = DOOR_ANIMATION_NAME.FRONT_CLOSE;
                break;
            case DOOR_ORIENTATION.DOWN:
                this.isFrontDoorDown = true;
                this.isDoorVertFlip = true;
                this.openDoorAnimationName = DOOR_ANIMATION_NAME.FRONT_OPEN;
                this.closeDoorAnimationName = DOOR_ANIMATION_NAME.FRONT_CLOSE;
                break;
            case DOOR_ORIENTATION.LEFT:
                this.isSideDoorLeft = true;
                this.isDoorHozFlip = false;
                this.openDoorAnimationName = DOOR_ANIMATION_NAME.SIDE_OPEN;
                this.closeDoorAnimationName = DOOR_ANIMATION_NAME.SIDE_CLOSE;
                break;
            case DOOR_ORIENTATION.RIGHT:
                this.isSideDoorRight = true;
                this.isDoorHozFlip = true;
                this.openDoorAnimationName = DOOR_ANIMATION_NAME.SIDE_OPEN;
                this.closeDoorAnimationName = DOOR_ANIMATION_NAME.SIDE_CLOSE;
                break;
        }
    }
}