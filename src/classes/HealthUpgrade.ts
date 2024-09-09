import { DEBUGGER, SOUND_FX } from "@/constans/game-contstans";
import { Engine } from "@/Engine/engine";
import { GameObject } from "./GameObject";
import { Player } from "./Player";
import { PlayerHUD } from "./PlayerHUD";
import { ParticleSystem } from "@/Engine/ParticleSystem";
import { audio } from "@/core/audio";

export class HealthUpgrade extends GameObject {
    public position: DOMPoint = new DOMPoint();
    private addHealth: number = 1;
    public isCollidedWithPlayer: boolean = false;
    
    private playerHUD!: PlayerHUD;
    public particalSystem!: ParticleSystem;

    constructor(position: DOMPoint, player: Player) {
        super(position, '', player);
        this.position = position;
        this.player = player;

        this.particalSystem = new ParticleSystem();
    }

    public update(delta: number) {
        this.particalSystem.updateAndDraw(delta);

        this.healthHitbox();
        this.draw();
        this.isCollidedWithPlayer = this.checkCollision(this.player.hitBox);

    }
    
    public draw() {
        this.playerHUD = new PlayerHUD(this.position, true);
        this.playerHUD.healthImgDraw();
    }

    private upgradeHealth() {
        this.player.health += this.addHealth;
    }

    public getHealthUpgrade(healthUpgrade: HealthUpgrade, healthArray: Array<HealthUpgrade>) {
        let selectHeart!: HealthUpgrade;
        if (this.player.collidedWith === healthUpgrade.name && healthUpgrade.isCollidedWithPlayer) {
            selectHeart = healthUpgrade;
            const id = healthArray.findIndex(obj => obj.name === this.player.collidedWith);
            healthArray.splice(id, 1);
            this.player.collidedWith = '';
            this.upgradeHealth();
            
            if(SOUND_FX) audio.playHealthPickupFx();
        }
        return selectHeart;
    }

    private healthHitbox() {
        this.hitBox.position.x = this.position.x + 1.5;
        this.hitBox.position.y = this.position.y;
        this.hitBox.width = 12;
        this.hitBox.height = 12;
        if (DEBUGGER) {
            Engine.debugBox(this.hitBox, 'red');
        }
    }
}