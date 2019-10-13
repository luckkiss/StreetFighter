import LogManager from "./LogManager";
import MatchView from "./MatchView";
import JoystickView from "./JoystickView";
import WebSocketClient from "../WebSocketClient";
import UserData, { PlayerStatus } from "../backup/UserData";

/**控制角色运动 */
// https://ldc.layabox.com/doc/?nav=zh-ts-4-1-1 //官方移动角色

export default class PlayerController extends Laya.Script3D {
    public gameObject: Laya.Sprite3D;
    public animator: Laya.Animator;

    private myIndex: number = -1; //控制摇杆的手指
    private _clickTime: number; //限制点击次数
    public fistBtn: Laya.Image;
    public kickBtn: Laya.Image;
    public jumpBtn: Laya.Image;
    public defendBtn: Laya.Image;
    
    private motions: Array<string> = [
        "Unarmed-Idle",             //待机0
        "Unarmed-Strafe-Forward",   //前进1
        "Unarmed-Strafe-Backward",  //后退2
        "Unarmed-Jump",             //跳跃3
        "Unarmed-Land",             //着陆4
        "Unarmed-Attack-L1",        //重拳5
        "Unarmed-Attack-L2",        //重拳6
        "Unarmed-Attack-L3",        //重拳7
        "Unarmed-Attack-Kick-L1",   //踢腿8
        "Unarmed-Defend",           //防御9
    ];
    private currentMotion = 0;
    private animLastTime: number = 0; //动画时长
    private posy: number = 0;
    private _posz: number = 0;
    public get posz() {
        return this._posz;
    }
    public set posz(z: number) {
        var obj: Object = {
            "type": "cs_move",
            "uid": this.clientUid,
            "posz": z,
        };
        this.client.sendData(obj);
        // this._posz = z;
    }

    private touchEvent: Laya.Event;
    private client: WebSocketClient = null;
    private clientUid: string = ""; //MatchView传进来
    private modelUid: string = ""; //MatchView传进来
    private isLocalPlayer: boolean = false;

    constructor() {
        super();
        this.client = WebSocketClient.getInstance();
        // Laya.stage.offAll("nethandle");
        Laya.stage.on("nethandle", this, this.handle);
    }

    // 碰撞校验都由客户端完成，服务器只做分发
    private handle(obj): void {
        var isSelf: boolean = (obj.uid == this.modelUid);
        switch(obj.type) {
            case "sc_fist": { //出拳
                // console.log("出拳：" + obj.uid + " | " + isSelf);
                if(isSelf) {
                    this.onFistCallback(this.touchEvent);
                }
                break;
            }
            case "sc_kick": { //踢脚
                if(isSelf) {
                    this.onKickCallback(this.touchEvent);
                    console.log("本地踢脚");
                }
                break;
            }
            case "sc_jump": { //跳跃
                if(isSelf) {
                    this.onJumpCallback(this.touchEvent);
                    console.log("本地跳跃");
                }
                break;
            }
            case "sc_defend": { //防御
                console.log("[防御]" + obj.uid + ":" + obj.state);
                if(isSelf) {
                    if(obj.state == 1) {
                        this.onDefendCallback(this.touchEvent);
                        console.log("本地防御");
                    } else if(obj.state == 0) {
                        this.handleMouseUp();
                        console.log("本地取消防御");
                    }
                }
                break;
            }
            case "sc_move": { //移动
                if(isSelf) {
                    this._posz = obj.posz;
                    // console.log("本地移动：" + obj.posz);
                }
                break;
            }
        }
    }

    public setUid(modelid: string): void {
        console.log("设置uid：" + modelid);
        this.modelUid = modelid;
        this.clientUid = MatchView.instance.uid;
        this.isLocalPlayer = (this.modelUid == this.clientUid); //只有自己的角色，可以输出操作

        this.gameObject = this.owner as Laya.Sprite3D;
        // this.gameObject = MatchView.instance.playerA;
        this.animator = this.gameObject.getComponent(Laya.Animator);
        this.animator.play(this.motions[0]);

        this.currentMotion = 0;
        this.animLastTime = 0;
        this.posy = 0;
        this.posz = 0;

        this._clickTime = 0;
        if(this.isLocalPlayer) {
            var gamePad: Laya.Node = LogManager.instance.gamePad;
            this.fistBtn = gamePad.getChildByName("Fist") as Laya.Image;
            this.fistBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendFist);
            this.kickBtn = gamePad.getChildByName("Kick") as Laya.Image;
            this.kickBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendKick);
            this.jumpBtn = gamePad.getChildByName("Jump") as Laya.Image;
            this.jumpBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendJump);
            this.defendBtn = gamePad.getChildByName("Defend") as Laya.Image;
            this.defendBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendDefend);
            // 全局
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.sendCancelDefend);
            if(this.isLocalPlayer) {
                JoystickView.instance.stickImage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
            }
        }

        // 更新移动
        Laya.stage.frameLoop(1, this, ()=> {
            if(this.gameObject.transform.position.y > 0 && this.posy == 0) { // 跳跃
                this.gameObject.transform.translate(new Laya.Vector3(0, -0.1, this.posz), true);
                if(this.gameObject.transform.position.y < 0) {
                    this.gameObject.transform.position.y = 0;
                }
            } else { // 移动
                this.gameObject.transform.translate(new Laya.Vector3(0, this.posy, this.posz), true);
            }
        });
    }

    //#region 移动控制

    // 基于UI
    mouseDown(e: Laya.Event): void {
        if(this.animLastTime > Laya.Browser.now() - this._clickTime) {
            console.log("在播放其他动作");
            return;
        }
        this.myIndex = e.touchId;
        this.posz = 0;
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.mouseOut);
    }

    // 基于场景
    mouseMove(e: Laya.Event): void {
        if(this.animLastTime > Laya.Browser.now() - this._clickTime) {
            // LogManager.instance.vConsole("在播放其他动作");
            this.posz = 0;
            return;
        }
        if(Laya.Browser.onPC) { }
        else {
            if(e.touchId != this.myIndex) {
                return;
            }
        }
        // 检测到攻击动画，就覆盖移动动画，停止移动
        if(this.isLocalPlayer) {
            this.posz = JoystickView.instance.Horizontal * 0.02;
            this.currentMotion = (this.posz > 0)? 1 : 2;
            this.animator.play(this.motions[this.currentMotion]); //前进/后退
        }
    }

    mouseUp(e: Laya.Event): void {
        if(this.animLastTime > Laya.Browser.now() - this._clickTime) {
            console.log("在播放其他动作");
            return;
        }
        if(Laya.Browser.onPC) {}
        else {
            if(e.touchId != this.myIndex) {
                // LogManager.instance.vConsole("离开的点是其他手指：" + e.touchId + "，摇杆的手指是：" + this.myIndex);
                return;
            }
        }
        this.myIndex = -1;
        this.posz = 0;
        this.currentMotion = 0;
        this.animator.crossFade(this.motions[this.currentMotion], 0.2);
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.mouseOut);
    }

    mouseOut(e: Laya.Event): void {
        if(this.animLastTime > Laya.Browser.now() - this._clickTime) {
            console.log("在播放其他动作");
            return;
        }
        if(Laya.Browser.onPC) {}
        else {
            if(e.touchId != this.myIndex) {
                return;
            }
        }
        this.myIndex = -1;

        this.posz = 0;
        this.currentMotion = 0;
        this.animator.crossFade(this.motions[this.currentMotion], 0.2);
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.mouseOut);
    }

    //#endregion

    public playIdle () {
        Laya.timer.clear(this, this.playOther); //停掉其他延迟执行的动作
        this.currentMotion = 0;
        this.animator.play(this.motions[this.currentMotion]);
        console.log("播放待机动画");
    };

    public playOther () {
        // Laya.timer.clear(this, this.playIdle); //清除拳1的播完延迟命令
        this.animator.play(this.motions[this.currentMotion]);
    };

    // 带连击5,6,7 | 600
    sendFist(e: Laya.Event): void {
        this.touchEvent = e;
        var obj: Object = {
            "type": "cs_fist",
            "uid": this.clientUid,
        };
        this.client.sendData(obj);
    }

    onFistCallback(e: Laya.Event): void {
        this.animLastTime = 600; //单次出拳时长
        var waitTime: number = 0;

        if(this.animLastTime > Laya.Browser.now() - this._clickTime) {
            waitTime = this.animLastTime - (Laya.Browser.now() - this._clickTime); //一定大于0
            // console.log("两次点击间隔非常小：", this.currentMotion, "，等待：", waitTime / 1000, "秒");

            if(this.currentMotion == 5 && waitTime < 200) {

                this._clickTime = Laya.Browser.now(); //点到了，更新时间
                this.currentMotion = 6;
                
                Laya.timer.once(waitTime, this, this.playOther); //等待拳1播完，播拳2动画
                console.log("========> onFistBtn.重拳2，等待：", waitTime);
                waitTime += this.animLastTime; //恢复待机的时间延长

            } else if(this.currentMotion == 6 && waitTime < 200) {

                this._clickTime = Laya.Browser.now();
                this.currentMotion = 7;

                Laya.timer.once(waitTime, this, this.playOther);
                console.log("========> onFistBtn.重拳3");
                waitTime += this.animLastTime; //恢复待机的时间延长

            } else {
                console.error("点击过快");
                return;
            }
        } else {

            waitTime = this.animLastTime;
            this._clickTime = Laya.Browser.now();
            this.currentMotion = 5;
            Laya.timer.once(0, this, this.playOther);
            console.log("========> onFistHandler.重拳1");
        }

        // 播完自动放待机
        Laya.timer.once(waitTime, this, this.playIdle);
        console.log("播完自动放待机：", waitTime);
    }

    // 踢技8 | 600
    sendKick(e: Laya.Event): void {
        this.touchEvent = e;
        var obj: Object = {
            "type": "cs_kick",
            "uid": this.clientUid,
        };
        this.client.sendData(obj);
    }

    onKickCallback(e: Laya.Event): void {
        this.animLastTime = 600; //单次踢腿时长
        var waitTime: number = 0;

        if(this.animLastTime > Laya.Browser.now() - this._clickTime) {
            waitTime = this.animLastTime - (Laya.Browser.now() - this._clickTime); //一定大于0
            console.error("点击过快，等待：", waitTime / 1000, "秒");
            return;
        } else {
            
            waitTime = this.animLastTime;
            this._clickTime = Laya.Browser.now();
            this.currentMotion = 8;
            Laya.timer.once(0, this, this.playOther);
            console.log("========> onKickHandler.踢腿");
        }

        // 播完自动放待机
        Laya.timer.once(waitTime, this, this.playIdle);
        console.log("播完自动放待机：", waitTime);
    }

    // 跳跃3，着陆4 | 800
    sendJump(e: Laya.Event): void {
        this.touchEvent = e;
        var obj: Object = {
            "type": "cs_jump",
            "uid": this.clientUid,
        };
        this.client.sendData(obj);
    }

    onJumpCallback(e: Laya.Event): void {
        this.animLastTime = 800; //单次踢腿时长
        var waitTime: number = 0;

        if(this.animLastTime > Laya.Browser.now() - this._clickTime) {
            waitTime = this.animLastTime - (Laya.Browser.now() - this._clickTime); //一定大于0
            console.error("点击过快，等待：", waitTime / 1000, "秒");
            return;
        } else {
            
            //不需要清理Idle延迟函数

            waitTime = this.animLastTime;
            this._clickTime = Laya.Browser.now();
            
            this.posy = 0.1;
            this.currentMotion = 3;
            this.animator.play(this.motions[this.currentMotion]); //跳跃
            
            Laya.timer.once(300, this, function() {
                this.posy = 0;
                Laya.timer.once(100, this, function() {
                    this.currentMotion = 4;
                    this.animator.play(this.motions[this.currentMotion]); //着陆
                });
            });

            console.log("========> onJumpHandler.跳跃");
        }

        // 播完自动放待机
        Laya.timer.once(waitTime, this, this.playIdle);
        console.log("播完自动放待机：", waitTime);
    }

    // 防御9 | 500
    sendDefend(e: Laya.Event): void {
        this.touchEvent = e;
        var obj: Object = {
            "type": "cs_defend",
            "uid": this.clientUid,
            "state": 1,
        };
        this.client.sendData(obj);
    }

    onDefendCallback(e: Laya.Event): void {
        this.animLastTime = 800; //单次踢腿时长
        var waitTime: number = 0;

        if(this.animLastTime > Laya.Browser.now() - this._clickTime) {
            waitTime = this.animLastTime - (Laya.Browser.now() - this._clickTime); //一定大于0
            console.error("点击过快，等待：", waitTime / 1000, "秒");
            return;
        } else {
            //不需要清理Idle延迟函数
            waitTime = this.animLastTime;
            this._clickTime = Laya.Browser.now();
            
            this.currentMotion = 9;
            this.animator.play(this.motions[this.currentMotion]); //跳跃
            console.log("========> onDefendHandler.防御");
        }
        // 松手才取消状态
    }

    // 取消防御9 | 500
    sendCancelDefend(e: Laya.Event): void {
        if(this.currentMotion == 9) {
            this.touchEvent = e;
            var obj: Object = {
                "type": "cs_defend",
                "uid": this.clientUid,
                "state": 0,
            };
            this.client.sendData(obj);
        }
    }

    // 恢复待机
    handleMouseUp(): void {
        if(this.currentMotion == 9) {
            console.log("松手取消防御");
            this.animator.play(this.motions[0]); //待机
        }
    }
}