import GameConfig from "../GameConfig";
    
export default class Load extends Laya.Script {
	
    /** @prop {name:progressNode, tips:"进度条", type:Node, default:null}*/
	public progressNode: Laya.Node;
    public progressBar: Laya.ProgressBar;
    
	public progressLabel: Laya.Label;
	
    constructor() {
        super();
	}
	
	onAwake(): void {
		// 从场景中获得进度条
		this.progressBar = this.progressNode as Laya.ProgressBar;
		this.progressBar.value = 0;
		this.progressLabel = this.progressNode.getChildByName("Percent") as Laya.Label;
		console.log("progressLabel: ", (this.progressLabel != null));
        // 当进度条发生变化的时候，我们需要下面的方法来监听其变化
        this.progressBar.changeHandler = new Laya.Handler(this, this.onChange);
		
        // this.onProLoaded();
		Laya.timer.once(1000, this, this.onProLoaded);
	}
    
	//#region 启动进度条

    // 加载进度条图片资源的同时，回调函数触发下面的方法加载主游戏资源
    public onProLoaded(): void {

        // 预加载主游戏页面图片资源数组
        var res: Array<any> = [
			{url:"res/atlas/comp.atlas",  type:Laya.Loader.ATLAS},
			{url:"res/atlas/comp.png",  type:Laya.Loader.IMAGE},
			{url:"res/atlas/ui.atlas",  type:Laya.Loader.ATLAS},
			{url:"res/atlas/ui.png",  type:Laya.Loader.IMAGE},
			{url:"res/audios/bgm.mp3",  type:Laya.Loader.SOUND},
			// {url:"res/unity3d/LayaScene.ls",  type:Laya.Scene3D},
        ];

		// 设置progress Handler的第4个参数为true，根据加载文件个数获取加载进度
		Laya.loader.load(res, null, Laya.Handler.create(this, this.onProgress, null, false));
	}
	
    // 主游戏界面加载完成后的回调函数
    public onProgress(pro: number): void {
		// console.log("加载了总文件的:" + pro * 100 + "%");
		this.progressBar.value = pro;
		// this.progressLabel.text = Math.floor(pro * 100) + "%";

		if(this.progressBar.value == 1) {
			// 游戏主页面资源加载完成后执行这里的代码
			// console.log("游戏加载完成咯！！");
			// 延迟1秒再显示游戏主页面
			this.progressBar.value = pro;
			Laya.timer.once(1000, this, this.onLoad);
		}
	}
	
    // 进度条发生变化的时候触发下面的方法
    public onChange(value: number): void {
		console.log("进度: " + Math.floor(value * 100) + "%");
		this.progressLabel.text = Math.floor(value * 100) + "%";
	}

    // 加载完成后的回调函数
    public onLoad(): void {
		Laya.SoundManager.playMusic("res/audios/bgm.mp3", 0);

		// 移除进度条
		Laya.stage.removeChild(this.progressBar);

	   	// 实例化游戏开始界面
		// this.GameStart = new GamStart(); //注意哦，这里的GameStart是静态属性，所以访问的时候不能用this了，只能用GameMain类，
		// Laya.stage.addChild(GameMain.GameStart);

		// 加载IDE指定的场景
		GameConfig.startScene && Laya.Scene.open("Main.scene");
	}

	//#endregion
}