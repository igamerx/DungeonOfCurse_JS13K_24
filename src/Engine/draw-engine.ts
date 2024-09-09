import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/constans/game-contstans";

class DrawEngine {
  context: CanvasRenderingContext2D;

  constructor() {
    this.context = c2d.getContext('2d');

    this.context.canvas.width = CANVAS_WIDTH;
    this.context.canvas.height = CANVAS_HEIGHT;
    this.context.imageSmoothingEnabled = false;
  }

  get canvasWidth() {
    return this.context.canvas.width;
  }

  get canvasHeight() {
    return this.context.canvas.height;
  }

  drawText(text: string, fontSize: number, x: number, y: number, color = 'white', textAlign: 'center' | 'left' | 'right' = 'center', textBaseline: CanvasTextBaseline = 'middle') {
    const context = c2d.getContext('2d', { alpha: false, desynchronized: false });
    context.imageSmoothingEnabled = false;

    // context.canvas.width = 1280;
    // context.canvas.height = 720;

    context.font = `${fontSize}px Impact, sans-serif-black`;
    context.textAlign = textAlign;
    context.textBaseline = textBaseline; // Ensure proper alignment
    context.strokeStyle = 'black';
    context.lineWidth = 2; // Adjusted lineWidth to prevent excessive pixelation
    context.lineJoin = 'round'; // Smooths out the edges of the text stroke
    context.miterLimit = 2; // Ensures sharpness of text stroke

    // Draw text stroke
    context.strokeText(text, x, y);

    // Draw text fill
    context.fillStyle = color;
    context.fillText(text, x, y);
  }

  getBuffer(): CanvasRenderingContext2D {
    const context = c2d.getContext('2d', { alpha: false, desynchronized: true })
    context.canvas.width = CANVAS_WIDTH;
    context.canvas.height = CANVAS_HEIGHT;
    context.imageSmoothingEnabled = false;
    return context;
  }
}

export const drawEngine = new DrawEngine();
