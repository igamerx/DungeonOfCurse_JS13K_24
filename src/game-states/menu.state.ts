import { State } from '@/core/state';
import { drawEngine } from '@/Engine/draw-engine';
import { controls } from '@/core/controls';
import { gameStateMachine } from '@/game-state-machine';
import { gameState } from './game.state';

class MenuState implements State {
  private isStartSelected = true;
  private patternOffset = 0;
  // private isShowStart: boolean = false;
  
  onUpdate() {
    const context = drawEngine.context;
    const canvasWidth = drawEngine.canvasWidth;
    const canvasHeight = drawEngine.canvasHeight;
    const tileSize = 40; // Size of each square in the checkered pattern

    // Update the pattern offset to create movement
    this.patternOffset -= 0.05; // Adjust speed by changing the decrement value
    if (this.patternOffset <= -tileSize) {
        this.patternOffset = 0; // Reset offset to avoid large negative values
    }
    // while (true) {
      
    // }

    // Translate the canvas to the center and rotate the entire context
    context.save();
    context.translate(canvasWidth / 2, canvasHeight / 2);
    context.rotate(Math.PI / 4); // Rotate the entire canvas by 45 degrees

    // Draw kite-shaped checkered background with movement
    for (let y = -canvasHeight; y < canvasHeight; y += tileSize) {
        for (let x = -canvasWidth; x < canvasWidth; x += tileSize) {
            // Calculate the position considering the offset
            const adjustedX = x + this.patternOffset;
            
            // Alternating between two colors
            // context.fillStyle = (Math.floor((adjustedX / tileSize) + (y / tileSize)) % 2 === 0) ? '#090a14' : '#10141f';
            context.fillStyle = (Math.floor((adjustedX / tileSize) + (y / tileSize)) % 2 === 0) ? '#10141f' : '#151d28';
            context.fillRect(adjustedX, y, tileSize, tileSize);
        }
    }

    // Restore canvas rotation
    context.restore();

    // Draw game title and options
    const xCenter = canvasWidth / 2;
    drawEngine.drawText('Dungeon of Curse', 40, xCenter, 40, '#cf573c');
    drawEngine.drawText('"Escape the curse in 13 seconds or be doomed forever!"', 12, xCenter, 75, '#a53030');

    // setInterval(() => {
    //   this.isShowStart = true;
    // }, 2000);

    drawEngine.drawText('Start Game', 17, xCenter, 130, this.isStartSelected ? '#ebede9' : 'gray');
    drawEngine.drawText('Toggle Fullscreen', 17, xCenter, 150, this.isStartSelected ? 'gray' : 'white');
    // if (this.isShowStart) {
    // }
    

    this.updateControls();
  }

  updateControls() {
    if ((controls.isUp && !controls.previousState.isUp)
      || (controls.isDown && !controls.previousState.isDown)) {
      this.isStartSelected = !this.isStartSelected;
    }

    if (controls.isConfirm && !controls.previousState.isConfirm) {
      if (this.isStartSelected) {
        gameStateMachine.setState(gameState);
      } else {
        this.toggleFullscreen();
      }
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
}

export const menuState = new MenuState();
