import GameConfig from "./GameConfig";

export default class WebSocketClient extends Laya.Script {
    public static getInstance(): WebSocketClient {
        if(this.instance == null) {
            this.instance = new WebSocketClient();
        }
        return this.instance;
	}
	/*界面实例*/
    private static instance: WebSocketClient;
    
    private socket: Laya.Socket;
    private byte: Laya.Byte;

    constructor() {
        super();
    }

    public initSocket(): void {
        this.byte = new Laya.Byte();
        //大小端，这里我们采用小端
        this.byte.endian = Laya.Byte.LITTLE_ENDIAN;
        this.socket = new Laya.Socket();
        //这里我们采用小端
        this.socket.endian = Laya.Byte.LITTLE_ENDIAN;
        //建立连接
        // var url: string = "ws://127.0.0.1:3000/socket.io/?EIO=4&transport=websocket";
        var url: string = "ws://192.168.1.101:3001";
        this.socket.connectByUrl(url);
        this.socket.on(Laya.Event.OPEN, this, this.openHandler);
        this.socket.on(Laya.Event.MESSAGE, this, this.receiveHandler);
        this.socket.on(Laya.Event.CLOSE, this, this.closeHandler);
        this.socket.on(Laya.Event.ERROR, this, this.errorHandler);
    }

    private openHandler(event: any = null): void {
        //正确建立连接；
        console.log("正确建立连接；");
    }

    private receiveHandler(msg: any = null): void {
        ///接收到数据触发函数
        console.log("接收到数据触发函数:", msg);
    }

    private closeHandler(e: any = null): void {
        //关闭事件
        console.log("关闭事件");
    }

    private errorHandler(e: any = null): void {
        //连接出错
        console.log("连接出错");
    }

    // 开始匹配
    public sendMatch(): void {
        if(!this.socket.connected) {
            console.error("已经断开连接.");
            return;
        }
        
        var msgClients: Object = {
            "type": "message",
            "data": "hello",
        };
        this.socket.send(JSON.stringify(msgClients));
    }

    //#region 本地方法

    // 改名、改颜色
    public setUserData(): void {

    }

    //#endregion

}