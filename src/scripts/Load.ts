import GameConfig from "../GameConfig";
    
export default class Load extends Laya.Script {
	
    /** @prop {name:progressNode, tips:"进度条", type:Node, default:null}*/
	public progressNode: Laya.Node;
    private progressBar: Laya.ProgressBar; //进度条属性
    
    constructor() {
        super();
        // this.onInit();
	}
	
	onStart(): void {
		Laya.timer.once(1000, this, this.onProLoaded);
        // this.onProLoaded();
	}
    
	//#region 启动进度条

	public onInit(): void {

		/* 已经在Load.scene中有了
		//开始加载进度条
        //进度条资源加载
        var pro_res: Array<any> = [
            {url:"res/atlas/progress_time$bar.png", type:Laya.Loader.IMAGE}, //进度条的图片资源位置和类型
            {url:"res/atlas/progress_time.png", type:Laya.Loader.IMAGE} //进度条的图片资源位置和类型       
        ];
        //加载完进度条后执行onProLoaded方法
		Laya.loader.load(pro_res, Laya.Handler.create(this,this.onProLoaded));
		*/

        //加载图片
       	// Laya.loader.load(res, Laya.Handler.create(this,this.onLoad));  //加载完以后会有一个回调函数
	}

    //加载进度条图片资源的同时，回调函数触发下面的方法加载主游戏资源
    public onProLoaded(): void {

        //显示进度条图片
		this.progressShow();
		
        //预加载主游戏页面图片资源数组
        var res: Array<any> = [ 
			// {url:"res/atlas/ui.json", type:Laya.Loader.ATLAS},
			// {url:"res/atlas/ui.png",  type:Laya.Loader.IMAGE},
			// {url:"res/atlas/bg.mp3",  type:Laya.Loader.SOUND},
			// {url:"res/atlas/hit.wav", type:Laya.Loader.SOUND}
			{url:"res/atlas/comp.atlas",  type:Laya.Loader.ATLAS},
			{url:"res/atlas/comp.png",  type:Laya.Loader.IMAGE},
			{url:"res/atlas/bg.mp3",  type:Laya.Loader.SOUND},
        ];

		//设置progress Handler的第4个参数为true，根据加载文件个数获取加载进度
		Laya.loader.load(res, null, Laya.Handler.create(this, this.onProgress, null, false));
	}
	
    //显示开始游戏加载进度条
    public progressShow(): void {

        // 和text一样，需要先new一个进度条对象
        // this.progressBar = new Laya.ProgressBar("res/atlas/progress_time.png");
        // this.progressBar.width = 400;
        // this.progressBar.pos(130,500);
		// this.progressBar.sizeGrid = "5,5,5,5";
		
		// 从场景中获得进度条
		console.log("progressNode: ", (this.progressNode != null));
		this.progressBar = this.progressNode as Laya.ProgressBar;
		console.log("progressBar: ", (this.progressBar != null));
		this.progressBar.value = 0;

        //当进度条发生变化的时候，我们需要下面的方法来监听其变化
        this.progressBar.changeHandler = new Laya.Handler(this, this.onChange);
        //添加进度条到舞台上
        Laya.stage.addChild(this.progressBar);
    }
	
    // 主游戏界面加载完成后的回调函数
    public onProgress(pro: number): void {
		//console.log("加载了总文件的:" + pro * 100 + "%");
		this.progressBar.value = pro;
		if(this.progressBar.value == 1) {
			// 游戏主页面资源加载完成后执行这里的代码
			// console.log("游戏加载完成咯！！");
			// 延迟1秒再显示游戏主页面
			this.progressBar.value = pro;
			Laya.timer.once(1000, this, this.onLoad);
			// this.progressBar.visible = false;
		   	// laya.media.SoundManager.playMusic("res/atlas/bg.mp3", 0);       
		}
	}
	
    // 进度条发生变化的时候触发下面的方法
    public onChange(value: number): void {
		console.log("进度: " + Math.floor(value * 100) + "%");
	}

    // 加载完成后的回调函数
    public onLoad(): void {
		// laya.media.SoundManager.playMusic("res/atlas/bg.mp3", 0);
		Laya.SoundManager.playMusic("res/atlas/bg.mp3", 0);

		// 移除进度条
		Laya.stage.removeChild(this.progressBar);

	   	// 实例化游戏开始界面
		// this.GameStart = new GamStart(); //注意哦，这里的GameStart是静态属性，所以访问的时候不能用this了，只能用GameMain类，
		// Laya.stage.addChild(GameMain.GameStart);

		//加载IDE指定的场景
		// GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
		GameConfig.startScene && Laya.Scene.open("Main.scene");
	}

	//#endregion
}