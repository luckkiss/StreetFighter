import {ui} from "../ui/layaMaxUI";
import MatchView from "./MatchView";
import TipsView from "./TipsView";
import LoadingView from "./LoadingView";
import WebSocketClient from "../WebSocketClient";
import UserData, { PlayerStatus } from "../backup/UserData";
// const crypto = require('crypto');

export default class LobbyView extends ui.LobbyUI {
    private static instance: LobbyView;
    
    private client: WebSocketClient = null;
    private uid: string = null;

    constructor() {
        super();
        LobbyView.instance = this;
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
        
        // UI初始化
        this.awardPanel.visible = false;
        this.loginPanel.visible = false;
        this.registerPanel.visible = false;
        this.matchPanel.visible = false;
        this.addUIListener();
        Laya.stage.addChild(LoadingView.getInstance());
    }

    private addUIListener(): void {
        // UI监听注册
        this.nicknameInput.on(Laya.Event.BLUR, this, ()=> {
            console.log("网络校验昵称 3");
        });
        this.goLoginBtn.on(Laya.Event.MOUSE_DOWN, this, ()=> {
            this.loginPanel.visible = true;
            this.registerPanel.visible = false;
            this.loginNickname.text = "";
            this.loginPassword.text = "";
        });
        this.goRegisterBtn.on(Laya.Event.MOUSE_DOWN, this, ()=> {
            this.loginPanel.visible = false;
            this.registerPanel.visible = true;
            this.nicknameInput.text = "";
            this.passwordInput.text = "";
            this.password2Input.text = "";
        });
        this.loginBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendLogin);
        this.registerBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendRegister);
        this.signBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendSign);
        this.closeAwardBtn.on(Laya.Event.MOUSE_DOWN, this, ()=> {
            this.awardPanel.visible = false;
        });
        this.matchBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendMatch);
        this.cancelMatchBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendCancelMatch);
        
        // 获取用户信息
        // Laya.LocalStorage.clear();
        this.uid = Laya.LocalStorage.getItem("uid");
        console.log("用户信息：" + this.uid);
        this.registerPanel.visible = (this.uid == null); //弹出注册页面
    }

    private handle(obj): void {
        switch(obj.type) {
            case "connected": { //建立连接
		        Laya.stage.removeChild(LoadingView.getInstance());
                if(this.uid != null) {
                    this.sendAutoLogin();
                }
                break;
            }
            case "sc_enter": { //用户进出
                break;
            }
            case "sc_message": { //聊天消息（示例）
                break;
            }
            case "sc_register_failed": { //注册失败
                TipsView.getInstance().showText(1000, "注册失败，昵称被占用");
                break;
            }
            case "sc_login_success": { //登录成功
                console.log("登陆成功，写入cookie：" + obj.uid + ": " + obj.pwd);
                Laya.LocalStorage.setItem("uid", obj.uid);
                Laya.LocalStorage.setItem("pwd", obj.pwd); //md5加密的
                this.loginPanel.visible = false;
                this.registerPanel.visible = false;
                this.nickNameText.text = obj.nickname;
                UserData.getInstance().playerStatus = PlayerStatus.FREE;
                break;
            }
            case "sc_login_failed": { //登录失败
                TipsView.getInstance().showText(1000, "登陆失败");
                UserData.getInstance().playerStatus = PlayerStatus.DISCONNECT;
                break;
            }
            case "sc_sign_success": { //签到成功
                console.log("签到成功，看广告x2");
                this.awardPanel.visible = true;
                break;
            }
            case "sc_sign_failed": { //签到失败
                if(obj.code == 1) {
                    TipsView.getInstance().showText(1000, "今日已签到");
                } else if (obj.code == 2) {
                    TipsView.getInstance().showText(1000, "签到失败");
                }
                break;
            }
            case "sc_match_success": { //匹配成功
                console.log("匹配成功");
                Laya.timer.once(1000, this, this.onEnterGame);
                UserData.getInstance().playerStatus = PlayerStatus.GAME;
                break;
            }
            case "sc_match_cancel": { //取消匹配
                // TipsView.getInstance().showText(1000, "取消匹配");
                UserData.getInstance().playerStatus = PlayerStatus.FREE;
                this.matchPanel.visible = false;
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
            TipsView.getInstance().showText(1000, "用户名应为2-12个字符");
            return;
        }
        if(this.passwordInput.text.length < 6 || this.passwordInput.text.length > 16) {
            TipsView.getInstance().showText(1000, "密码应为6-16个字符");
            return;
        }
        if(this.password2Input.text != this.passwordInput.text) {
            TipsView.getInstance().showText(1000, "两次密码输入不一致");
            return;
        }
        var obj: Object = {
            "type": "cs_register",
            "nick": this.nicknameInput.text,
            "pwd": this.md5(this.passwordInput.text),
        };
        this.client.sendData(obj);
    }

    // 手动登录
    private sendLogin(): void {
        var obj: Object = {
            "type": "cs_login",
            "nickname": this.loginNickname.text,
            "pwd": this.md5(this.loginPassword.text),
        };
        this.client.sendData(obj);
    }

    // 自动登录
    private sendAutoLogin(): void {
        var obj: Object = {
            "type": "cs_autoLogin",
            "uid": Laya.LocalStorage.getItem("uid"),
            "pwd": Laya.LocalStorage.getItem("pwd")
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
        this.matchPanel.visible = true;
        this.matchText.text = "匹配中";
        Laya.timer.loop(1000, this, this.textAnimation); //定时重复执行
        var obj: Object = {
            "type": "cs_match",
            "uid": Laya.LocalStorage.getItem("uid"),
        };
        this.client.sendData(obj);
    }

    // 取消匹配
    private sendCancelMatch(): void {
        this.matchPanel.visible = true;
        Laya.timer.clear(this, this.textAnimation); //删除
        var obj: Object = {
            "type": "cs_cancel_match",
            "uid": Laya.LocalStorage.getItem("uid"),
        };
        this.client.sendData(obj);
    }

    private array = ["", "。", "。。", "。。。"];
    private tick = 0;
    textAnimation(): void {
        this.tick++;
        // console.log("进入循环：" + this.tick);
        if(this.tick >= this.array.length) {
            this.tick = 0;
        }
        this.matchText.text = "匹配中" + this.array[this.tick];
    }

    //#endregion
    
    //#region 网络回调

    private onCheckRegister(): void {
        console.log("昵称检查结果.");
    }

    private onCheckSign(): void {}

    private onSign(): void {}

    private onMatch(): void {}
    
    private onEnterGame(): void {
		var matchView: MatchView = new MatchView(); //加载模式/内嵌模式
        Laya.stage.addChild(matchView);
        Laya.stage.removeChild(this);
        Laya.timer.clearAll(this); //删除所有大厅时钟
        // Laya.stage.offAll();
    }

    //#endregion

    // MD5加密
    private md5(data: string): string {
        // 以md5的格式创建一个哈希值
        // let hash = crypto.createHash('md5');
        // return hash.update(data).digest('base64');
        return data;
    }
}