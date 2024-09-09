import { DEBUGGER } from "@/constans/game-contstans";
import { Engine } from "@/Engine/engine";
import { GameObject } from "./GameObject";
import { images } from "./Images";
import { Player } from "./Player";
import { audio } from "@/core/audio";

export class Key extends GameObject {
    public isCollidedWithPlayer: boolean = false;
    constructor(position: DOMPoint, player: Player) {
        super(position, '', player);
        this.position = position;
        this.name = 'key'
    }

    public update(delta: number): void {
        this.draw();
        this.keyHitbox();
        this.isCollidedWithPlayer = this.checkCollision(this.player.hitBox);
    }

    public draw(): void {
        images.getKeySprite(this.position);
    }

    public getKey(key: Key, keyArray: Array<Key>) {
        let selectKey!: Key;
        if (this.player.collidedWith === key.name && key.isCollidedWithPlayer) {
            selectKey = key;
            const id = keyArray.findIndex(obj => obj.name === this.player.collidedWith);
            keyArray.splice(id, 1);
            this.player.collidedWith = '';
            this.player.hasKey = true;
            audio.playKeyPickupFx();
        }
        return selectKey;
    }

    private keyHitbox() {
        this.hitBox.position.x = this.position.x;
        this.hitBox.position.y = this.position.y - 4;
        this.hitBox.width = 16;
        this.hitBox.height = 16;
        if (DEBUGGER) {
            Engine.debugBox(this.hitBox, 'green');
        }
    }
}