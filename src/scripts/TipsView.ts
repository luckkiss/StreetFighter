import {ui} from "../ui/layaMaxUI";

export default class TipsView extends ui.TipsUI {
    
    private delay: number = 0;

    constructor() {
        super();
    }
    
    public showText(msg: string, timer: number): void {
        this.messageText.text = msg;
        this.delay = timer;
        if(this.delay > 0)
            Laya.timer.once(this.delay, null, this.autoDestroy);
    }

    private autoDestroy(): void {
        Laya.stage.removeChild(this);
    }
}