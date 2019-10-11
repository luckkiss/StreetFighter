import {ui} from "../ui/layaMaxUI";

export default class LoadingView extends ui.LoadingUI {
    public static getInstance(): LoadingView {
        if(this.instance == null) {
            this.instance = new LoadingView();
        }
        return this.instance;
	}
	/*界面实例*/
    private static instance: LoadingView;

    constructor() {
        super();

        Laya.timer.frameLoop(1, this, ()=> {
            this.loadingImage.rotation += 5;
        });
    }
}