import { State } from '@/core/state';
import { drawEngine } from '@/Engine/draw-engine';
import { controls } from '@/core/controls';
import { gameStateMachine } from '@/game-state-machine';
import { menuState } from './menu.state';

class GameOverState implements State {

  private patternOffset = 0;
  onUpdate() {
    const context = drawEngine.context;
    const canvasWidth = drawEngine.canvasWidth;
    const canvasHeight = drawEngine.canvasHeight;
    const tileSize = 40;

    // Update the pattern offset to create movement
    this.patternOffset -= 0.05; 
    if (this.patternOffset <= -tileSize) {
        this.patternOffset = 0;
    }

    // Translate the canvas to the center and rotate the entire context
    context.save();
    context.translate(canvasWidth / 2, canvasHeight / 2);
    context.rotate(Math.PI / 4); // Rotate the entire canvas by 45 degrees

    for (let y = -canvasHeight; y < canvasHeight; y += tileSize) {
        for (let x = -canvasWidth; x < canvasWidth; x += tileSize) {
            const adjustedX = x + this.patternOffset;
            
            // Alternating between two colors
            context.fillStyle = (Math.floor((adjustedX / tileSize) + (y / tileSize)) % 2 === 0) ? '#090a14' : '#10141f';
            context.fillRect(adjustedX, y, tileSize, tileSize);
        }
    }

    // Restore canvas rotation
    context.restore();const xCenter = drawEngine.context.canvas.width / 2;
    drawEngine.drawText('Game Over', 40, xCenter, 60, '#a53030');
    drawEngine.drawText('The curse remains unbroken...', 16, xCenter, 100, '#cf573c');
    
    drawEngine.drawText('Tip: "Keep an eye on the timer! Every second counts."', 11, xCenter, 130, '#c7cfcc');

    drawEngine.drawText('Press [Enter] to Return to the Main Menu', 10, xCenter, 150, '#c7cfcc');
    this.updateControls();
  }

  updateControls() {
    if (controls.isConfirm && !controls.previousState.isConfirm) {
        gameStateMachine.setState(menuState);
    }
  }
}

export const gameOverState = new GameOverState();
