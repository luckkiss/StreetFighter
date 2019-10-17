import {ui} from "../ui/layaMaxUI";
import LobbyView from "./LobbyView";

export default class LoadView extends ui.LoadUI {
    private static instance: LoadView;
	public static getInstance(): LoadView {
        if(this.instance == null) {
            this.instance = new LoadView();
        }
        return this.instance;
	}
	
    constructor() {
		super();
		this.progressBar.value = 0;
		this.progressLabel.text = "0%";
		Laya.timer.once(1000, this, this.onProLoaded);
	}
	
    public hide(): void {
        // Laya.stage.offAll();
		Laya.timer.clearAll(this);
		this.removeSelf();
	}
	
	//#region 启动进度条

    private onProLoaded(): void {
        var res: Array<any> = [
			{url:"res/atlas/ui.atlas",  type:Laya.Loader.ATLAS},
			{url:"res/atlas/ui.png",  type:Laya.Loader.IMAGE},
			{url:"remote/audios/bgm.mp3",  type:Laya.Loader.SOUND},
        ];
		// Handler第4个参数为true，根据加载文件个数获取加载进度
		Laya.loader.load(res, null, Laya.Handler.create(this, this.onProgress, null, false));
	}
	
    // 加载过程
    private onProgress(pro: number): void {
		this.progressBar.value = pro;
		this.progressLabel.text = Math.floor(pro * 100) + "%";
		if(this.progressBar.value == 1) {
			this.progressBar.value = pro;
			Laya.timer.once(1000, this, this.onComplete);
		}
	}
	
    // 加载完成
    private onComplete(): void {
		this.hide(); //先清理，避免消除了下一个View中的监听
		Laya.stage.addChild(LobbyView.getInstance());
	}

	//#endregion
}