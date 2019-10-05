import GameManager from "./GameManager";

/**控制输入类 */
//https://github.com/lizenghua/JoyStick
    
export default class JoystickManager extends Laya.Script {
    public static instance: JoystickManager;

    /** @prop {name:roundNode, tips:"背景", type:Node, default:null}*/
    public roundNode: Laya.Node;
    public round: Laya.Sprite;
    
    /** @prop {name:stickNode, tips:"摇杆", type:Node, default:null}*/
    public stickNode: Laya.Node;
    public direction: Laya.Sprite;

    private speed: number = 0;
    private angle: number;
    private centerX: number = -1;
    private centerY: number = -1;

    public Horizontal: number = 0;
    public Vertical: number = 0;

    constructor() {
        super();
        JoystickManager.instance = this;
    }

    onAwake(): void {
        this.round = this.roundNode as Laya.Sprite;
        this.direction = this.stickNode as Laya.Sprite;

        this.direction.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
        Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.mouseOut);
        Laya.timer.frameLoop(1, this, this.outputData);
    }

    mouseDown(e: Laya.Event): void {
        // this.round.pos(Laya.stage.mouseX, Laya.stage.mouseY);
        // this.direction.pos(Laya.stage.mouseX, Laya.stage.mouseY);
        // this.centerX = Laya.stage.mouseX;
        // this.centerY = Laya.stage.mouseY;
        this.centerX = this.round.x;
        this.centerY = this.round.y;
        // console.log("down: ", this.centerX, this.centerY);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
    }

    mouseMove(e: MouseEvent): void {
        if(this.centerX >= 0 && this.centerY >= 0) {
            //计算两点距离 如果超过一定距离 就停留在距离最大值处
            let dis = this.dis(this.centerX, this.centerY, Laya.stage.mouseX, Laya.stage.mouseY);

            if(dis > 40) {
                this.direction.pos(this.centerX + Math.cos(this.angle) * 40, this.centerY + Math.sin(this.angle) * 40);
            } else {
                this.direction.pos(Laya.stage.mouseX, Laya.stage.mouseY);
            }

            //如果距离太小 就代表没动
            if(dis > 3) {
                this.speed = 2; //此处还可以通过距离 控制速度
            } else {
                this.speed = 0;
            }
        }
    }

    mouseUp(): void {
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        this.speed = 0;
        // this.direction.pos(this.centerX, this.centerY);
        this.direction.pos(this.round.x, this.round.y);
    }

    mouseOut(): void {
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        this.speed = 0;
        this.direction.pos(this.round.x, this.round.y);
    }

    // 输出位移数据
    outputData(): void {
        if(this.speed > 0) {
            let dx: number = Laya.stage.mouseX - this.centerX;
            let dy: number = Laya.stage.mouseY - this.centerY;
            this.angle = Math.atan2(dy, dx);

            this.Horizontal = Math.cos(this.angle) * this.speed;
            this.Vertical = Math.sin(this.angle) * this.speed;
            // console.log(this.Horizontal, ", ", this.Vertical);
        }
    }

    dis(centerX, centerY, mouseX, mouseY): number {
        let dx: number = centerX - mouseX;
        let dy: number = centerY - mouseY;
        let distance: number = Math.sqrt(dx*dx+dy*dy);
        return distance;
    }
}