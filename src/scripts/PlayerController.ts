import GameManager from "./GameManager";
import JoystickManager from "./JoystickManager";

/**控制角色运动 */
// https://ldc.layabox.com/doc/?nav=zh-ts-4-1-1 //官方移动角色

export default class PlayerController extends Laya.Script3D {
    public gameObject: Laya.Sprite3D;
    public animator: Laya.Animator;

    private _clickTime: number; //限制点击次数
    public fistBtn: Laya.Image;
    public kickBtn: Laya.Image;
    public jumpBtn: Laya.Image;
    public defendBtn: Laya.Image;
    
    public leftBtn: Laya.Sprite;
    public rightBtn: Laya.Sprite;

    private currentMotion = 0;
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
    private animLastTime: number = 0; //动画时长
    // private is_move: boolean = false;
    private posy: number = 0;
    private posz: number = 0;

    constructor() {
        super();

        this.gameObject = GameManager.instance.player;
        this.animator = this.gameObject.getComponent(Laya.Animator);

        this.currentMotion = 0;
        // this.is_move = false;
        this.animLastTime = 0;
        this.posy = 0;
        this.posz = 0;

        // Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.handleMouseMove); //事件监听
        // Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.handleMouseDown);
        // Laya.stage.on(Laya.Event.MOUSE_UP, this, this.handleMouseUp);
        // Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.handleMouseOut);

        var gamePad: Laya.Node = GameManager.instance.gamePad;

        this._clickTime = 0;
        this.fistBtn = gamePad.getChildByName("Fist") as Laya.Image;
        this.fistBtn.on(Laya.Event.MOUSE_DOWN, this, this.onFistHandler);
        this.kickBtn = gamePad.getChildByName("Kick") as Laya.Image;
        this.kickBtn.on(Laya.Event.MOUSE_DOWN, this, this.onKickHandler);

        this.jumpBtn = gamePad.getChildByName("Jump") as Laya.Image;
        this.jumpBtn.on(Laya.Event.MOUSE_DOWN, this, this.onJumpHandler);
        this.defendBtn = gamePad.getChildByName("Defend") as Laya.Image;
        this.defendBtn.on(Laya.Event.MOUSE_DOWN, this, this.onDefendHandler);

        // 全局
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.handleMouseUp);
    }

    onStart(): void {
        this.animator.play(this.motions[0]);
    }

    onUpdate(): void {
        if(this.gameObject.transform.position.y > 0 && this.posy == 0) {
            this.gameObject.transform.translate(new Laya.Vector3(0, -0.1, this.posz), true);
            if(this.gameObject.transform.position.y < 0) {
                this.gameObject.transform.position.y = 0;
            }
        } else {
            this.gameObject.transform.translate(new Laya.Vector3(0, this.posy, this.posz), true);
        }
    }

    /* UI穿透问题
    handleMouseDown(): void {
        if(JoystickManager.isUI) return;
        if(this.animLastTime > 0) return;

        this.posz = 0;
        this.is_move = true;
        this.animator.play(this.motions[0]); //待机
        console.log("### handleMouseDown.待机");
    }

    handleMouseMove(): void {
        if(JoystickManager.isUI) return;
        if(this.animLastTime > 0) return;
        
        if(!this.is_move) return;
        this.posz = JoystickManager.instance.Horizontal * 0.02;
        this.animator.play(this.motions[(this.posz > 0)? 1 : 2]); //前进
        console.log("### handleMouseMove.前进");
        // console.log(this.gameObject.name, ": ", this.gameObject.transform.position, " + ", this.posz);
    }

    public delayAction = null;

    handleMouseUp(): void {
        this.is_move = false;
        this.posz = 0;
        
        if(this.delayAction != null) {
            console.error("上一个延迟函数没结束");
            return;
        }
        // Laya.timer.clear(this.handleMouseUp, this.delayAction);

        if(this.animLastTime > 0) {
            this.delayAction = function () {
                this.animator.play(this.motions[0]);
                console.log("### handleMouseUp.待机1");
                this.delayAction = null;
            };
            Laya.timer.once(this.animLastTime, this, this.delayAction);
        } else {
            this.animator.play(this.motions[0]); //待机
            console.log("### handleMouseUp.待机2");
            this.delayAction = null;
        }
    }

    handleMouseOut(): void {
        this.is_move = false;
        this.posz = 0;
        if(this.animLastTime > 0) {
            Laya.timer.once(this.animLastTime, this, function() {
                this.animator.play(this.motions[0]);
            });
        } else {
            this.animator.play(this.motions[0]); //待机
        }
    }
    */

    handleMove(): void {
        // 检测到攻击动画，就覆盖移动动画，停止移动
        
    }

    // 恢复待机
    handleMouseUp(): void {
        if(this.currentMotion == 9) {
            console.log("松手取消防御");
            this.animator.play(this.motions[0]); //待机
        }
    }

    public playIdle () {
        Laya.timer.clear(this, this.playOther); //停掉其他延迟执行的动作
        this.animator.play(this.motions[0]);
    };

    public playOther () {
        Laya.timer.clear(this, this.playIdle); //停掉延迟执行的待机
        this.animator.play(this.motions[this.currentMotion]);
    };

    // 带连击5,6,7 | 600
    onFistHandler(e: Laya.Event): void {

        this.animLastTime = 600; //单次出拳时长
        var waitTime: number = 0;

        if(this.animLastTime > Laya.Browser.now() - this._clickTime) {

            waitTime = this.animLastTime - (Laya.Browser.now() - this._clickTime); //一定大于0
            // console.log("两次点击间隔非常小：", this.currentMotion, "，等待：", waitTime / 1000, "秒");

            if(this.currentMotion == 5 && waitTime < 200) {

                this._clickTime = Laya.Browser.now(); //点到了，更新时间
                this.currentMotion = 6;
                
                Laya.timer.clear(this, this.playIdle); //清除拳1的播完延迟命令
                Laya.timer.once(waitTime, this, this.playOther); //等待拳1播完，播拳2动画
                console.log("========> onFistBtn.重拳2，等待：", waitTime);
                waitTime += this.animLastTime; //恢复待机的时间延长

            } else if(this.currentMotion == 6 && waitTime < 200) {

                this._clickTime = Laya.Browser.now();
                this.currentMotion = 7;

                Laya.timer.clear(this, this.playIdle); //停掉单个定时函数
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
    onKickHandler(e: Laya.Event): void {

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
    onJumpHandler(e: Laya.Event): void {

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
    onDefendHandler(e: Laya.Event): void {

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
}