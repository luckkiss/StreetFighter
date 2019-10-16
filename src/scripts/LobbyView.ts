import {ui} from "../ui/layaMaxUI";
import WebSocketClient from "../WebSocketClient";
import LoadingView from "./LoadingView";
import MatchView from "./MatchView";
import TipsView from "./TipsView";
import UserData, { PlayerStatus } from "../backup/UserData";
// const crypto = require('crypto');

export default class LobbyView extends ui.LobbyUI {
    private static instance: LobbyView;
    public static getInstance(): LobbyView {
        if(this.instance == null) {
            this.instance = new LobbyView();
        }
        return this.instance;
	}
    
    constructor() {
        super();
        // Laya.LocalStorage.clear();
        UserData.getInstance().uid = Laya.LocalStorage.getItem("uid");
        console.log("是否有用户信息：" + UserData.getInstance().uid);
    }

    onEnable(): void {
        console.log("LobbyView.Enable");
        // UI初始化
        this.registerPanel.visible = false;
        this.loginPanel.visible = false;
        this.userPanel.visible = false;
        this.awardPanel.visible = false;
        this.matchPanel.visible = false;
        this.addUIListener();
        // 添加WebSocket
        WebSocketClient.getInstance().initSocket();
        // 添加网络监听
        Laya.stage.on("nethandle", this, this.handle);

        Laya.SoundManager.playMusic("remote/audios/bgm.mp3");
        Laya.SoundManager.autoStopMusic = true; //手机浏览器最小化，还有声音
        // console.log("播放音乐.");
    }

    onDisable(): void {
        console.log("LobbyView.Disable");
        Laya.stage.offAll(); //关闭本地网络监听
		Laya.timer.clearAll(this);
    }

    private enterGame(): void {
        UserData.getInstance().playerStatus = PlayerStatus.GAME;
		this.removeSelf();
        console.log("确保先执行Disable，再执行到这里。");
        console.log("跳转.MatchView");
        Laya.stage.addChild(MatchView.getInstance());
    }

    private addUIListener(): void {
        // UI监听注册
        this.nicknameInput.on(Laya.Event.BLUR, this, ()=> {
            console.log("网络校验昵称 3");
        });
        this.goLoginBtn.on(Laya.Event.MOUSE_DOWN, this, ()=> {
            this.registerPanel.visible = false;
            this.loginPanel.visible = true;
            this.loginNickname.text = "";
            this.loginPassword.text = "";
        });
        this.goRegisterBtn.on(Laya.Event.MOUSE_DOWN, this, ()=> {
            this.registerPanel.visible = true;
            this.loginPanel.visible = false;
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
        this.doubleAwardBtn.on(Laya.Event.MOUSE_DOWN, this, ()=> {
            TipsView.getInstance().showText(2000, "UV不足1000，敬请支持");
        });
        this.matchBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendMatch);
        this.cancelMatchBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendCancelMatch);

        // 未完成功能
        this.rankBtn.on(Laya.Event.MOUSE_DOWN, this, ()=> {
            TipsView.getInstance().showText(1000, "暂未开放，敬请支持");
        });
        this.shopBtn.on(Laya.Event.MOUSE_DOWN, this, ()=> {
            TipsView.getInstance().showText(1000, "暂未开放，敬请支持");
        });
        this.settingsBtn.on(Laya.Event.MOUSE_DOWN, this, ()=> {
            TipsView.getInstance().showText(1000, "暂未开放，敬请支持");
        });
        this.learnBtn.on(Laya.Event.MOUSE_DOWN, this, ()=> {
            TipsView.getInstance().showText(1000, "暂未开放，敬请支持");
        });
        
        // 获取用户信息
        if(UserData.getInstance().uid) {
            this.registerPanel.visible = false;
            this.userPanel.visible = true;
        } else {
            this.registerPanel.visible = true; //弹出注册页面
            this.userPanel.visible = false;
        }
    }

    private handle(obj): void {
        switch(obj.type) {
            case "connected": { //建立连接
		        Laya.stage.removeChild(LoadingView.getInstance());
                if(UserData.getInstance().uid) {
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
		        Laya.stage.removeChild(LoadingView.getInstance());
                break;
            }
            case "sc_login_success": { //登录成功
                console.log("登陆成功，写入cookie：" + obj.uid + ": " + obj.pwd);
                Laya.LocalStorage.setItem("uid", obj.uid);
                Laya.LocalStorage.setItem("pwd", obj.pwd); //md5加密的
                UserData.getInstance().uid = obj.uid;
                UserData.getInstance().nickname = obj.nickname;
                this.nickNameText.text = obj.nickname;
                UserData.getInstance().gold = obj.gold;
                this.goldText.text = obj.gold;
                this.registerPanel.visible = false;
                this.loginPanel.visible = false;
                this.userPanel.visible = true;
                UserData.getInstance().playerStatus = PlayerStatus.FREE;
                break;
            }
            case "sc_login_failed": { //登录失败
                TipsView.getInstance().showText(1000, "登陆失败");
                UserData.getInstance().playerStatus = PlayerStatus.DISCONNECT;
                this.loginPanel.visible = true;
		        Laya.stage.removeChild(LoadingView.getInstance());
                break;
            }
            case "sc_sign_success": { //签到成功
                console.log("签到成功，看广告x2");
                this.awardPanel.visible = true;
                UserData.getInstance().updateGold(obj.gold);
                this.goldText.text = UserData.getInstance().gold.toString();
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
                Laya.timer.once(1000, this, this.enterGame);
                break;
            }
            case "sc_match_cancel": { //取消匹配
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
        WebSocketClient.getInstance().sendData(obj);
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
        WebSocketClient.getInstance().sendData(obj);
    }

    // 手动登录
    private sendLogin(): void {
        var obj: Object = {
            "type": "cs_login",
            "nickname": this.loginNickname.text,
            "pwd": this.md5(this.loginPassword.text),
        };
        WebSocketClient.getInstance().sendData(obj);
    }

    // 自动登录
    private sendAutoLogin(): void {
        var obj: Object = {
            "type": "cs_autoLogin",
            "uid": UserData.getInstance().uid,
            "pwd": Laya.LocalStorage.getItem("pwd")
        };
        WebSocketClient.getInstance().sendData(obj);
    }

    // 改名、改颜色
    private setUserData(): void {}

    // 每日签到
    private sendSign(): void {
        var obj: Object = {
            "type": "cs_sign",
            "uid": UserData.getInstance().uid,
        };
        WebSocketClient.getInstance().sendData(obj);
    }

    // 开始匹配
    private sendMatch(): void {
        this.matchPanel.visible = true;
        this.matchText.text = "匹配中";
        Laya.timer.loop(1000, this, this.textAnimation); //定时重复执行
        var obj: Object = {
            "type": "cs_match",
            "uid": UserData.getInstance().uid,
        };
        WebSocketClient.getInstance().sendData(obj);
    }

    // 取消匹配
    private sendCancelMatch(): void {
        this.matchPanel.visible = true;
        Laya.timer.clear(this, this.textAnimation); //删除
        var obj: Object = {
            "type": "cs_cancel_match",
            "uid": UserData.getInstance().uid,
        };
        WebSocketClient.getInstance().sendData(obj);
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
    
    //#endregion

    // MD5加密
    private md5(data: string): string {
        // 以md5的格式创建一个哈希值
        // let hash = crypto.createHash('md5');
        // return hash.update(data).digest('base64');
        return data;
    }

    // 头像遮罩 https://blog.csdn.net/wangmx1993328/article/details/84971519
    private addMask(): void {
        //创建遮罩对象(精灵)
        let maskSprite = new Laya.Sprite();
        //由遮罩精灵获取绘图对象绘制一个圆形的遮罩区域，遮罩对象坐标系是相对遮罩对象本身的，(95,41)表示圆形的原点坐标，50 表示半径
        //第三个参数表示填充颜色，或者填充绘图的渐变对象。
        maskSprite.graphics.drawCircle(95,41,50,"#ff0000");
        //对 图像实现遮罩效果
        // this.head.mask = maskSprite;
    }
}