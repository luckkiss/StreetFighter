import {ui} from "../ui/layaMaxUI";
import PlayerController from "./PlayerController";
    
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
    private playerA: Laya.Sprite3D;
    private playerB: Laya.Sprite3D;
    
    constructor() {
        super();
		this.createView(Laya.View.uiMap["Main"]);

        // 添加3D场景
        // https://ldc2.layabox.com/doc/?nav=zh-ts-4-3-1
        Laya.Scene3D.load("res/scenes/Empty.ls", Laya.Handler.create(this, function(sc: Laya.Scene3D) {
            this.scene3d = sc;
            this.scene3d.zOrder = -1;
            this.stage.addChild(this.scene3d);
            //添加照相机
            // this.camera = (this.scene3d.getChildByName("Main Camera")) as Laya.Camera;
            //加载精灵
            Laya.Sprite3D.load("res/prefabs/RPG-CharacterA.lh", Laya.Handler.create(this, function(sp: Laya.Sprite3D) {
                var layaMonkey2 = this.scene3d.addChild(sp) as Laya.Sprite3D;
            }));
        }));

        // this.PreloadingRes();
    }

    //批量预加载方式
    PreloadingRes(): void {
        //预加载所有资源
        var resource: Array<any> = [
			{url:"res/scenes/Empty.ls",  type:Laya.Scene3D},
			{url:"res/prefabs/RPG-CharacterA.lh",  type:Laya.Sprite3D},
        ];
        Laya.loader.create(resource, Laya.Handler.create(this, this.onPreLoadFinish));
    }
    
    onPreLoadFinish(): void {
        //初始化3D场景
        this.scene3d = Laya.stage.addChild(Laya.Loader.getRes("res/scenes/Empty.ls")) as Laya.Scene3D;
        //使用精灵
        var sp = Laya.Loader.getRes("res/prefabs/RPG-CharacterA.lh") as Laya.Sprite3D;
        var layaMonkey2 = this.scene3d.addChild(sp) as Laya.Sprite3D;
    }
}