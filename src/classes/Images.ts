import { drawEngine } from "@/Engine/draw-engine";

class Images {
    // public position: DOMPoint;
    constructor() {

    }

    // 11px width and 10px height of heart img.
    public getHeartSprite(position: DOMPoint) {
        const palette = "001a33ccc";
        const imageString = "@@@@@@@@@@@@@@@@@@I@HA@@@HRAQJ@@@Q[JRRA@@QSRRRA@@QRRRRA@@HRRRJ@@@@QRRA@@@@HRJ@@@@@@QA@@@@@@H@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@";
        const imageSize = 16;

        this.renderImage(palette, imageString, imageSize, position);

    }

    public getSpikesSprite(position: DOMPoint) {
        const palette = "eee899345";
        const imageString = "@@@@@@@@@@A@A@A@@@B@B@B@@@C@C@C@@@@@@@@@@A@A@A@A@B@B@B@B@C@C@C@C@@@@@@@@@@A@A@A@@@B@B@B@@@C@C@C@@@@@@@@@@A@A@A@A@B@B@B@B@C@C@C@C";
        const imageSize = 16;
        this.renderImage(palette, imageString, imageSize, position);

    }

    public getKeySprite(position: DOMPoint) {
        const palette = "001ec7d94";
        const imageString = "@@@@@@@@@HIA@@@@@Y[KIIIAH[I[[[SAHZI[IJJ@@QZJ@AA@@HIA@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@";
        const imageSize = 16;
        this.renderImage(palette, imageString, imageSize, position);

    }


    public getDashIconSprite(position: DOMPoint) {
        const palette = "001d94edb00fff00fff0f";
        const imageString = "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@HAIHA@@@QKZQK@@@HZRSZA@@@QSZRK@@HZRSZA@@QKZQK@@@HAIHA@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@";
        const imageSize = 16;
        this.renderImage(palette, imageString, imageSize, position);

    }

    private renderImage(palette: string, imageString: string, imgageSize: number, position: DOMPoint) {
        const c = drawEngine.context
        const C = palette; // color palette
        const P: number[] = [];

        // Pixel decoding
        imageString.replace(/./g, (a: string) => {
            const z = a.charCodeAt(0);
            P.push(z & 7);
            P.push((z >> 3) & 7);
            return a;
        });

        const S = imgageSize;
        for (let j = 0; j < S; j++) {
            for (let i = 0; i < S; i++) {
                if (P[j * S + i]) {
                    c.fillStyle = `#${C.substring(3 * (P[j * S + i] - 1), 3 * (P[j * S + i] - 1) + 3)}`;
                    c.fillRect(position.x + i, position.y + j, 1, 1);
                }
            }
        }
    }
}

export const images = new Images();