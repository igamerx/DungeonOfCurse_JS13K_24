import { DEBUGGER, SOUND_FX } from "@/constans/game-contstans";
import { Engine, Timer } from "@/Engine/engine";
import { Animations, Box } from "@/model/common.model";
import { Player } from "./Player";
import { TileMapGenerator } from "@/Engine/TileMapGenerator";
import { CollisionBlock } from "./CollisionBlock";
import { PlayerHUD } from "./PlayerHUD";

import playerAnimationData from '@/data/playerAnimationData.json';
import allLevelData from '@/data/levelData.json';
import { ILevel, ILevelChangePoint } from "@/model/ILevel";
import { LevelLoader } from "./LevelLoader";
import { drawEngine } from "@/Engine/draw-engine";
import { gameStateMachine } from "@/game-state-machine";
import { gameOverState } from "@/game-states/game-over.state";
import { audio } from "@/core/audio";

export class LevelManager {

    private player!: Player;
    public playerImg: string = 'knight_idle.png';
    public playerAnimation: Array<Animations> = [];
    public playerAnimationData = playerAnimationData;

    public lifeArray: Array<PlayerHUD> = [];

    public levelNumber = 1;
    public levelCollection: Array<LevelLoader> = [];
    public levelData: any;

    public levelCollisionBlocks: Array<CollisionBlock> = [];

    private levelChangeHasCollided: boolean = false;
    private fadeEffectCanvas = document.getElementById('c2d');
    private fadeDuration = 1000;

    private startTimer: boolean = false;
    private timerPrevent: boolean = false;
    private countdown!: Timer;

    constructor() {

    }

    private isPlayStart = false;
    public init() {
        this.playerAnimationData.forEach((data: Animations) => {
            const animation = new Animations(data.animationName, data.props);
            this.playerAnimation.push(animation);
        })
        this.player = new Player(this.levelCollisionBlocks, new DOMPoint(50, 100), this.playerImg, this.playerAnimation, 2, 7);
        this.player.isAlive = true

        this.levelChangeHasCollided = false;

        this.levelData = allLevelData;
        this.levelData.forEach((data: ILevel) => {
            const level = new LevelLoader(data, this.player)
            this.levelCollection.push(level);
        })

        this.levelCollection[this.levelNumber - 1].init();

        this.startTimer = false;

        if (!this.isPlayStart && this.levelNumber === 1) {
            if (SOUND_FX) audio.playGameWinFx();
            this.isPlayStart = true;
        }

    }

    private isPlayDieSound: boolean = false;
    public update(delta: number) {
        let timeOut;


        if (this.levelCollection && this.levelCollection.length > 0) {

            this.levelCollection[this.levelNumber - 1].update(delta);

            this.levelCollection[this.levelNumber - 1].levelChangePoints.forEach((point: LevelChangePoints) => {
                point.update();
                this.changeLevel(point);
            })
        }

        this.startTimer = true;
        if (!this.timerPrevent) {
            this.timerPrevent = true;
            this.countdown = new Timer(13, () => {
                // console.log('New timer for 13 sec');
            });

        }

        if (this.startTimer && this.player.isAlive) {
            clearTimeout(timeOut);

            const timeRemaining = this.countdown.getTimeRemaining() / 1000; // Convert to seconds
            if (!this.player.isGameWin) { 
                if (timeRemaining <= 7) { 
                    drawEngine.drawText(`Time remaining: ${timeRemaining.toFixed(1)}s`,
                    14, 198, 12, '#cf573c', 'left')
                } else {
                    drawEngine.drawText(`Time remaining: ${timeRemaining.toFixed(1)}s`,
                        10, 229, 10, '#da863e', 'left')
                }
            }
            
            if (timeRemaining === 0 && !this.levelChangeHasCollided) {
                if (!this.player.isGameWin) {
                    this.player.isAlive = false;
                    this.player.playerDied();
                    Engine.startTimeout();
                }

            }
        } else if (!this.player.isAlive) {
            if (!Engine.isTimeoutComplete()) {
                Engine.setTimeout(delta, 2500);
                // gameStateMachine.setState(gamerOverState);
            } else {
                this.player.startTimer = false;
                this.countdown.resetTimer();

                if (!this.isPlayDieSound) {
                    if (SOUND_FX) audio.playPlayerGetHitFx();
                    this.isPlayDieSound = true;
                }
                gameStateMachine.setState(gameOverState);
            }
        }

        if (!this.player.isAlive) {
            if (!this.isPlayDieSound) {
                if (SOUND_FX) audio.playPlayerGetHitFx();
                this.isPlayDieSound = true;
            }
            timeOut = setTimeout(() => {
                gameStateMachine.setState(gameOverState);
            }, 1500);
        }

    }


    public changeLevel(point: LevelChangePoints) {

        const collide = Engine.collisions(point.areaBox, this.player.hitBox);

        if (collide && !this.levelChangeHasCollided) {

            this.levelChangeHasCollided = true;
            this.player.transitionToNextLevel(true);

            Engine.fadeOut(this.fadeEffectCanvas, this.fadeDuration, () => {

                this.levelChangeHasCollided = false;
                // this.levelNumber++;
                this.levelNumber = point.nextLevel;

                console.log('change level', this.levelNumber);
                this.player.transitionToNextLevel(false);

                if (this.levelCollection.length >= this.levelNumber) {
                    this.levelCollection[this.levelNumber - 1].init(point);
                }
                this.timerPrevent = false; // To reset the game timer for 13 sec after completing level.

                Engine.fadeIn(this.fadeEffectCanvas, this.fadeDuration, () => {

                });
            });

        }
    }
}

export class LevelChangePoints {
    public areaBox: Box = new Box();
    public position: DOMPoint = new DOMPoint();
    public currentLevel!: number;
    public nextLevel!: number;
    public playerNewPosition: DOMPoint = new DOMPoint();


    constructor(changePoint: ILevelChangePoint) {
        this.position = new DOMPoint(changePoint.positionX, changePoint.positionY);
        this.currentLevel = changePoint.currentLevel;
        this.nextLevel = changePoint.nextLevel;
        this.playerNewPosition.x = changePoint.playerNewPositionX;
        this.playerNewPosition.y = changePoint.playerNewPositionY;
    }

    public update() {
        this.levelChangeAreabox();
    }

    private levelChangeAreabox() {
        this.areaBox.position.x = this.position.x;
        this.areaBox.position.y = this.position.y;
        this.areaBox.width = 32;
        this.areaBox.height = 32;
        if (DEBUGGER) {
            Engine.debugBox(this.areaBox, '#75a743');
        }
    }
}
