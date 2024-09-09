import { Engine } from './engine';
import { drawEngine } from "@/Engine/draw-engine";
import { ITileMap } from "@/model/ITileMap";

import levelTileData from '@/data/levelTilesetData.json'
import { BACK_GROUND, OBJECT_TILES, PLATFORM_TILES } from "@/constans/game-contstans";

export class TileMapGenerator {

    protected bufferCanvas: CanvasRenderingContext2D;
    protected tileData: ITileMap;
    protected tileDataArray: Array<ITileMap>;
    protected tileSize: number;
    protected tileColumns: number;
    protected tileRows: number;
    protected mapWidth: number
    protected mapHeight: number;

    protected bgData: Array<number>;
    protected backGroundTileImage: HTMLImageElement;
    protected isBGTileLoaded: boolean = false;
    protected bgSheetColCount: number;
    protected bgSpriteStartingIndex: number;

    protected platformData: Array<number>;
    protected isPlatformTileLoaded: boolean = false;
    protected platformTileSheetImage: HTMLImageElement;
    protected platformSheetColCount: number;
    protected platformSpriteStartingIndex: number;


    public collisions: Array<number>;
    public collisionSymbolKey!: number;

    constructor(tileDataKey: string) {
        this.bufferCanvas = drawEngine.getBuffer();
        this.tileDataArray = levelTileData;
        this.tileData = this.tileDataArray.find((dataObj: ITileMap) => dataObj.key === tileDataKey) as ITileMap;

        this.tileSize = this.tileData.tileSize;
        this.tileColumns = this.tileData.width;
        this.tileRows = this.tileData.height;

        this.mapWidth = this.tileData.width * this.tileData.tileSize;
        this.mapHeight = this.tileData.height * this.tileData.tileSize;

        // Background tiles setup.
        this.bgData = this.tileData.backGround.data;
        this.backGroundTileImage = new Image();
        this.backGroundTileImage.src = this.tileData.backGround.spriteSrc;
        this.backGroundTileImage.onload = () => {
            if (!this.backGroundTileImage) return;
            this.isBGTileLoaded = true;
        }
        this.bgSheetColCount = this.tileData.backGround.tileSheetColumns;
        this.bgSpriteStartingIndex = this.tileData.backGround.tileIndexStart;

        // Platform tiles setup.
        this.platformData = this.tileData.platform.data;
        this.platformTileSheetImage = new Image();
        this.platformTileSheetImage.src = this.tileData.platform.spriteSrc;
        this.platformTileSheetImage.onload = () => {
            if (!this.platformTileSheetImage) return;
            this.isPlatformTileLoaded = true;
        }
        this.platformSheetColCount = this.tileData.platform.tileSheetColumns;
        this.platformSpriteStartingIndex = this.tileData.platform.tileIndexStart;

        this.collisions = this.tileData.collision;
        this.collisionSymbolKey = this.tileData.collisionSymbolKey;
    }

    // This will calculate the tile's source position in the tile sheet given the number of columns in the tile sheet and the index of the tile in the tile sheet.
    protected calculateTileSourcePosition(tileIndex: number, tileSheetColumns: number, tileType: string) {
        let tileStartingIndex: number = 0;
        if (tileType === BACK_GROUND) {
            tileStartingIndex = this.bgSpriteStartingIndex;
        } else if (tileType === PLATFORM_TILES) {
            tileStartingIndex = this.platformSpriteStartingIndex;
        }
        let index = tileIndex - tileStartingIndex;
        let xPos = index % tileSheetColumns * this.tileSize;
        let yPos = Math.floor(index / tileSheetColumns) * this.tileSize;

        return new DOMPoint(xPos, yPos);
    }

    protected renderTiles(tileType: string) {
        let tileMapData: Array<number> = [];

        if (tileType === BACK_GROUND) {
            tileMapData = this.bgData;
        } else if (tileType === PLATFORM_TILES) {
            tileMapData = this.platformData;
        }

        const map2DArray = Engine.parseTo2DArray(tileMapData);
        // console.log(map2DArray);

        for (let mapRow = 0; mapRow < this.tileRows; mapRow++) {
            for (let mapColumn = 0; mapColumn < this.tileColumns; mapColumn++) {
                const tileValue = map2DArray[mapRow][mapColumn];

                let tileSourcePosition: DOMPoint = new DOMPoint();
                let displayTile: HTMLImageElement = new Image();

                if (tileValue === 0) {
                    continue;
                }

                if (tileType === BACK_GROUND) {
                    displayTile = this.backGroundTileImage;
                    tileSourcePosition = this.calculateTileSourcePosition(tileValue, this.bgSheetColCount, tileType);
                } else if (tileType === PLATFORM_TILES) {
                    displayTile = this.platformTileSheetImage;
                    tileSourcePosition = this.calculateTileSourcePosition(tileValue, this.platformSheetColCount, tileType);
                }

                this.bufferCanvas.drawImage(
                    displayTile,
                    tileSourcePosition.x,
                    tileSourcePosition.y,
                    this.tileSize,
                    this.tileSize,

                    mapColumn * this.tileSize,
                    mapRow * this.tileSize,
                    this.tileSize,
                    this.tileSize
                );
            }
        }
    }

    protected renderMap() {
        drawEngine.context.drawImage(this.bufferCanvas.canvas, 0, 0);
    }

    public draw() {
        // console.log('msg from level gen' + this.tileData)
        this.drawBgTiles();
        this.drawPlatformTiles();
    }

    protected drawBgTiles() {
        if (this.isBGTileLoaded && BACK_GROUND) {
            this.renderTiles(BACK_GROUND);
            this.renderMap();
        }
    }

    protected drawPlatformTiles() {
        if (this.isPlatformTileLoaded && PLATFORM_TILES) {
            this.renderTiles(PLATFORM_TILES);
            this.renderMap();
        }
    }
}