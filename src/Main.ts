import GameConfig from "./GameConfig";
import LoadView from "./scripts/LoadView";
import JoystickView from "./scripts/JoystickView";
import LoadingView from "./scripts/LoadingView";

class Main {
	constructor() {
		if(Laya.Browser.onWeiXin) {
			//TS或JS版本初始化微信小游戏的适配
			Laya.MiniAdpter.init();
		}
		// 根据IDE设置初始化引擎
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError = true;

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	}

	onConfigLoaded(): void {
		//加载IDE指定的场景
		// GameConfig.startScene && Laya.Scene.open(GameConfig.startScene); //文件模式
		
        // 预加载主游戏页面图片资源数组
        var res: Array<any> = [
			{url:"ui.json",  type:Laya.Loader.JSON},
			{url:"res/atlas/comp.atlas",  type:Laya.Loader.ATLAS},
			{url:"res/atlas/comp.png",  type:Laya.Loader.IMAGE},
			{url:"res/atlas/ui.atlas",  type:Laya.Loader.ATLAS},
			{url:"res/atlas/ui.png",  type:Laya.Loader.IMAGE},
        ];
		Laya.loader.load(res, Laya.Handler.create(this, this.onLoaded));
	}

	onLoaded(): void {
		Laya.View.uiMap = Laya.Loader.getRes("ui.json"); //ui.json赋值
		var loadView = new LoadView(); //加载模式/内嵌模式
		Laya.stage.addChild(loadView);

		/* 测试代码
		{
			var scene3d: Laya.Scene3D;
			var playerA: Laya.Sprite3D;
			Laya.Scene3D.load("res/unity3d/Empty.ls", Laya.Handler.create(this, (sc: Laya.Scene3D)=> {
				scene3d = sc;
				scene3d.zOrder = -1;
				Laya.stage.addChild(scene3d);
				console.log("场景加载完成");
				//加载精灵
				Laya.Sprite3D.load("res/unity3d/RPG-Character.lh", Laya.Handler.create(this, (sp: Laya.Sprite3D)=> {
					playerA = scene3d.addChild(sp) as Laya.Sprite3D;
				}));
			}));
		}*/
	}
}
//激活启动类
new Main();
