import {ui} from "../ui/layaMaxUI";
/**
 * API
 * TipsView.getInstance().showText(1000, "hello world");
 */
export default class TipsView extends ui.TipsUI {
    private static instance: TipsView;
    public static getInstance(): TipsView {
        if(this.instance == null) {
            this.instance = new TipsView();
        }
        return this.instance;
	}

    private delay: number = 1000;

    constructor() {
        super();
    }

    onDisable(): void {
        Laya.timer.clearAll(this);
    }
    
    public showText(tm: number = 1000, msg: string): void {
        // 多次点击反复调用时，记为最后一次
        Laya.timer.clearAll(this);

        this.bgImage.y = Laya.stage.height * 0.7;
        this.bgImage.alpha = 0;
        Laya.Tween.to(this.bgImage, {"y": Laya.stage.height * 0.5}, 200);
        Laya.Tween.to(this.bgImage, {"alpha": 1}, 300);

        this.messageText.text = msg;
        this.delay = tm;
        this.bgImage.width = 26 * msg.length;
        Laya.stage.addChild(TipsView.getInstance());
        if(this.delay > 0)
            Laya.timer.once(this.delay, this, this.autoDestroy);
    }

    private autoDestroy(): void {
        console.log("自动销毁");
        this.removeSelf();
    }
}