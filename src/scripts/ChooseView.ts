import {ui} from "../ui/layaMaxUI";

export default class ChooseView extends ui.ChooseUI {
    private static instance: ChooseView;
    public static getInstance(): ChooseView {
        if(this.instance == null) {
            this.instance = new ChooseView();
        }
        return this.instance;
    }
    
    constructor() { super(); }
    
    onDisable(): void {
        Laya.timer.clearAll(this);
    }
    
    public showDialog(msg,yes,no): void {
        this.yesBtn.centerX = 80;
        this.noBtn.visible = true;

        Laya.stage.addChild(this);
        this.msgText.text = msg;
        this.yesBtn.on(Laya.Event.MOUSE_DOWN, this, ()=> {
            if(yes != null)
                yes();
            this.removeSelf();
        });
        this.noBtn.on(Laya.Event.MOUSE_DOWN, this, ()=> {
            if(no != null)
                no();
            this.removeSelf();
        });
    }

    public showConfirm(msg,yes): void {
        this.yesBtn.centerX = 0;
        this.noBtn.visible = false;

        Laya.stage.addChild(this);
        this.msgText.text = msg;
        this.yesBtn.on(Laya.Event.MOUSE_DOWN, this, ()=> {
            if(yes != null)
                yes();
            this.removeSelf();
        });
    }
}