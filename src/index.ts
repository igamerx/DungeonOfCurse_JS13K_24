import { drawEngine } from './Engine/draw-engine';
import { gameState } from './game-states/game.state';
import { createGameStateMachine, gameStateMachine } from './game-state-machine';
import { controls } from '@/core/controls';
import { screenShake } from './Engine/ScreenShake';
import { menuState } from './game-states/menu.state';
import { gameOverState } from './game-states/game-over.state';
import { gamerWinState } from './game-states/game-win.state';

// createGameStateMachine(gameOverState);
createGameStateMachine(menuState);
// createGameStateMachine(gameState);

// const countdown = new Timer(13, () => {
//   console.log('New timer for 13 sec')
// });
// console.log("Time remaining: ", countdown.getTimeRemaining(), "ms");

let previousTime = 0;
const interval = 1000 / 60;

(function draw(currentTime: number) {
  const delta = currentTime - previousTime;

  if (delta >= interval) {
    previousTime = currentTime - (delta % interval);

    controls.queryController();
    screenShake.update(delta);
    drawEngine.context.clearRect(0, 0, drawEngine.canvasWidth, drawEngine.canvasHeight);
    // Although the game is currently set at 60fps, the state machine accepts a time passed to onUpdate
    // If you'd like to unlock the framerate, you can instead use an interval passed to onUpdate to 
    // adjust your physics so they are consistent across all frame rates.
    // If you do not limit your fps or account for the interval your game will be far too fast or far too 
    // slow for anyone with a different refresh rate than you.
    gameStateMachine.getState().onUpdate(delta);


    // const timeRemaining = countdown.getTimeRemaining() / 1000; // Convert to seconds
    // drawEngine.context.font = '24px Arial';
    // drawEngine.context.fillStyle = '#FFFFFF'; // White color
    // drawEngine.context.fillText(`Time remaining: ${timeRemaining.toFixed(1)}s`, 10, 30);


  }
  requestAnimationFrame(draw);
})(0);
