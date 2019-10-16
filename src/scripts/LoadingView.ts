import {ui} from "../ui/layaMaxUI";

export default class LoadingView extends ui.LoadingUI {
    private static instance: LoadingView;
    public static getInstance(): LoadingView {
        if(this.instance == null) {
            this.instance = new LoadingView();
        }
        return this.instance;
	}

    constructor() {
        super();
    }

    onEnable(): void {
        Laya.timer.frameLoop(1, this, ()=> {
            this.loadingImage.rotation += 5;
            // console.log("旋转中.."); //不手动停止会一直执行
        });
    }

    onDisable(): void {
        Laya.timer.clearAll(this);
    }
}