import { drawEngine } from "./draw-engine";
import { Engine } from "./engine";

export class ParticleSystem {
    particles: Particle[];
    context: CanvasRenderingContext2D;
    private particlePoolSize: number;

    private delta: number = 0;

    constructor(particlePoolSize: number = 200) {
        this.particles = [];
        this.context = drawEngine.context;
        this.particlePoolSize = particlePoolSize;
    }

    private createParticle(x: number, y: number, velocityX: number, velocityY: number, size: number, lifeSpan: number, color: string) {
        if (this.particles.length >= this.particlePoolSize) {
            this.particles.shift(); // Remove the oldest particle if the pool is full
        }
        this.particles.push(new Particle(new DOMPoint(x, y), new DOMPoint(velocityX, velocityY), size, lifeSpan, color));
    }

    emit(particlePosition: DOMPoint, particleCount: number, color: string, direction: number = 0) {
        let xMin = -1;
        let xMax = 1;
        if (direction === -1) {
            xMax = 0;
        } else if (direction === 1) {
            xMin = 0;
        } else if (direction === 0) {
            xMin = -1;
            xMax = 1;
        }
        for (let i = 0; i < particleCount; i++) {
            const velocityX = Engine.clamp((Math.random() - 0.5) * 2, xMin, xMax);
            const velocityY = Engine.clamp((Math.random() - 0.5) * 2, -1, 1);
            const size = Engine.clamp(Math.random() * 2 + 1, 0, 2);
            const lifeSpan = Math.random() * 500 + 0;
            this.createParticle(particlePosition.x, particlePosition.y, velocityX, velocityY, size, lifeSpan, color);
        }
    }

    public isBurst = false;
    private startTime: number = 0;

    burst(particlePosition: DOMPoint, particleCount: number,  color: string, direction: number = 0) {
        if (!this.isBurst) {

            this.startTime += this.delta;
            // if (this.startTime >= 100) {
                this.isBurst = true;
                this.emit(particlePosition, particleCount, color, direction);
            // }
        }

    }

    resetBurst() {
        this.isBurst = false;
        this.startTime = 0;
    }

    updateAndDraw(delta: number) {
        // this.context.clearRect(0, 0, drawEngine.canvasWidth, drawEngine.canvasHeight);
        this.delta = delta;
        this.particles = this.particles.filter(p => p.isAlive());
        this.particles.forEach(p => {
            p.update(delta);
            p.draw(this.context);
        });

        // this.context.globalAlpha = 1.0; // Reset alpha

        // if (this.isBurst && this.particles.length === 0) {
        //     this.isBurst = false;
        //     this.startTime = 0;
        // }
    }
}

class Particle {
    position: DOMPoint;
    velocity: DOMPoint;
    size: number;
    lifeSpan: number;
    age: number;
    color: string;

    constructor(position: DOMPoint, velocity: DOMPoint, size: number, lifeSpan: number, color: string) {
        this.position = position;
        this.velocity = velocity;
        this.size = size;
        this.lifeSpan = lifeSpan;
        this.age = 0;
        this.color = color;
    }

    update(delta: number) {
        this.position.x += this.velocity.x * delta * 0.03;
        this.position.y += this.velocity.y * delta * 0.05;
        this.age += delta;
    }

    draw(context: CanvasRenderingContext2D) {
        // context.globalAlpha = Engine.clamp(1 - this.age / this.lifeSpan, 0, 1);
        context.fillStyle = this.color; // '#c7cfcc';
        context.beginPath();
        context.fillRect(this.position.x, this.position.y, this.size, this.size)
        // context.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
        context.fill();
    }

    isAlive() {
        return this.age < this.lifeSpan;
    }
}