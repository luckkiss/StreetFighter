import LogManager from "./LogManager";
import JoystickManager from "./JoystickManager";
import MainView from "./MainView";

export default class TestScript extends Laya.Script {
    public gameObject: Laya.Sprite3D;
    public animator: Laya.Animator;
    
    constructor() {
        super();
    }

    onStart(): void {
        // this.gameObject = MainView.getInstance().playerA;
        // console.log("gameObject:", this.gameObject != null);
        // this.animator = this.gameObject.getComponent(Laya.Animator);
        // console.log("animator:", this.animator != null);
    }
    
    InitData(sp: Laya.Sprite3D): void {
        this.gameObject = sp;
        console.log("gameObject:", this.gameObject != null);
        this.animator = this.gameObject.getComponent(Laya.Animator);
        console.log("animator:", this.animator != null);
    }
}