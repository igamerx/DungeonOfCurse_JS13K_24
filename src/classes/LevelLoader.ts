import { IBatEnemy, ICollectibales, IDoor, IEnemy, IHealthUpgrade, IKey, ILevel, ILevelChangePoint, ISkullEnemy } from "@/model/ILevel";
import { Player } from "./Player";
import { Animations, Box } from "@/model/common.model";
import { CollisionBlock } from "./CollisionBlock";
import { LevelChangePoints } from "./LevelManager";
import { PlayerHUD } from "./PlayerHUD";
import { TileMapGenerator } from '@/Engine/TileMapGenerator';
import { Engine, Timer } from '@/Engine/engine';
import { Door } from './Door';

import playerAnimationData from '@/data/playerAnimationData.json';
import doorAnimaitonData from '@/data/doorAnimaitonData.json';
import skullEnemyAnimationData from '@/data/skullEnemyAnimationData.json';
import batEnemyAnimationData from '@/data/batEnemyAnimationData.json';
import { SkullEnemy } from "./SkullEnemy";
import { Enemy } from "./Enemy";
import { BatEnemy } from "./BatEnemy";
import { drawEngine } from "@/Engine/draw-engine";
import { gameStateMachine } from "@/game-state-machine";
import { ParticleSystem } from "@/Engine/ParticleSystem";
import { HealthUpgrade } from "./HealthUpgrade";
import { DOOR_STATUS, SOUND_FX } from "@/constans/game-contstans";
import { Key } from "./Key";
import { audio } from "@/core/audio";
import { gamerWinState } from "@/game-states/game-win.state";

export class LevelLoader {

    private player!: Player;

    private parsedCollisions: any;
    private playerPosition: DOMPoint = new DOMPoint();


    public doors: Array<Door> = [];
    private isDoorAvailable: boolean = false;
    private doorDataArray: Array<IDoor> = [];
    private doorAnimations!: Array<Animations>;

    private enemiesData!: IEnemy;
    private isEnemiesAvailable: boolean = false;
    private isAnyEnemyAlive: boolean = false;

    public skullEnemies: Array<SkullEnemy> = [];
    private isSkullEnemiesAvailable: boolean = false;
    private skullEnemiesDataArray: Array<ISkullEnemy> = [];
    private skullEnemiesAnimations!: Array<Animations>;

    public batEnemies: Array<BatEnemy> = [];
    private isBatEnemiesAvailable: boolean = false;
    private batEnemiesDataArray: Array<IBatEnemy> = [];
    private batEnemiesAnimations!: Array<Animations>;

    // public spikes: Array<Spikes> = [];
    // private isSpikesAvailable: boolean = false;
    // private spikesDataArray: Array<ISpikes> = [];

    private collectibalesData!: ICollectibales;
    private isCollectibalesAvailable: boolean = false;

    public healthUpgrades: Array<HealthUpgrade> = [];
    private isHealthUpgradesAvailable: boolean = false;
    private healthUpgradesDataArray: Array<IHealthUpgrade> = [];
    private healthUpgradesAnimations!: Array<Animations>;

    public keys: Array<Key> = [];
    private isKeyAvailable: boolean = false;
    private keyDataArray: Array<IKey> = [];


    public lifeArray: Array<PlayerHUD> = [];

    private levelKey: string;
    public levelNumber!: number;
    public levelCollection: Array<any> = [];
    public tileMapGenerator!: TileMapGenerator;

    private isChangePointAvailable: boolean = false;
    public levelChangePointArray!: Array<ILevelChangePoint>;
    public levelChangePoints!: Array<LevelChangePoints>;

    public collisions: Array<number> = [];
    public levelCollisionBlocks: Array<CollisionBlock> = [];
    private collisionSymbolKey!: number;

    constructor(level: ILevel, playerObj: Player) {
        this.levelNumber = level.levelNumber;

        this.player = playerObj;

        this.levelKey = level.tileDataKey;

        if (level.levelChangePoints && level.levelChangePoints.length > 0) {
            this.isChangePointAvailable = true;
            this.levelChangePointArray = level.levelChangePoints;
        } else this.isChangePointAvailable = false;


        this.playerPosition.x = level.player.positionX;
        this.playerPosition.y = level.player.positionY;


        if (level.door && level.door.length > 0) {
            this.doorAnimations = doorAnimaitonData;
            this.isDoorAvailable = true;
            this.doorDataArray = level.door;
        } else this.isDoorAvailable = false;

        if (level.enemies) {
            this.isEnemiesAvailable = true;
            this.enemiesData = level.enemies;

            if (this.enemiesData.skullEnemy && this.enemiesData.skullEnemy.length > 0) {
                this.isSkullEnemiesAvailable = true;
                this.skullEnemiesAnimations = skullEnemyAnimationData;
                this.skullEnemiesDataArray = this.enemiesData.skullEnemy;
            }

            if (this.enemiesData.batEnemy && this.enemiesData.batEnemy.length > 0) {
                this.isBatEnemiesAvailable = true;
                this.batEnemiesAnimations = batEnemyAnimationData;
                this.batEnemiesDataArray = this.enemiesData.batEnemy;
            }

            // if (this.enemiesData.spikes && this.enemiesData.spikes.length > 0) {
            //     this.isSpikesAvailable = true;
            //     this.spikesDataArray = this.enemiesData.spikes;
            // }
        }

        if (level.collectibales) {
            this.isCollectibalesAvailable = true;
            this.collectibalesData = level.collectibales;

            if (this.collectibalesData.healthUpgrade && this.collectibalesData.healthUpgrade.length > 0) {
                this.isHealthUpgradesAvailable = true;
                this.healthUpgradesAnimations = [];
                this.healthUpgradesDataArray = this.collectibalesData.healthUpgrade;
            }

            if (this.collectibalesData.keys && this.collectibalesData.keys.length) {
                this.isKeyAvailable = true;
                this.keyDataArray = this.collectibalesData.keys;
            }
        }

    }

    public init(levelPoints?: LevelChangePoints) {

        this.LoadLevel(levelPoints?.nextLevel);

        if (levelPoints && levelPoints.playerNewPosition && levelPoints.playerNewPosition.x && levelPoints.playerNewPosition.y) {
            this.player.position.x = levelPoints.playerNewPosition.x;
            this.player.position.y = levelPoints.playerNewPosition.y;
        } else {
            this.player.position.x = this.playerPosition.x;
            this.player.position.y = this.playerPosition.y;
        }

        if (this.isChangePointAvailable) {
            this.levelChangePoints = [];
            this.levelChangePointArray.forEach((point: ILevelChangePoint) => {
                let changePoint: LevelChangePoints = new LevelChangePoints(point);
                changePoint.position.x = point.positionX;
                changePoint.position.y = point.positionY;
                changePoint.currentLevel = point.currentLevel;
                changePoint.nextLevel = point.nextLevel;
                this.levelChangePoints.push(changePoint);
            });
        }

        if (this.isDoorAvailable) {
            this.doors = [];
            this.doorDataArray.forEach((door: IDoor) => {
                let doorObj: Door = new Door(
                    new DOMPoint(door.positionX, door.positionY),
                    door.src,
                    this.player,
                    this.doorAnimations,
                    door.orientation,
                    door.status,
                    door.needKey,
                    door.blocked
                );
                this.doors.push(doorObj);
            });
        }

        if (this.isEnemiesAvailable) {
            if (this.isSkullEnemiesAvailable) {
                this.skullEnemies = [];
                this.skullEnemiesDataArray.forEach((skullEnemy: ISkullEnemy) => {
                    const skullEnemyObj: SkullEnemy = new SkullEnemy(
                        new DOMPoint(skullEnemy.positionX, skullEnemy.positionY),
                        skullEnemy.src,
                        this.player,
                        this.skullEnemiesAnimations,
                    );

                    this.skullEnemies.push(skullEnemyObj);
                });
            }

            if (this.isBatEnemiesAvailable) {
                this.batEnemies = [];
                this.batEnemiesDataArray.forEach((batEnemy: IBatEnemy) => {
                    const batEnemyObj: BatEnemy = new BatEnemy(
                        new DOMPoint(batEnemy.positionX, batEnemy.positionY),
                        batEnemy.src,
                        this.player,
                        this.batEnemiesAnimations,
                    );

                    this.batEnemies.push(batEnemyObj);
                });
            }

            // if (this.isSpikesAvailable) {
            //     this.spikes = [];
            //     this.spikesDataArray.forEach((spike: ISpikes) => {
            //         const spikeObj: Spikes = new Spikes(
            //             new DOMPoint(spike.positionX, spike.positionY),
            //             this.player
            //         );

            //         this.spikes.push(spikeObj);
            //     });
            // }

        }

        if (this.isCollectibalesAvailable) {
            if (this.isHealthUpgradesAvailable) {
                this.healthUpgrades = [];
                this.healthUpgradesDataArray.forEach((health: IHealthUpgrade) => {
                    const healthUpgradeObj: HealthUpgrade = new HealthUpgrade(
                        new DOMPoint(health.positionX, health.positionY),
                        this.player
                    );

                    this.healthUpgrades.push(healthUpgradeObj);
                })
            }

            if (this.isKeyAvailable) {
                this.keys = [];
                this.keyDataArray.forEach((key: IKey) => {
                    const keyObj: Key = new Key(
                        new DOMPoint(key.positionX, key.positionY),
                        this.player
                    )
                    this.keys.push(keyObj);
                });
            }
        }

        this.particalSystem = new ParticleSystem();

    }

    public particalSystem!: ParticleSystem;

    public update(delta: number) {

        this.updateLevelComponents(delta);
        this.particalSystem.updateAndDraw(delta);
    }


    private LoadLevel(nextLevel?: number) {
        if (nextLevel) {
            this.levelNumber = nextLevel;
        }

        this.tileMapGenerator = new TileMapGenerator(`level${this.levelNumber}TilesData`);

        this.collisions = this.tileMapGenerator.collisions;
        this.collisionSymbolKey = this.tileMapGenerator.collisionSymbolKey;
        let array2d = Engine.parseTo2DArray(this.collisions, 20);
        this.levelCollisionBlocks = Engine.createArrayFrom2D(array2d, this.collisionSymbolKey);

        this.player.collisionBlocks = this.levelCollisionBlocks;
    }


    private isPlayingDoorOpen = false;
    private updateLevelComponents(delta: number) {
        this.tileMapGenerator.draw();
        this.showPlayerLifeHearts();

        this.lifeArray.forEach((heart: PlayerHUD, index: number) => {
            heart.healthImgDraw();
        })
        this.lifeArray = [];

        if (this.player.isDashAvailable && this.player.isAlive) {
            this.showPlayerDashIcon();
            this.dashIcon.dashIconImgDraw();
        }

        if (this.player.hasKey && (this.levelNumber === 6 || this.levelNumber === 5)) {
            this.showKeyIcon();
        }

        this.levelCollisionBlocks.forEach((block: CollisionBlock) => {
            block.draw();
        });

        // if (this.isSpikesAvailable) {
        //     this.spikes.forEach((spike: Spikes, index: number) => {
        //         spike.updateAndDraw(delta);
        //     });
        // }

        if (this.isDoorAvailable) {
            this.doors.forEach((door: Door) => {
                door.update(delta);
                // door.isNeedKey = this.player.notHasKey;

                if (this.isAnyEnemyAlive) {

                    door.doorStatus = DOOR_STATUS.CLOSE;
                    this.isPlayingDoorOpen = false;
                    Engine.startTimeout();
                }
                else {
                    if ((!door.isLocked || this.player.hasKey) && !door.isBlocked) {
                        if (!Engine.isTimeoutComplete()) {
                            Engine.setTimeout(delta, 700);
                        } else {
                            door.doorStatus = DOOR_STATUS.OPEN;
                            if (!this.isPlayingDoorOpen) {
                                if (SOUND_FX) audio.playDoorOpenFx();
                                this.isPlayingDoorOpen = true;
                                this.player.hasKey = false;
                            }
                        }
                    } else if (!this.isAnyEnemyAlive && door.isBlocked) {
                        door.doorStatus = DOOR_STATUS.CLOSE;
                        // this.isPlayingDoorOpen = false;               
                    }
                }
            })
        }

        if (this.isEnemiesAvailable) {
            this.isAnyEnemyAlive = this.skullEnemies.length > 0 || this.batEnemies.length > 0;
            
            if (this.levelNumber === 7 && !this.isAnyEnemyAlive){
                this.player.isGameWin = true;
            }

            if (this.isSkullEnemiesAvailable) {

                let attackedEnemy: SkullEnemy;

                this.skullEnemies.forEach((skull: SkullEnemy, index: number) => {
                    skull.updateAndDraw(delta);
                    skull.name = 'enemy_skull_' + (index + 1);
                    attackedEnemy = this.player.attackEnemy(skull, index, this.skullEnemies);
                    if (attackedEnemy instanceof SkullEnemy) {
                        attackedEnemy.position.x = attackedEnemy.position.x + 15;
                        attackedEnemy.position.y = attackedEnemy.position.y + 15;
                        this.particalSystem.burst(attackedEnemy.position, 50, '#090a14');
                    }
                    this.particalSystem.resetBurst();
                });
            }

            if (this.isBatEnemiesAvailable) {

                let attackedEnemy: BatEnemy;

                this.batEnemies.forEach((bat: BatEnemy, index: number) => {
                    bat.updateAndDraw(delta);
                    bat.name = 'enemy_bat_' + (index + 1);
                    attackedEnemy = this.player.attackEnemy(bat, index, this.batEnemies);

                    if (attackedEnemy instanceof BatEnemy) {
                        attackedEnemy.position.x = attackedEnemy.position.x + 15;
                        attackedEnemy.position.y = attackedEnemy.position.y + 15;
                        this.particalSystem.burst(attackedEnemy.position, 50, '#090a14');
                    }
                    this.particalSystem.resetBurst();
                });
            }

        } else {
            this.isAnyEnemyAlive = false;
        }

        if (this.isCollectibalesAvailable) {
            if (this.isHealthUpgradesAvailable) {
                let healthUpgradeObj: HealthUpgrade;
                this.healthUpgrades.forEach((health: HealthUpgrade, index: number) => {
                    health.name = 'health_' + index
                    health.update(delta);
                    healthUpgradeObj = health.getHealthUpgrade(health, this.healthUpgrades);

                    if (healthUpgradeObj instanceof HealthUpgrade) {
                        health.position.x = health.position.x + 6;
                        health.position.y = health.position.y + 6;
                        this.particalSystem.burst(health.position, 20, '#a53030');
                    }

                });
                this.particalSystem.resetBurst();
            }

            if (this.isKeyAvailable && !this.player.hasKey) {

                let keyObj: Key;
                this.keys.forEach((key: Key, index: number) => {
                    key.name = 'key_' + index
                    key.update(delta);
                    keyObj = key.getKey(key, this.keys);

                    if (keyObj instanceof Key) {
                        key.position.x = key.position.x + 6;
                        key.position.y = key.position.y + 6;
                        this.particalSystem.burst(key.position, 10, '#e8c170');
                    }

                });
                this.particalSystem.resetBurst();
            }
        }

        this.player.update(delta);
        this.showWinScreen();
    }

    private isPlayWin = false;
    private showWinScreen() {
        if (!this.isAnyEnemyAlive && this.levelNumber === 7 && this.player.isAlive) {
            if (!this.isPlayWin) {
                if (SOUND_FX) audio.playGameWinFx();
                this.isPlayWin = true;
            }
            setTimeout(() => {

                gameStateMachine.setState(gamerWinState);
            }, 1500);
        }
    }

    private showPlayerLifeHearts() {
        for (let i = 0; i < this.player.health; i++) {
            let pos = this.heartPositionData[i];
            this.lifeArray.push(new PlayerHUD(new DOMPoint(pos.heartPosition.x, pos.heartPosition.y), true));
        }
        return this.lifeArray;
    }

    private dashIcon!: PlayerHUD;
    private showPlayerDashIcon() {
        let position = new DOMPoint(5, 14);
        this.dashIcon = new PlayerHUD(position, false, true);
    }

    private keyIcon!: Key;
    private showKeyIcon() {
        let position = new DOMPoint(20, 18);
        this.keyIcon = new Key(position, this.player);
        this.keyIcon.draw();
    }

    private heartPositionData = [
        {
            heartPosition: {
                x: 5,
                y: 5
            }
        },
        {
            heartPosition: {
                x: 17,
                y: 5
            }
        },
        {
            heartPosition: {
                x: 29,
                y: 5
            }
        },
        {
            heartPosition: {
                x: 41,
                y: 5
            }
        },
        {
            heartPosition: {
                x: 52,
                y: 5
            }
        }
    ]
}