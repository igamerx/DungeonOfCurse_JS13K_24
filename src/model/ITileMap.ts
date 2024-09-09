export interface ITileMap {
    key: string,
    tileSize: number,
    width: number,
    height: number,
    backGround: ITile,
    platform: ITile,
    collisionSymbolKey: number
    collision: Array<number>,
}

export interface ITile {
    spriteSrc: string,
    tileSheetColumns: number,
    tileIndexStart: number,
    data: Array<number>
}