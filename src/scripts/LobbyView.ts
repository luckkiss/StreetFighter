import {ui} from "../ui/layaMaxUI";
import MainView from "./MainView";
import WebSocketClient from "../WebSocketClient";

export default class LobbyView extends ui.LobbyUI {
    public static getInstance(): LobbyView {
        if(this.instance == null) {
            this.instance = new LobbyView();
        }
        return this.instance;
	}
	/*界面实例*/
    private static instance: LobbyView;
    
    private client: WebSocketClient = null;
    private uid: string = null;

    constructor() {
        super();
        this.createView(Laya.View.uiMap["Lobby"]);

        Laya.SoundManager.playMusic("res/audios/bgm.mp3", 0);
        Laya.SoundManager.autoStopMusic = true; //手机浏览器最小化，还有声音
        console.log("播放音乐.");
        
        // 添加WebSocket
        this.client = WebSocketClient.getInstance();
        this.client.initSocket();
        // 添加网络监听
        Laya.stage.offAll("nethandle");
        Laya.stage.on("nethandle", this, this.handle);

        // UI监听注册
        this.nicknameInput.on(Laya.Event.BLUR, this, ()=> {
            console.log("网络校验昵称 3");
        });
        this.registerBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendRegister);
        this.awardPanel.visible = false;
        this.signBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendSign);
        this.closeAwardBtn.on(Laya.Event.MOUSE_DOWN, this, ()=> {
            this.awardPanel.visible = false;
        });
        this.matchBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendMatch);
        
        // 获取用户信息
        // Laya.LocalStorage.clear();
        // Laya.LocalStorage.setItem("uid", "hahaha");
        this.uid = Laya.LocalStorage.getItem("uid");
        // console.log("用户信息：" + this.uid);
        this.registerPanel.visible = this.uid == null; //弹出注册页面
    }

    private handle(obj): void {
        // console.log("recive: " + obj.type + ": " + obj.data);
        switch(obj.type) {
            case "sc_enter": { //建立连接
                console.log("建立连接");
                //TODO: 关闭转圈页
                if(this.uid != null) {
                    this.sendLogin();
                }
                break;
            }
            case "sc_login_success": { //登录成功
                console.log("登陆成功，写入cookie：" + obj.uid);
                Laya.LocalStorage.setItem("uid", obj.uid);
                this.registerPanel.visible = false;
                this.nickNameText.text = obj.nickname;
                break;
            }
            case "sc_login_failed": { //登录失败
                console.log("登陆失败");
                break;
            }
            case "sc_match_success": { //匹配成功
                console.log("匹配成功");
                Laya.timer.once(1000, this, this.onEnterGame);
                break;
            }
            case "sc_match_failed": { //匹配失败
                console.log("匹配失败");
                break;
            }
            case "sc_sign_success": { //签到成功
                console.log("签到成功，看广告x2");
                this.awardPanel.visible = true;
                break;
            }
            case "sc_message": { //聊天消息
                break;
            }
        }
    }

    //#region 本地方法

    // 校验昵称
    private sendCheckNickName(): void {
        var obj: Object = {
            "type": "cs_check_register",
            "nick": this.nicknameInput.text,
        };
        this.client.sendData(obj);
    }

    // 注册用户
    private sendRegister(): void {
        // 本地校验
        if(this.nicknameInput.text.length < 2 || this.nicknameInput.text.length > 12) {
            console.log("用户名应为2-12个字符");
            return;
        }
        if(this.passwordInput.text.length < 6 || this.passwordInput.text.length > 16) {
            console.log("密码应为6-16个字符");
            return;
        }
        if(this.password2Input.text != this.passwordInput.text) {
            console.log("两次密码输入不一致");
            return;
        }

        var obj: Object = {
            "type": "cs_register",
            "nick": this.nicknameInput.text,
            "pwd": this.password2Input.text,
        };
        this.client.sendData(obj);
    }

    // 自动登录
    private sendLogin(): void {
        var obj: Object = {
            "type": "cs_login",
            "uid": Laya.LocalStorage.getItem("uid"),
        };
        this.client.sendData(obj);
    }

    // 改名、改颜色
    private setUserData(): void {}

    // 每日签到
    private sendSign(): void {
        var obj: Object = {
            "type": "cs_sign",
            "uid": Laya.LocalStorage.getItem("uid"),
        };
        this.client.sendData(obj);
    }

    // 开始匹配
    private sendMatch(): void {
        var obj: Object = {
            "type": "cs_match",
            "uid": Laya.LocalStorage.getItem("uid"),
        };
        this.client.sendData(obj);
    }

    //#endregion
    
    //#region 网络回调

    private onCheckRegister(): void {
        console.log("昵称检查结果.");
    }

    private onCheckSign(): void {
        console.log("检查当天签到.");
    }

    private onSign(): void {}

    private onMatch(): void {}
    
    private onEnterGame(): void {
		var mainView: MainView = new MainView(); //加载模式/内嵌模式
        Laya.stage.addChild(mainView);
        Laya.stage.removeChild(this);
        // Laya.stage.offAll();
    }

    //#endregion
}