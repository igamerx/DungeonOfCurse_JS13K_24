import { State } from '@/core/state';
import { drawEngine } from '@/Engine/draw-engine';
import { controls } from '@/core/controls';
import { gameStateMachine } from '@/game-state-machine';
import { menuState } from './menu.state';

class GamerWinState implements State {

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
            context.fillStyle = (Math.floor((adjustedX / tileSize) + (y / tileSize)) % 2 === 0) ? '#10141f' : '#151d28';
            context.fillRect(adjustedX, y, tileSize, tileSize);
        }
    }

    // Restore canvas rotation
    context.restore();const xCenter = drawEngine.context.canvas.width / 2;
    drawEngine.drawText('Congratulations!', 30, xCenter, 50, '#de9e41');
    drawEngine.drawText('You have escaped the cursed dungeon', 16, xCenter, 80, '#c7cfcc');
    drawEngine.drawText('Your courage have led you to victory!', 16, xCenter, 100, '#c7cfcc');
    drawEngine.drawText('Press [Enter] to Return to the Main Menu', 10, xCenter, 150, '#c7cfcc');
    this.updateControls();
  }

  updateControls() {
    if (controls.isConfirm && !controls.previousState.isConfirm) {
        gameStateMachine.setState(menuState);
    }
  }
}

export const gamerWinState = new GamerWinState();
