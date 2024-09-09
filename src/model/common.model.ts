export class Box {
    constructor(
        public position: DOMPoint = new DOMPoint(),
        public width: number = 0,
        public height: number = 0
        ) {}
}

export class Animations {
    constructor(
        public animationName: string,
        public props: AnimationProp
    ){
    }
    public isActive?: boolean = false;
    onComplete?(): void;
}

export class AnimationProp {
    constructor(
        public frameCount: number,
        public frameBuffer: number,
        public loop: boolean,
        public src: string,
        public image?: any
    ) {}
}