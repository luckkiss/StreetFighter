// import CameraController from "./CameraController";
import PlayerController from "./PlayerController";

/**全局管理类*/

export default class GameManager extends Laya.Script { //相当于unity的MonoBehavior
    public static instance: GameManager;

    //#region 注册Unity场景资产
    /** @prop {name:camera, tips:"摄像机", type:Laya.Camera, default:null}*/
    public camera: Laya.Camera;
    /** @prop {name:directionLight, tips:"平行光", type:Laya.DirectionLight, default:null}*/
    public directionLight: Laya.DirectionLight;
    /** @prop {name:playerA, tips:"角色A", type:Laya.Sprite3D, default:null}*/
    public playerA: Laya.Sprite3D;
    /** @prop {name:playerB, tips:"角色B", type:Laya.Sprite3D, default:null}*/
    public playerB: Laya.Sprite3D;
    //#endregion
    
    /** @prop {name:gamePad, tips:"按钮", type:Node, default:null}*/
    public gamePad: Laya.Node;
    /** @prop {name:logNode, tips:"可视化日志", type:Node, default:null}*/
    public logNode: Laya.Node;
    public logText: Laya.Text;
    private content: string;

    constructor() { 
        super();

        // Laya.stage.screenMode = "horizontal"; //自动横屏
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
            this.playerA = scene.getChildByName("RPG-CharacterA") as Laya.Sprite3D;
            this.playerA.addComponent(PlayerController);
            this.playerB = scene.getChildByName("RPG-CharacterB") as Laya.Sprite3D;  
            // this.playerB.addComponent(PlayerController);
        }));
    }

    onStart(): void {
        var device_type = navigator.userAgent; //获取userAgent信息
        console.log(device_type); //Mozilla/5.0 (Windows NT 10.0
        // var md = new MobileDetect(device_type);//初始化mobile-detect
        // var os = md.os();//获取系统
    }

    //#region 做成prefab

    onAwake(): void {
        this.content = "";
        this.logText = this.logNode as Laya.Text;
        Laya.stage.on(Laya.Event.DOUBLE_CLICK, this, this.resetConsole);
    }

    private lastmsg: string;
    public vConsole(msg: string): void {
        if(msg == this.lastmsg) {
            // this.content += "+1";
        } else {
            this.content += "\n" + msg;
        }
        this.logText.text = this.content;
        this.lastmsg = msg;
    }

    public resetConsole(): void {
        this.content = "";
        this.logText.text = this.content;
    }

    //#endregion
}