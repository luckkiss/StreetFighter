import {ui} from "../ui/layaMaxUI";
import LobbyView from "./LobbyView";

export default class LoadView extends ui.LoadUI {
	public static getInstance(): LoadView {
        if(this.instance == null) {
            this.instance = new LoadView();
        }
        return this.instance;
	}
	/*界面实例*/
    private static instance: LoadView;
	
    constructor() {
		super();
		// this.createView(Laya.View.uiMap["Load"]);
		this.progressBar.value = 0;
		this.progressLabel.text = "0%";
		Laya.timer.once(1000, this, this.onProLoaded);
	}
	
	//#region 启动进度条

    public onProLoaded(): void {
        var res: Array<any> = [
			{url:"res/atlas/ui.atlas",  type:Laya.Loader.ATLAS},
			{url:"res/atlas/ui.png",  type:Laya.Loader.IMAGE},
			{url:"remote/audios/bgm.mp3",  type:Laya.Loader.SOUND}, //太大，通过网络加载
        ];
		// Handler第4个参数为true，根据加载文件个数获取加载进度
		Laya.loader.load(res, null, Laya.Handler.create(this, this.onProgress, null, false));
	}
	
    // 加载过程
    public onProgress(pro: number): void {
		this.progressBar.value = pro;
		this.progressLabel.text = Math.floor(pro * 100) + "%";
		if(this.progressBar.value == 1) {
			this.progressBar.value = pro;
			// 延迟1秒再显示游戏主页面
			Laya.timer.once(1000, this, this.onComplete);
		}
	}
	
    // 加载完成
    public onComplete(): void {
		console.log("加载完成，进入大厅");
		var lobbyView: LobbyView = new LobbyView(); //加载模式/内嵌模式
		Laya.stage.addChild(lobbyView);
		Laya.stage.removeChild(this);
	}

	//#endregion
}