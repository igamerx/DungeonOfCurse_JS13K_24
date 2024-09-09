import { drawEngine } from "./draw-engine";

class ScreenShake {
    private shakeDuration: number;
    private shakeMagnitude: number;
    private shakeTime: number;
    private canvas: HTMLCanvasElement;

    constructor() {
        this.shakeDuration = 0;
        this.shakeMagnitude = 0;
        this.shakeTime = 0;
        this.canvas = drawEngine.context.canvas;
    }

    private startShake(duration: number, magnitude: number) {
        this.shakeDuration = duration;
        this.shakeMagnitude = magnitude;
        this.shakeTime = 0;
    }

    public update(delta: number) {
        const min = .2;
        const max = .3;
        if (this.shakeTime < this.shakeDuration) {
            this.shakeTime += delta;

            // Calculate the remaining shake time ratio
            const progress = this.shakeTime / this.shakeDuration;

            // Reduce the shake magnitude over time for a fade-out effect
            const currentMagnitude = this.shakeMagnitude * (1 - progress);

            // Apply smooth random offsets
            const shakeOffsetX = (Math.floor(min + Math.random()*(max - min + 1))) *  currentMagnitude - currentMagnitude/2;
            const shakeOffsetY = (Math.floor(min + Math.random()*(max - min + 1))) *  currentMagnitude - currentMagnitude/2;

            drawEngine.context.translate(shakeOffsetX, shakeOffsetY);
        } else {
            // Reset canvas position after shaking
            drawEngine.context.setTransform(1, 0, 0, 1, 0, 0);
        }
    }

    public hitShake() {
        this.startShake(50, 3);
    }
}

export const screenShake = new ScreenShake();