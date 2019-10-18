import LogManager from "./LogManager";
import MatchView from "./MatchView";
import JoystickView from "./JoystickView";
import WebSocketClient from "../WebSocketClient";
import UserData, { PlayerStatus } from "../backup/UserData";

/**控制角色运动 */
// https://ldc.layabox.com/doc/?nav=zh-ts-4-1-1 //官方移动角色
export default class PlayerController extends Laya.Script3D {
    private gameObject: Laya.Sprite3D;
    private animator: Laya.Animator;
    private avatarID: string = ""; //MatchView传进来
    public get isLocalPlayer() { //只有自己的角色，可以输出操作
        return (this.avatarID == UserData.getInstance().uid);
    }
    public currentHP: number = 300;
    public isDead: boolean = false; //角色死亡
    private direction: number = 1;

    private myIndex: number = -1; //控制摇杆的手指
    private _clickTime: number; //限制点击次数
    private touchEvent: Laya.Event;
    
    private motions: Array<string> = [
        "Unarmed-Idle",             //待机0
        "Unarmed-Strafe-Forward",   //前进1
        "Unarmed-Strafe-Backward",  //后退2
        "Unarmed-Jump",             //跳跃3
        "Unarmed-Land",             //着陆4
        "Unarmed-Attack-L1",        //重拳5 //距离2.5以内//伤害10
        "Unarmed-Attack-L2",        //重拳6 //距离2.5以内//伤害15
        "Unarmed-Attack-L3",        //重拳7 //距离2.5以内//伤害20
        "Unarmed-Attack-Kick-L1",   //踢腿8 //距离2.0以内//伤害20，破防
        "Unarmed-Defend",           //防御9
        "Unarmed-GetHit-F1",        //受击10
        "Unarmed-Death1",           //死亡11
    ];
    private currentMotion = 0;
    private animLastTime: number = 0; //动画时长
    private posy: number = 0;
    private _posz: number = 0;
    public get posz() {
        return this._posz;
    }
    public set posz(z: number) {
        if(this.isLocalPlayer == false) return;

        // 摇杆拖到底，保持不动时，不再收发消息。
        // 但是本地FrameLoop()中的posz并非为0。
        // console.log("发送z：", z.toFixed(3) + " / " + this.distance.toFixed(1));

        // 间距小于阈值，如果我在左边，posz>0，不允许发送了
        // if(this.distance < 1.5 && this.direction == 1 && z > 0) {
        //     console.log("我在左边，无法再接近");
        //     z = 0;
        // }
        // // 间距小于阈值，如果我在右边，posz<0，不允许发送了
        // else if(this.distance < 1.5 && this.direction == -1 && z > 0) {
        //     console.log("我在右边，无法再接近");
        //     z = 0;
        // }
        // var obj: Object = {
        //     "type": "cs_move",
        //     "uid": UserData.getInstance().uid,
        //     "movez": z,
        // };
        // WebSocketClient.getInstance().sendData(obj);
    }

    // 实时检测间距
    private distance: number = 6;
    private getOtherPlayer(): PlayerController {
        if(this == MatchView.getInstance().scriptA) {
            return MatchView.getInstance().scriptB;
        } else if(this == MatchView.getInstance().scriptB) {
            return MatchView.getInstance().scriptA;
        }
        return null;
    }

    constructor() {
        super();
    }

    onEnable(): void {
        this.distance = 6;
        this.currentHP = 300;
        this.isDead = false;
        Laya.stage.on("nethandle", this, this.handle);
    }

    onUpdate(): void {
        if(this.avatarID == UserData.getInstance().uid //该角色是自己控制的
            && (this.currentMotion == 1 || this.currentMotion == 2)) //由摇杆控制的动画
        {
            var obj: Object = {
                "type": "cs_move",
                "uid": UserData.getInstance().uid,
                "movez": JoystickView.getInstance().Horizontal * -0.02
            };
            WebSocketClient.getInstance().sendData(obj);
        }
    }

    // 碰撞校验都由客户端完成，服务器只做分发
    private handle(obj): void {
        var isDriven: boolean = (obj.uid == this.avatarID); //模型受网络消息驱动
        switch(obj.type) {
            case "sc_fist": { //出拳
                if(isDriven) { //出拳方，播放动画
                    this.onFistCallback(this.touchEvent);
                } else { //挨打方
                    
                    if(obj.broken == 1) {
                        console.log(obj.uid, "被破防了");
                    }

                    if(obj.damage == 0) {
                        console.log(obj.uid, "防御了，在他边上创建防御特效");
                        //TODO:
                    } else if (obj.damage > 0) {
                        if(this.isDead) {
                            console.log(obj.beaten + "已死亡，无效攻击");
                            return;
                        }
                        console.log(obj.beaten + "挨打(-" + obj.damage + ")");
                        this.currentHP -= obj.damage;

                        if(this.currentHP <= 0) { //死亡
                            this.currentHP = 0;
                            this.isDead = true;
                            console.log("========> 最后一拳打死");

                            Laya.timer.clearAll(this); //不再播待机了
                            Laya.timer.once(400, this, function() { // 等拳打到了再播
                                this.currentMotion = 11;
                                this.animator.play(this.motions[this.currentMotion]);
                                MatchView.getInstance().updateHP(this, obj.damage);
                            });
                        } else { // 受击
                            Laya.timer.once(400, this, function() { // 等拳打到了再播
                                this.currentMotion = 10;
                                this.animator.play(this.motions[this.currentMotion]);
                                MatchView.getInstance().updateHP(this, obj.damage);

                                // 挨打完恢复待机
                                Laya.timer.once(600, this, function() {
                                    this.currentMotion = 0;
                                    this.animator.crossFade(this.motions[this.currentMotion], 0.2);
                                });
                            });
                        }
                    }
                }
                break;
            }
            case "sc_kick": { //踢脚
                if(isDriven) {
                    this.onKickCallback(this.touchEvent);
                    console.log("本地踢脚");
                }
                break;
            }
            case "sc_jump": { //跳跃
                if(isDriven) {
                    this.onJumpCallback(this.touchEvent);
                    console.log("本地跳跃");
                }
                break;
            }
            case "sc_defend": { //防御
                console.log("[防御]" + obj.uid + ":" + obj.defend);
                if(isDriven) {
                    if(obj.defend == 1) {
                        this.onDefendCallback(this.touchEvent);
                        console.log("本地防御");
                    } else if(obj.defend == 0) {
                        this.handleMouseUp();
                        console.log("本地取消防御");
                        this.currentMotion = 0;
                    }
                }
                break;
            }
            case "sc_move": { //移动
                if(isDriven) {
                    var lastPosZ: number = this.gameObject.transform.position.z;
                    var currPosZ: number = obj.posz; //世界坐标系

                    this.gameObject.transform.position = new Laya.Vector3(0, 0, obj.posz);
                    if(lastPosZ == currPosZ) return;
                    if(this.isLocalPlayer) return;

                    Laya.timer.clear(this, this.playIdle); //取消待机
                    //3 ------> -3
                    var motionStr = "";
                    if(this.direction == 1) { //左边的人变小前进，变大后退
                        motionStr = (currPosZ < lastPosZ)? "[在前进]":"[在后退]";
                        this.currentMotion = (currPosZ < lastPosZ)? 1:2;
                    } else if (this.direction == - 1) { //右边的人变小后退，变大前进
                        motionStr = (currPosZ > lastPosZ)? "[在前进]":"[在后退]";
                        this.currentMotion = (currPosZ > lastPosZ)? 1:2;
                    }
                    this.animator.play(this.motions[this.currentMotion]);
                    Laya.timer.once(100, this, this.playIdle); //1秒后播放待机
                    console.log(this.avatarID + "[" + this.currentMotion + "]" + motionStr + lastPosZ.toFixed(3) + " ---> " + currPosZ.toFixed(3));
                }
                break;
            }
        }
    }

    public setUid(id: string, side: number): void {
        this.avatarID = id;
        this.direction = (side == 0)? 1 : -1;

        this.currentMotion = 0;
        this.animLastTime = 0;
        this.posy = 0;
        // this.posz = 0;

        this.gameObject = this.owner as Laya.Sprite3D;
        this.animator = this.gameObject.getComponent(Laya.Animator);
        this.animator.play(this.motions[this.currentMotion]);

        this._clickTime = 0;
        if(this.isLocalPlayer) {
            MatchView.getInstance().fistBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendFist);
            MatchView.getInstance().kickBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendKick);
            MatchView.getInstance().jumpBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendJump);
            MatchView.getInstance().defendBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendDefend);
            // 全局
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.sendCancelDefend);
            if(this.isLocalPlayer) {
                JoystickView.getInstance().stickImage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
            }
        }

        // 更新移动
        Laya.stage.frameLoop(1, this, ()=> {
            // if(this.gameObject.transform.position.y > 0 && this.posy == 0) { // 跳跃
            //     this.gameObject.transform.translate(new Laya.Vector3(0, -0.1, this.posz), true);
            //     if(this.gameObject.transform.position.y < 0) {
            //         this.gameObject.transform.position.y = 0;
            //     }
            // } else { // 移动
            //     this.gameObject.transform.translate(new Laya.Vector3(0, this.posy, this.posz), true);
            // }
            
            // if(this.isLocalPlayer == false && (this.animLastTime <= Laya.Browser.now() - this._clickTime)) { //没有其他动画在播
            //     var motion = 0;
            //     if((this.posz > 0)) {
            //         motion = 1;
            //     } else if (this.posz < 0) {
            //         motion = 2;
            //     } else {
            //         motion = 0;
            //     }
            //     if(this.currentMotion != motion && this.currentMotion != 9 && this.currentMotion != 10 && this.currentMotion != 10) { //没有在防御，没有在挨打
            //         this.currentMotion = motion;
            //         this.animator.play(this.motions[this.currentMotion]); //前进/后退
            //         // console.log("别人在移动");
            //     }
            // }
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
        // this.posz = 0;
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.mouseUp);
    }

    // 基于场景
    mouseMove(e: Laya.Event): void {
        if(this.animLastTime > Laya.Browser.now() - this._clickTime) {
            // this.posz = 0;
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
            // this.posz = JoystickView.getInstance().Horizontal * 0.02 * this.direction;
            // 非本地的在FrameLoop()中处理
            // this.currentMotion = (this.posz > 0)? 1 : 2; //由动画驱动移动的发包
            // this.animator.play(this.motions[this.currentMotion]);
            this.currentMotion = (JoystickView.getInstance().Horizontal * 0.02 * this.direction > 0)? 1 : 2;
            this.animator.play(this.motions[this.currentMotion]);
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
                return;
            }
        }
        this.myIndex = -1;
        // this.posz = 0;
        this.currentMotion = 0;
        this.animator.crossFade(this.motions[this.currentMotion], 0.2);
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.mouseUp);
    }

    //#endregion

    public playIdle () {
        Laya.timer.clear(this, this.playOther); //停掉其他延迟执行的动作
        this.currentMotion = 0;
        this.animator.play(this.motions[this.currentMotion]);
        console.log(this.avatarID + "播放待机动画");
    };

    public playOther () {
        this.animator.play(this.motions[this.currentMotion]);
    };

    // 带连击5,6,7 | 600
    sendFist(e: Laya.Event): void {
        this.touchEvent = e;
        var obj: Object = {
            "type": "cs_fist",
            "uid": UserData.getInstance().uid,
            "damage": 10, //不知道是第几下
        };
        WebSocketClient.getInstance().sendData(obj);
        // console.log("发送出拳");
    }

    onFistCallback(e: Laya.Event): void {
        this.animLastTime = 600; //单次出拳时长
        var waitTime: number = 0;

        // 服务器判定出拳了
        var hitAmount = 10;

        if(this.animLastTime > Laya.Browser.now() - this._clickTime) {
            waitTime = this.animLastTime - (Laya.Browser.now() - this._clickTime); //一定大于0
            // console.log("两次点击间隔非常小：", this.currentMotion, "，等待：", waitTime / 1000, "秒");

            if(this.currentMotion == 5 && waitTime < 200) {

                this._clickTime = Laya.Browser.now(); //点到了，更新时间
                this.currentMotion = 6;
                
                Laya.timer.once(waitTime, this, this.playOther); //等待拳1播完，播拳2动画
                console.log("========> onFistBtn.重拳2，等待：", waitTime);
                waitTime += this.animLastTime; //恢复待机的时间延长
                
                if(this.distance > 2.5) {
                    hitAmount = 0;
                    // console.log("距离太远，无法命中");
                } else {
                    hitAmount = 15;
                    // this.sendHit(hitAmount);
                }

            } else if(this.currentMotion == 6 && waitTime < 200) {

                this._clickTime = Laya.Browser.now();
                this.currentMotion = 7;

                Laya.timer.once(waitTime, this, this.playOther);
                console.log("========> onFistBtn.重拳3");
                waitTime += this.animLastTime; //恢复待机的时间延长

                if(this.distance > 2.5) {
                    hitAmount = 0;
                    // console.log("距离太远，无法命中");
                } else {
                    hitAmount = 20;
                    // this.sendHit(hitAmount);
                }

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

            if(this.distance > 2.5) {
                hitAmount = 0;
                // console.log("距离太远，无法命中");
            } else {
                hitAmount = 10;
                // this.sendHit(hitAmount);
            }
        }

        // 播完自动放待机
        Laya.timer.once(waitTime, this, this.playIdle);
        // console.log("播完自动放待机：", waitTime);
    }

    // 踢技8 | 600
    sendKick(e: Laya.Event): void {
        this.touchEvent = e;
        var obj: Object = {
            "type": "cs_kick",
            "uid": UserData.getInstance().uid,
        };
        WebSocketClient.getInstance().sendData(obj);
    }

    onKickCallback(e: Laya.Event): void {
        this.animLastTime = 600; //单次踢腿时长
        var waitTime: number = 0;

        var hitAmount = 20;

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
            
            if(this.distance > 2) {
                hitAmount = 0;
                // console.log("距离太远，无法命中");
            } else {
                hitAmount = 20;
                // this.sendHit(hitAmount, 1);
            }
        }

        // 播完自动放待机
        Laya.timer.once(waitTime, this, this.playIdle);
        // console.log("播完自动放待机：", waitTime);
    }

    // 跳跃3，着陆4 | 800
    sendJump(e: Laya.Event): void {
        this.touchEvent = e;
        var obj: Object = {
            "type": "cs_jump",
            "uid": UserData.getInstance().uid,
        };
        WebSocketClient.getInstance().sendData(obj);
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
        // console.log("播完自动放待机：", waitTime);
    }

    // 防御9 | 500
    sendDefend(e: Laya.Event): void {
        this.touchEvent = e;
        var obj: Object = {
            "type": "cs_defend",
            "uid": UserData.getInstance().uid,
            "defend": 1,
        };
        WebSocketClient.getInstance().sendData(obj);
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
                "uid": UserData.getInstance().uid,
                "defend": 0,
            };
            WebSocketClient.getInstance().sendData(obj);
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