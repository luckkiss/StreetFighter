import LogManager from "./LogManager";

/**控制输入类 */
//https://github.com/lizenghua/JoyStick
    
export default class JoystickManager extends Laya.Script {
    public static instance: JoystickManager;

    /** @prop {name:roundNode, tips:"背景", type:Node, default:null}*/
    public roundNode: Laya.Node;
    public round: Laya.Sprite;
    
    /** @prop {name:stickNode, tips:"摇杆", type:Node, default:null}*/
    public stickNode: Laya.Node;
    public stick: Laya.Sprite;

    private speed: number = 0;
    private angle: number;
    private centerX: number = -1;
    private centerY: number = -1;

    public Horizontal: number = 0;
    public Vertical: number = 0;

    private touches: Array<any>;
    public myIndex: number = -1; //控制摇杆的手指

    constructor() {
        super();
        JoystickManager.instance = this;
    }

    onAwake(): void {
        this.round = this.roundNode as Laya.Sprite;
        console.log("round:", this.round != null);
        this.stick = this.stickNode as Laya.Sprite;
        console.log("stick:", this.stick != null);

        this.stick.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);

        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.mouseOut);

        Laya.timer.frameLoop(1, this, this.outputData);
    }

    // 基于UI
    mouseDown(e: Laya.Event): void {
        // this.touches = e.touches; //多点触控
        this.myIndex = e.touchId;
        this.centerX = this.round.x;
        this.centerY = this.round.y;
        // GameManager.instance.vConsole("新建触控点[" + e.touchId + "]" + this.touches[e.touchId].stageX + " * " + this.touches[e.touchId].stageY);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
    }

    // 基于场景
    mouseMove(e: Laya.Event): void {
        var dx: number = 0;
        var dy: number = 0;

        if(Laya.Browser.onPC) {
            dx = Laya.stage.mouseX;
            dy = Laya.stage.mouseY;
        } else {

            if(e.touchId != this.myIndex) {
                // GameManager.instance.vConsole("无关的手指[" + e.touchId + "]");
                return;
            }
            if(e.touches.length <= this.myIndex) {
                LogManager.instance.vConsole("数组越界：" + e.touches.length + " <= " + this.myIndex);
                // Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
                return;
            }
            this.touches = e.touches;
        }

        dx = this.touches[this.myIndex].stageX;
        dy = this.touches[this.myIndex].stageY;

        if(this.centerX >= 0 && this.centerY >= 0) {
            //计算两点距离 如果超过一定距离 就停留在距离最大值处
            let dis = this.dis(this.centerX, this.centerY, dx, dy);

            if(dis > 40) {
                this.stick.pos(this.centerX + Math.cos(this.angle) * 40, this.centerY + Math.sin(this.angle) * 40);
            } else {
                this.stick.pos(dx, dy);
            }

            //如果距离太小 就代表没动
            if(dis > 3) {
                this.speed = 2; //此处还可以通过距离 控制速度
            } else {
                this.speed = 0;
            }
        }
    }

    // 基于场景
    mouseUp(e: Laya.Event): void {
        if(Laya.Browser.onPC) { }
        else {
            if(e.touchId != this.myIndex) {
                // GameManager.instance.vConsole("离开的点是其他手指：" + e.touchId + "，摇杆的手指是：" + this.myIndex);
                return;
            }
        }
        this.myIndex = -1;

        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        this.speed = 0;
        this.stick.pos(this.round.x, this.round.y);
    }

    // 基于场景
    mouseOut(e: Laya.Event): void {
        if(Laya.Browser.onPC) { } 
        else {
            if(e.touchId != this.myIndex) {
                return;
            }
        }
        this.myIndex = -1;

        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        this.speed = 0;
        this.stick.pos(this.round.x, this.round.y);
    }

    private lastX: number = 0;
    private lastY: number = 0;

    // 输出位移数据
    outputData(): void {
        if(this.speed > 0) {
            var dx: number = 0;
            var dy: number = 0;
            if(Laya.Browser.onPC) {
                dx = Laya.stage.mouseX - this.centerX;
                dy = Laya.stage.mouseY - this.centerY;
            } else {
                if(this.touches.length <= this.myIndex) {
                    LogManager.instance.vConsole("outputData.数组越界");
                    return;
                }
                dx = this.touches[this.myIndex].stageX - this.centerX;
                dy = this.touches[this.myIndex].stageY - this.centerY;
                if(isNaN(dx) || isNaN(dy)) {
                    dx = this.lastX;
                    dy = this.lastY;
                } else {
                    this.lastX = dx;
                    this.lastY = dy;
                }
                // GameManager.instance.vConsole("输出：(" + dx.toFixed(2) + " * " + dy.toFixed(2) + ")           " + this.myIndex + "/" + this.touches.length);
            }
            this.angle = Math.atan2(dy, dx);
            var h: number = Math.cos(this.angle) * this.speed;
            // var v: number = Math.sin(this.angle) * this.speed;
            this.Horizontal = isNaN(h)? 0 : h;
            // this.Vertical = isNaN(v)? 0 : v; //V不需要输出
            // GameManager.instance.vConsole("输出：" + this.Horizontal + " * 0" + "，angle=(" + this.angle + ")");
        }
    }

    dis(centerX, centerY, mouseX, mouseY): number {
        let dx: number = centerX - mouseX;
        let dy: number = centerY - mouseY;
        let distance: number = Math.sqrt(dx*dx+dy*dy);
        return distance;
    }
}