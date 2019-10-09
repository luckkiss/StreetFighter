import {ui} from "../ui/layaMaxUI";
import WebSocketClient from "../WebSocketClient";
import MainView from "./MainView";

export default class LobbyView extends ui.LobbyUI {
    public static getInstance(): LobbyView {
        if(this.instance == null) {
            this.instance = new LobbyView();
        }
        return this.instance;
	}
	/*界面实例*/
    private static instance: LobbyView;
    
    private client: WebSocketClient = null;

    constructor() {
        super();
		this.createView(Laya.View.uiMap["Lobby"]);
        this.signBtn.on(Laya.Event.MOUSE_DOWN, this, this.onSign);
        this.matchBtn.on(Laya.Event.MOUSE_DOWN, this, this.onMatch);
        
        Laya.SoundManager.playMusic("res/audios/bgm.mp3", 0);
        Laya.SoundManager.autoStopMusic = true; //手机浏览器最小化，还有声音
        console.log("播放音乐");
        
        // 添加WebSocket
        this.client = WebSocketClient.getInstance();
        console.log("client: ", this.client != null);
        this.client.initSocket();
    }

    private onSign(): void {
        console.log("签到.");
    }

    private onMatch(): void {
        console.log("开始匹配...");
        this.client.sendMatch();
        Laya.timer.once(1000, this, this.onEnterGame);
    }

    private onEnterGame(): void {
		var mainView: MainView = new MainView(); //加载模式/内嵌模式
        Laya.stage.addChild(mainView);
        // Laya.stage.addChild(MainView.getInstance());
		Laya.stage.removeChild(this);
    }
}