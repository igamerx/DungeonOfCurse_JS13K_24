import { images } from "./Images";

export class PlayerHUD {

    public position: DOMPoint = new DOMPoint();
    private showHearts: boolean = false;
    private showDash: boolean = false;

    constructor(position: DOMPoint, showHearts: boolean, showDash: boolean = false) {
        this.position = position;
        this.showHearts = showHearts;
        this.showDash = showDash;
    }

    public healthImgDraw() {
        if (this.showHearts) {
            images.getHeartSprite(this.position);
        }
    }

    public dashIconImgDraw() {
        if (this.showDash) {
            images.getDashIconSprite(this.position);
        }
    }

}