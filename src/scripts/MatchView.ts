import {ui} from "../ui/layaMaxUI";
import PlayerController from "./PlayerController";
import JoystickView from "./JoystickView";
import LobbyView from "./LobbyView";
import WebSocketClient from "../WebSocketClient";

export default class MainView extends ui.MatchUI {
	/*界面实例*/
    public static instance: MainView;
    
    private joystick: JoystickView;

    /*3D场景*/
    public scene3d: Laya.Scene3D;
    public playerA: Laya.Sprite3D;
    public playerB: Laya.Sprite3D;
    
    constructor() {
        super();
        this.createView(Laya.View.uiMap["Main"]);
        MainView.instance = this;

        // 添加摇杆
        this.joystick = new JoystickView(); //加载模式/内嵌模式
        Laya.stage.addChild(this.joystick);

        // 添加3D场景
        // https://ldc2.layabox.com/doc/?nav=zh-ts-4-3-1
        Laya.Scene3D.load("res/scenes/Empty.ls", Laya.Handler.create(this, this.onScene3DComplete));

        this.exitBtn.on(Laya.Event.MOUSE_DOWN, this, ()=> {
            Laya.stage.removeChild(this.scene3d);
            Laya.stage.removeChild(this.playerA);
            Laya.stage.removeChild(this.joystick);
            Laya.stage.removeChild(this);
            var lobbyView = new LobbyView(); //加载模式/内嵌模式
            Laya.stage.addChild(lobbyView);
            console.log("离开游戏");
        });
    }

    onScene3DComplete(sc: Laya.Scene3D): void {
        this.scene3d = sc;
        this.scene3d.zOrder = -1;
        Laya.stage.addChild(this.scene3d);
        // console.log("场景加载完成");
        //加载精灵
        Laya.Sprite3D.load("res/prefabs/RPG-CharacterA.lh", Laya.Handler.create(this, this.onPlayerAComplete));
    }

    onPlayerAComplete(sp: Laya.Sprite3D): void {
        // console.log("3D精灵加载完成");
        if(this.playerA == null) {
            this.playerA = this.scene3d.addChild(sp) as Laya.Sprite3D;
            this.playerA.addComponent(PlayerController);
        }
    }
}