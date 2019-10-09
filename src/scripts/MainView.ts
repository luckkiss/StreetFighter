import {ui} from "../ui/layaMaxUI";
import PlayerController from "./PlayerController";
import TestScript from "./TestScript";
import LobbyView from "./LobbyView";
    
export default class MainView extends ui.MainUI {
    public static getInstance(): MainView {
        if(this.instance == null) {
            this.instance = new MainView();
        }
        return this.instance;
	}
	/*界面实例*/
    private static instance: MainView;
	
    /*3D场景*/
    public scene3d: Laya.Scene3D;
    public playerA: Laya.Sprite3D;
    public playerB: Laya.Sprite3D;
    
    constructor() {
        super();
		this.createView(Laya.View.uiMap["Main"]);

        // 添加3D场景
        // https://ldc2.layabox.com/doc/?nav=zh-ts-4-3-1
        Laya.Scene3D.load("res/scenes/Empty.ls", Laya.Handler.create(this, function(sc: Laya.Scene3D) {
            this.scene3d = sc;
            this.scene3d.zOrder = -1;
            this.stage.addChild(this.scene3d);
            //加载精灵
            Laya.Sprite3D.load("res/prefabs/RPG-CharacterA.lh", Laya.Handler.create(this, function(sp: Laya.Sprite3D) {
                this.playerA = this.scene3d.addChild(sp) as Laya.Sprite3D;
                this.playerA.addComponent(TestScript);
            }));
        }));

        this.exitBtn.on(Laya.Event.MOUSE_DOWN, this, ()=> {
            Laya.stage.removeChild(this.scene3d);
            Laya.stage.removeChild(this.playerA);
            Laya.stage.removeChild(this);
            var lobbyView = new LobbyView(); //加载模式/内嵌模式
            Laya.stage.addChild(lobbyView);
            console.log("离开游戏");
        });
    }
}