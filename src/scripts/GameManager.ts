import CameraController from "./CameraController";
import PlayerController from "./PlayerController";

/**全局管理类*/

export default class GameManager extends Laya.Script { //相当于unity的MonoBehavior
    public static instance: GameManager;

    //#region 注册Unity场景资产
    /** @prop {name:camera, tips:"摄像机", type:Laya.Camera, default:null}*/
    public camera: Laya.Camera;
    /** @prop {name:directionLight, tips:"平行光", type:Laya.DirectionLight, default:null}*/
    public directionLight: Laya.DirectionLight;
    /** @prop {name:player, tips:"角色", type:Laya.Sprite3D, default:null}*/
    public player: Laya.Sprite3D;
    //#endregion

    /** @prop {name:gamePad, tips:"按钮", type:Node, default:null}*/
    public gamePad: Laya.Node;

    constructor() { 
        super();

        GameManager.instance = this;

        // https://ldc2.layabox.com/doc/?nav=zh-as-4-3-1
        Laya.Scene3D.load("res/unity3d/LayaScene.ls", Laya.Handler.create(this, function(scene:Laya.Scene3D):void {

            //加载完成获取到了Scene3d
            Laya.stage.addChild(scene);
            scene.zOrder = -1; //层级位于UI之下

            //获取摄像机
            this.camera = scene.getChildByName("Main Camera") as Laya.Camera;
            // this.camera.addComponent(CameraController);

            //获取光照
            // this.directionLight = scene.getChildByName("Directional Light") as Laya.DirectionLight;
            // this.directionLight.color = new Laya.Vector3(1, 0, 0);

            //获取角色
            this.player = scene.getChildByName("RPG-Character") as Laya.Sprite3D;  
            this.player.addComponent(PlayerController);

            console.log("角色");

            var text: Laya.Node = scene.getChildByName("Text");
            console.log("text: ", (text != null));
        }));
    }
}