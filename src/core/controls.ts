const enum XboxControllerButton {
  A,
  B,
  X,
  Y,
  LeftBumper,
  RightBumper,
  LeftTrigger,
  RightTrigger,
  Select,
  Start,
  L3,
  R3,
  DpadUp,
  DpadDown,
  DpadLeft,
  DpadRight,
}

class Controls {
  isUp = false;
  isDown = false;
  isLeft = false;
  isRight = false;
  isConfirm = false;
  isEscape = false;
  isAttack = false;
  isDash = false;
  inputDirection: DOMPoint;

  keyMap: Map<string, boolean> = new Map();
  previousState = {
    isUp: this.isUp, isDown: this.isDown, isConfirm: this.isConfirm,
    isEscape: this.isEscape, isLeft: this.isLeft, isRight: this.isRight, isAttack: this.isAttack,
    isDash: this.isDash
  };

  isPressed: boolean = false;
  isReleased: boolean = false;
  pressFlag: boolean = false;
  gamepad: any;

  constructor() {
    document.addEventListener('keydown', event => this.toggleKey(event, true));
    document.addEventListener('keyup', event => this.toggleKey(event, false));
    
    document.addEventListener('keydown', event => { this.isPressed = true, this.isReleased = false });
    document.addEventListener('keyup', event => { this.isPressed = false, this.isReleased = true });
    
    this.inputDirection = new DOMPoint();
  }

  queryController() {
    this.previousState.isUp = this.isUp;
    this.previousState.isDown = this.isDown;
    this.previousState.isConfirm = this.isConfirm;
    this.previousState.isEscape = this.isEscape;
    this.previousState.isLeft = this.isLeft;
    this.previousState.isRight = this.isRight;
    this.previousState.isAttack = this.isAttack;
    this.previousState.isDash = this.isDash;

    const gamepads = navigator.getGamepads();

    for(const gpad of gamepads) {
      if(gpad) {
        this.gamepad = gpad
      }
    }
    const isButtonPressed = (button: XboxControllerButton) => this.gamepad?.buttons[button].pressed;

    const leftVal = (this.keyMap.get('KeyA') || this.keyMap.get('ArrowLeft') || isButtonPressed(XboxControllerButton.DpadLeft)) ? -1 : 0;
    const rightVal = (this.keyMap.get('KeyD') || this.keyMap.get('ArrowRight') || isButtonPressed(XboxControllerButton.DpadRight)) ? 1 : 0;
    const upVal = (this.keyMap.get('KeyW') || this.keyMap.get('ArrowUp') || isButtonPressed(XboxControllerButton.DpadUp)) ? -1 : 0;
    const downVal = (this.keyMap.get('KeyS') || this.keyMap.get('ArrowDown') || isButtonPressed(XboxControllerButton.DpadDown)) ? 1 : 0;
    
    // const attackVal = (this.keyMap.get('KeyJ') || this.keyMap.get('Numpad2') || isButtonPressed(XboxControllerButton.A));

    this.inputDirection.x = (leftVal + rightVal) || this.gamepad?.axes[0] || 0;
    this.inputDirection.y = (upVal + downVal) || this.gamepad?.axes[1] || 0;

    const deadzone = 0.1;
    if (Math.hypot(this.inputDirection.x, this.inputDirection.y) < deadzone) {
      this.inputDirection.x = 0;
      this.inputDirection.y = 0;
    }

    this.isUp = this.inputDirection.y < 0;
    this.isDown = this.inputDirection.y > 0;
    this.isLeft = this.inputDirection.x < 0;
    this.isRight = this.inputDirection.x > 0;
    this.isConfirm = Boolean(this.keyMap.get('Enter') || isButtonPressed(XboxControllerButton.A) || isButtonPressed(XboxControllerButton.Start));
    this.isEscape = Boolean(this.keyMap.get('Escape') || isButtonPressed(XboxControllerButton.Select));
    this.isAttack = Boolean(this.keyMap.get('KeyJ') || this.keyMap.get('Numpad2') || isButtonPressed(XboxControllerButton.A));
    this.isDash = Boolean(this.keyMap.get('Space') || this.keyMap.get('Numpad0') || isButtonPressed(XboxControllerButton.B));
  }

  private toggleKey(event: KeyboardEvent, isPressed: boolean) {
    this.keyMap.set(event.code, isPressed);
  }

  // public isKeyJustPressed(key: string): boolean {
  //   let justPressed = false;
  //   if (this.isPressed && !this.pressFlag) {
  //     justPressed = Boolean(this.keyMap.get(key));
  //     this.pressFlag = true;
  //   }
  //   if (this.isReleased && this.pressFlag) {
  //     this.pressFlag = false;
  //   }
  //   return justPressed;
  // }
}

export const controls = new Controls();
