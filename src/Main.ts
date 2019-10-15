import GameConfig from "./GameConfig";
import LoadView from "./scripts/LoadView";
import JoystickView from "./scripts/JoystickView";
import LoadingView from "./scripts/LoadingView";

class Main {
	constructor() {
		//TS或JS版本初始化微信小游戏的适配
		if(Laya.Browser.onWeiXin) {
			console.log("微信浏览器");
			Laya.MiniAdpter.init();
			// 远程动态资源，及本地白名单
			Laya.URL.basePath = "http://192.168.1.101/remote/"; //设置这句，所有资源路径默认都走远程
			Laya["MiniAdpter"].nativefiles = [ //通过白名单，让部分资源走本地
				"wxlocal",
				"ui.json",
				"res/atlas/comp.atlas",
				"res/atlas/comp.png",
				"res/atlas/ui.atlas",
				"res/atlas/ui.png",
			];
		} else {
			console.log("普通浏览器");
		}

		// 根据IDE设置初始化引擎
	 	if (window["Laya3D"]) {
			console.log("Laya3D");
			Laya3D.init(GameConfig.width, GameConfig.height);
		}
		else {
			console.log("WebGL");
			Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		}
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
			
            //添加3D场景
            scene3d = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
            //添加照相机
            var camera: Laya.Camera = (scene3d.addChild(new Laya.Camera(0, 0.3, 1000))) as Laya.Camera;
            camera.transform.translate(new Laya.Vector3(6, 2, 0));
			camera.transform.rotate(new Laya.Vector3(3, 90, 0), true, false);
			// camera.transform.position = new Laya.Vector3(6, 2, 0);
			// camera.transform.rotationEuler = new Laya.Vector3(3, 90, 0);
            //添加方向光
            var pointLight: Laya.PointLight = scene3d.addChild(new Laya.PointLight()) as Laya.PointLight;
            // pointLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
            // pointLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
			pointLight.transform.position = new Laya.Vector3(1, 2, 0);
            pointLight.color = new Laya.Vector3(1, 0.9, 0.8);
            pointLight.intensity = 2;
			//加载精灵
			Laya.Sprite3D.load("remote/unity3d/RPG-Character.lh", Laya.Handler.create(this, (sp: Laya.Sprite3D)=> {
				playerA = scene3d.addChild(sp) as Laya.Sprite3D;
			}));
		}
		*/
	}
}
//激活启动类
new Main();
