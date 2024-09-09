import { Animations } from "./common.model";

export interface ILevel {
    levelNumber: number;
    tileDataKey: string;
    levelChangePoints: Array<ILevelChangePoint>;
    player: IPlayer;
    door: Array<IDoor>;
    collisions: any;
    enemies?: IEnemy;
    collectibales?: ICollectibales;

    init?: () => void;
}

export interface ILevelChangePoint {
    positionX: number,
    positionY: number,
    currentLevel: number,
    nextLevel: number,
    playerNewPositionX: number;
    playerNewPositionY: number;
}

export interface IPlayer {
    positionX: number;
    positionY: number;
    src: string;
    animations: Array<Animations>;
}

export interface IDoor {
    positionX: number;
    positionY: number;
    src: string;
    animations: Array<Animations>;
    orientation: string;
    status: string;
    needKey: boolean;
    blocked: boolean;
}

export interface IEnemy {
    skullEnemy: Array<ISkullEnemy>;
    batEnemy: Array<IBatEnemy>;
    // spikes: Array<ISpikes>;
}

export interface ISkullEnemy {
    positionX: number;
    positionY: number;
    src: string;
    animations: Array<Animations>;
    canMove: boolean;
    moveSpeed: number;
}

export interface IBatEnemy {
    positionX: number;
    positionY: number;
    src: string;
    animations: Array<Animations>;
    canMove: boolean;
    moveSpeed: number;
}

// export interface ISpikes {
//     positionX: number;
//     positionY: number;
// }

export interface ICollectibales {
    healthUpgrade: Array<IHealthUpgrade>;
    keys: Array<IKey>;
}

export interface IHealthUpgrade {
    positionX: number;
    positionY: number;
}

export interface IKey {
    positionX: number;
    positionY: number;
}