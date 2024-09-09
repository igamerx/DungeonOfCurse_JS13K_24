import { CollisionBlock } from "@/classes/CollisionBlock";
import { drawEngine } from "./draw-engine";
import { BASE_TILE_SIZE } from "@/constans/game-contstans";
import { Box } from "@/model/common.model";

export class Engine {

    public static parseTo2DArray(array: Array<number>, mapWidth: number = 20) {
        const rows = [];
        for (let i = 0; i < array.length; i += mapWidth) {
            rows.push(array.slice(i, i + mapWidth));
        }

        return rows;
    }

    public static createArrayFrom2D(array: Array<Array<number>>, symbolKey: any, tileSize: number = BASE_TILE_SIZE) {
        const objects: Array<any> = [];
        array.forEach((row: any, yIndex: any) => {
            row.forEach((symbol: any, xIndex: any) => {
                if (symbol == symbolKey) {
                    let position: DOMPoint = new DOMPoint(0, 0);
                    // Push new collision into new collision block array.
                    position.x = xIndex * tileSize;
                    position.y = yIndex * tileSize;
                    objects.push(
                        new CollisionBlock(position)
                    )
                }
            });
        });

        return objects;
    }

    public static debugBox(gameObject: any, color: string) {
        drawEngine.context.strokeStyle = color;
        drawEngine.context.lineWidth = 1;
        drawEngine.context.beginPath();
        drawEngine.context.rect(gameObject.position.x, gameObject.position.y, gameObject.width, gameObject.height);
        drawEngine.context.stroke();
    }

    public static degreeToRadian(degree: number) {
        return Math.PI / 180 * degree;
    }

    public static lerp(start: number, end: number, speed: number) {
        return start + (end - start) * speed;
    }

    public static clamp(value: number, min: number, max: number) {
        return Math.max(min, Math.min(value, max));
    }


    public static collisions(objectA: Box, objectB: Box) {
        return (objectA.position.x <= objectB.position.x + objectB.width &&
            objectA.position.x + objectA.width >= objectB.position.x &&
            objectA.position.y + objectA.height >= objectB.position.y &&
            objectA.position.y <= objectB.position.y + objectB.height);
    }

    public static normalize(value: number, min: number, max: number) {
        return (value - min) / (max - min);
    }

    public static print(value: any, flag: boolean = true) {
        if (flag) {
            console.log(value);
        }
    }

    public static fadeIn(element: any, duration: number, onComplete?: () => void) {
        let startTime: number | null = null;
    
        function animate(timestamp: number) {
            if (!startTime) startTime = timestamp;
    
            const elapsed = timestamp - startTime;
            const opacity = Math.min(1, elapsed / duration);
    
            element.style.opacity = opacity.toString();
    
            if (opacity < 1) {
                requestAnimationFrame(animate);
            } else {
                if (onComplete) {
                    onComplete();
                }
            }
        }
    
        requestAnimationFrame(animate);
    }
    
    public static fadeOut(element: any, duration: number, onComplete?: () => void) {
        let startTime: number | null = null;
    
        function animate(timestamp: number) {
            if (!startTime) startTime = timestamp;
    
            const elapsed = timestamp - startTime;
            const opacity = 1 - Math.min(1, elapsed / duration);
    
            element.style.opacity = opacity.toString();
    
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                if (onComplete) {
                    onComplete();
                }
            }
        }
    
        requestAnimationFrame(animate);
    }

    private static isTimeoutDone: boolean = false;
    private static startTime: number = 0;

    public static startTimeout() {
        this.startTime = 0;
        this.isTimeoutDone = false;
    }

    public static setTimeout(delta: number, timeoutDuration: number) {
        if (!this.isTimeoutDone) {

            this.startTime += delta;
            if (this.startTime >= timeoutDuration) {
                this.isTimeoutDone = true;
            }
        }
    }

    public static isTimeoutComplete() {
        return this.isTimeoutDone;
    }

    public static resetTimeout() {
        this.startTime = 0;
        this.isTimeoutDone = false;
    }


}

export class Timer {
    private endTime: number = 0;
    private duration: number;
    private onTimerEnd: () => void;
    private currentTime: number = 0;
    private isRunning: boolean;

    constructor(durationInSeconds: number, onTimerEnd: () => void) {
        this.duration = durationInSeconds * 1000; // convert seconds to milliseconds
        this.onTimerEnd = onTimerEnd;
        this.isRunning = false; // Initialize the timer as not running
        this.start();
    }

    private start() {
        const startTime = performance.now();
        this.endTime = startTime + this.duration;
        this.isRunning = true; // Set the timer as running
        this.checkTime();
    }

    private checkTime() {
        if (!this.isRunning) return; // Skip time checking if the timer is stopped

        this.currentTime = performance.now();

        if (this.currentTime >= this.endTime) {
            this.isRunning = false; // Stop the timer
            this.onTimerEnd(); // Call the callback function when the timer ends
        } else {
            requestAnimationFrame(this.checkTime.bind(this));
        }
    }

    public getTimeRemaining(): number {
        if (!this.isRunning) {
            return 0; // Timer hasn't started or has been stopped
        }
        return Math.max(0, this.endTime - performance.now());
    }

    public resetTimer(newDurationInSeconds?: number) {
        if (newDurationInSeconds) {
            this.duration = newDurationInSeconds * 1000;
        }
        this.start();
    }

    public stop() {
        this.isRunning = false; // Stop the timer
    }
}


