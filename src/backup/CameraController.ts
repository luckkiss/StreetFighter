// import GameManager from "./GameManager";

/**控制摄像机运动 */
// https://github.com/yoyohan1/Layabox_3DModelScene/blob/master/3DModelScene_LayaProject2.1.1.1/src/scripts/CameraSpin.ts

export default class CameraController extends Laya.Script3D {
    private camera: Laya.Camera;
    private target: Laya.Sprite3D;

    constructor() {
        super();
    }
    
    onAwake(): void {
        this.camera = this.owner as (Laya.Camera);
        // this.target = GameManager.instance.player;
    }

    // 震镜
    onShark(): void {
        
    }
}