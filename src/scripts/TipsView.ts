import {ui} from "../ui/layaMaxUI";
/**
 * API
 * TipsView.getInstance().showText(1000, "hello world");
 */
export default class TipsView extends ui.TipsUI {
    public static getInstance(): TipsView {
        if(this.instance == null) {
            this.instance = new TipsView();
        }
        return this.instance;
	}
	/*界面实例*/
    private static instance: TipsView;

    private delay: number = 0;

    constructor() {
        super();
    }
    
    public showText(timer: number, msg: string): void {
        this.messageText.text = msg;
        this.delay = timer;
        this.bgImage.width = 24 * msg.length;
        Laya.stage.addChild(TipsView.getInstance());
        if(this.delay > 0)
            Laya.timer.once(this.delay, this, this.autoDestroy);
    }

    private autoDestroy(): void {
        console.log("自动销毁");
        Laya.stage.removeChild(this);
    }
}