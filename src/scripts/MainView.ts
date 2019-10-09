import {ui} from "../ui/layaMaxUI";
import PlayerController from "./PlayerController";
import TestScript from "./TestScript";
    
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
    private scene3d: Laya.Scene3D;
    private camera: Laya.Camera;
    private directionLight: Laya.DirectionLight;
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
    }
}