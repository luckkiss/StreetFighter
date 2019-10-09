import {ui} from "../ui/layaMaxUI";

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
    }
}