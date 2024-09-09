import { Engine } from '@/Engine/engine';
import { Animations, Box } from "@/model/common.model";
import { CollisionBlock } from "./CollisionBlock";
import { Sprite } from "../Engine/Sprite";
import { Player } from "./Player";

export class GameObject extends Sprite {
    private _name: string;
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }

    public position: DOMPoint;
    public velocity: DOMPoint;
    public gravity: number | undefined;
    public speed: number | undefined;
    public collisionBlocks: Array<CollisionBlock> | undefined = [];
    public hitBox: Box = new Box();
    public player: Player;

    constructor(position: DOMPoint, src: string, player: Player, animations?: Array<Animations>, loop?: boolean | undefined, frameCount?: number, frameBuffer?: number, velecity: DOMPoint = new DOMPoint(), speed?: number, collisionBlocks?: Array<CollisionBlock>) {
        super(position, src, animations, frameCount, frameBuffer, loop);
        this._name = '';
        this.position = position;
        this.velocity = velecity;
        this.speed = speed;
        this.collisionBlocks = collisionBlocks;
        this.player = player;
        // this.hitBox = hitBox;
    }

    checkCollision(hitBoxToCheck: Box): boolean {
        if (Engine.collisions(hitBoxToCheck, this.hitBox)) {
            // console.log('collided');
            this.player.collidedWith = this.name;
            return true;
        } else return false;
    }

    public playAnimation(name: string, isHozFlip?: boolean, isVertFlip?: boolean) {
        if (this.animations && this.animations.length > 0) {
            for (let i = 0; i < this.animations.length; i++) {
                if (this.animations[i].animationName === name) {
                    if (this.image === this.animations[i].props.image) return;

                    if (this.animations[i].props.frameCount > 4)
                        this.currentframe = Math.floor(Math.random() * 4);
                    else this.currentframe = 0;

                    this.image = this.animations[i].props.image;
                    this.frameCount = this.animations[i].props.frameCount;
                    this.frameBuffer = this.animations[i].props.frameBuffer;
                    this.loop = this.animations[i].props.loop;
                    this.isHozFlip = isHozFlip;
                    this.isVertFlip = isVertFlip;
                    this.currentAnimation = this.animations[i];
                }
            }
        }
    }


}