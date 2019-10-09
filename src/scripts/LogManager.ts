export default class LogManager extends Laya.Script { //相当于unity的MonoBehavior
    public static instance: LogManager;
    
    /** @prop {name:gamePad, tips:"按钮", type:Node, default:null}*/
    public gamePad: Laya.Node;
    /** @prop {name:logNode, tips:"可视化日志", type:Node, default:null}*/
    public logNode: Laya.Node;
    public logText: Laya.Text;
    private content: string;

    constructor() { 
        super();
        // Laya.stage.screenMode = "horizontal"; //自动横屏
        LogManager.instance = this;
    }

    //#region 做成prefab

    onAwake(): void {
        this.content = "";
        this.logText = this.logNode as Laya.Text;
        Laya.stage.on(Laya.Event.DOUBLE_CLICK, this, this.resetConsole);
    }

    private lastmsg: string;
    public vConsole(msg: string): void {
        if(msg == this.lastmsg) {
            // this.content += "+1";
        } else {
            this.content += "\n" + msg;
        }
        this.logText.text = this.content;
        this.lastmsg = msg;
    }

    public resetConsole(): void {
        this.content = "";
        this.logText.text = this.content;
    }

    //#endregion
}