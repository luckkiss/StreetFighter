
import LoadingView from "./scripts/LoadingView";

export default class WebSocketClient extends Laya.Script {
    public static getInstance(): WebSocketClient {
        if(this.instance == null) {
            this.instance = new WebSocketClient();
        }
        return this.instance;
	}
	/*界面实例*/
    private static instance: WebSocketClient;
    
    private url: string = "ws://192.168.1.101:3001";
    private socket: Laya.Socket;
    private byte: Laya.Byte;

    constructor() {
        super();
    }

    public get isConnected(): boolean {
        if(this.socket != null && this.socket.connected) {
            return true;
        }
        return false;
    }

    public reconnect(): void {
        if(this.socket == null)
            this.socket = new Laya.Socket();
        this.socket.connectByUrl(this.url);
    }

    public initSocket(): void {
        if(WebSocketClient.getInstance().isConnected) {
            console.log("网络状态良好");
            return;
        }
        this.byte = new Laya.Byte();
        //大小端，这里我们采用小端
        this.byte.endian = Laya.Byte.LITTLE_ENDIAN;
        this.socket = new Laya.Socket();
        //这里我们采用小端
        this.socket.endian = Laya.Byte.LITTLE_ENDIAN;
        //建立连接
        Laya.stage.addChild(LoadingView.getInstance());
        this.socket.connectByUrl(this.url);
        this.socket.on(Laya.Event.OPEN, this, this.openHandler);
        this.socket.on(Laya.Event.MESSAGE, this, this.receiveHandler);
        this.socket.on(Laya.Event.CLOSE, this, this.closeHandler);
        this.socket.on(Laya.Event.ERROR, this, this.errorHandler);
    }

    public sendData(obj): void {
        if(!this.socket.connected) {
            console.error("已经断开连接."); //TODO:重连
            return;
        }
        this.socket.send(JSON.stringify(obj));
    }

    private openHandler(event: any = null): void {
        //正确建立连接；
        console.log("正确建立连接；");
        var obj: Object = {
            "type": "connected"
        };
        Laya.stage.event("nethandle", obj);
    }

    private receiveHandler(msg: any = null): void {
        ///接收到数据触发函数
        // console.log("接收到数据触发函数:", msg);
        //解包
        var obj = JSON.parse(msg);
        //notify到外部统一处理
        Laya.stage.event("nethandle", obj);
    }

    private closeHandler(e: any = null): void {
        //关闭事件
        console.log("关闭事件");
    }

    private errorHandler(e: any = null): void {
        //连接出错
        console.log("连接出错");
    }
}