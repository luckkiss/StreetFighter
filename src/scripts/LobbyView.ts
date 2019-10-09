import {ui} from "../ui/layaMaxUI";
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
	
    constructor() {
        super();
		this.createView(Laya.View.uiMap["Lobby"]);
        this.signBtn.on(Laya.Event.MOUSE_DOWN, this, this.onSign);
        this.matchBtn.on(Laya.Event.MOUSE_DOWN, this, this.onMatch);
    }

    onStart(): void {
		Laya.SoundManager.playMusic("res/audios/bgm.mp3", 0);
    }

    private onSign(): void {
        console.log("签到.");
    }

    private onMatch(): void {
        console.log("开始匹配...");
        Laya.timer.once(1000, this, this.onEnterGame);
    }

    private onEnterGame(): void {
		var mainView: MainView = new MainView(); //加载模式/内嵌模式
		Laya.stage.addChild(mainView);
		Laya.stage.removeChild(this);
    }
}