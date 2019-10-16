
import LoadingView from "./scripts/LoadingView";

export default class WebSocketClient extends Laya.Script {
    private static instance: WebSocketClient;
    public static getInstance(): WebSocketClient {
        if (this.instance == null) {
            this.instance = new WebSocketClient();
        }
        return this.instance;
    }

    private url: string = "ws://192.168.1.101:3001";
    private socket: Laya.Socket;
    private byte: Laya.Byte;
    private timeout: number = 5000;

    constructor() {
        super();
    }

    public initSocket(): void {
        if (this.isConnected) {
            console.log("网络状态良好");
            return;
        }
        this.byte = new Laya.Byte();
        this.byte.endian = Laya.Byte.LITTLE_ENDIAN; //大小端，这里我们采用小端
        this.socket = new Laya.Socket();
        this.socket.endian = Laya.Byte.LITTLE_ENDIAN;
        Laya.stage.addChild(LoadingView.getInstance());
        this.socket.connectByUrl(this.url);
        this.socket.on(Laya.Event.OPEN, this, this.openHandler);
        this.socket.on(Laya.Event.MESSAGE, this, this.receiveHandler);
        this.socket.on(Laya.Event.CLOSE, this, this.closeHandler);
        this.socket.on(Laya.Event.ERROR, this, this.errorHandler);
    }

    public get isConnected(): boolean {
        if (this.socket != null && this.socket.connected) {
            return true;
        }
        return false;
    }

    public reconnect(): void {
        if (this.socket == null) {
            console.log("新建socket");
            this.socket = new Laya.Socket();
            this.socket.endian = Laya.Byte.LITTLE_ENDIAN;
            this.socket.on(Laya.Event.OPEN, this, this.openHandler);
            this.socket.on(Laya.Event.MESSAGE, this, this.receiveHandler);
            this.socket.on(Laya.Event.CLOSE, this, this.closeHandler);
            this.socket.on(Laya.Event.ERROR, this, this.errorHandler);
        }
        Laya.stage.addChild(LoadingView.getInstance());
        this.socket.connectByUrl(this.url);
        console.log("重连一次");
    }

    public disconnect(): void {
        if (this.socket != null) {
            this.socket.close();
        }
    }

    public sendData(obj): void {
        if (!this.isConnected) {
            console.error("已断开，无法发送");
            return;
        }
        this.socket.send(JSON.stringify(obj));
    }

    // 正确建立连接
    private openHandler(event: any = null): void {
        console.log("正确建立连接；");

        // 推送消息
        var obj: Object = {
            "type": "connected"
        };
        Laya.stage.event("nethandle", obj);

        //连接成功后的处理,一般是启动心跳包
        this.sendHeart();
    }

    // 接收到数据触发函数
    private receiveHandler(msg: any = null): void {
        // console.log("接收到数据触发函数:", msg);
        var obj = JSON.parse(msg);
        switch (obj.type) {
            case "boop": { //心跳包由内部处理
                // console.log("收到心跳");
                break;
            }
            default: {
                Laya.stage.event("nethandle", obj);
                break;
            }
        }
        this.resetHeart();
    }

    // 关闭事件
    private closeHandler(e: any = null): void {
        console.log("连接关闭");
        this.reconnect();
    }

    // 连接出错
    private errorHandler(e: any = null): void {
        console.log("连接出错");
        this.reconnect();
    }

    private sendHeart(): void {
        // console.log("发送一次心跳");
        var obj: Object = {
            "type": "beep",
        };
        this.sendData(obj);
    }

    private startHeart(): void {
        // console.log("开启心跳");
        Laya.timer.loop(this.timeout, this, this.sendHeart);
    }
    private resetHeart(): void {
        // console.log("重置心跳");
        Laya.timer.clear(this, this.sendHeart);
        this.startHeart();
    }
}