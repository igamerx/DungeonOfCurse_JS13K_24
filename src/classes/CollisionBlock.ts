
import { BASE_TILE_HEIGHT, BASE_TILE_WIDTH, DEBUGGER } from '@/constans/game-contstans';
import { drawEngine } from '@/Engine/draw-engine';

export class CollisionBlock {
    width = BASE_TILE_WIDTH;
    height = BASE_TILE_HEIGHT;
    position: DOMPoint = new DOMPoint();
    constructor(position: DOMPoint) {
        this.position = position;
    }

    public draw() {
        if (DEBUGGER) {
            drawEngine.context.fillStyle = 'rgba(255, 0, 0, 0.4)';
            drawEngine.context.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }

    public update() {
        this.draw();
    }
}