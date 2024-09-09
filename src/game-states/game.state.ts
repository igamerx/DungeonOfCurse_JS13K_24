import { State } from '@/core/state';
import { drawEngine } from '@/Engine/draw-engine';
import { controls } from '@/core/controls';
import { gameStateMachine } from '@/game-state-machine';
import { menuState } from '@/game-states/menu.state';
import { LevelManager } from '@/classes/LevelManager';

class GameState implements State {

  public levelManager!: LevelManager;

  constructor() {
  }

  onEnter() {
    this.levelManager = new LevelManager();
    this.levelManager.init();
  }

  onUpdate(delta: number) {

    this.screenSetUp();

    this.levelManager.update(delta);

    if (controls.isEscape) {
      gameStateMachine.setState(menuState);
    }
  }

  screenSetUp() {
    drawEngine.context.fillStyle = '#10141f';
    drawEngine.context.fillRect(0, 0, drawEngine.canvasWidth, drawEngine.canvasHeight);
  }

}

export const gameState = new GameState();
