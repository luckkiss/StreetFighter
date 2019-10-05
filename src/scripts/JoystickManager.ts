/**控制输入类 */
//https://github.com/lizenghua/JoyStick
    
export default class JoystickManager extends Laya.Script {
    public static instance: JoystickManager;

    private round: Laya.Sprite; //控制圆
    private direction: Laya.Sprite; //方向圆
    private speed: number = 0;
    private angle: number;
    private centerX: number = -1;
    private centerY: number = -1;

    public Horizontal: number = 0;
    public Vertical: number = 0;
    public static isUI: boolean = false;

    constructor() {
        super();
        JoystickManager.instance = this;

        this.round = new Laya.Sprite;
        this.round.loadImage("ui/joystickBg.png");
        this.round.pivot(140,140);
        this.round.visible = false;
        Laya.stage.addChild(this.round);

        this.direction = new Laya.Sprite;
        this.direction.loadImage("ui/joystickPoint.png");
        this.direction.pivot(140,140);
        this.direction.visible = false;
        Laya.stage.addChild(this.direction);
        
        Laya.stage.on(Laya.Event.MOUSE_OVER, this, this.checkUI);
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.checkUI);
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.mouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP,this,this.mouseUp);
        Laya.timer.frameLoop(1, this, this.outputData);
    }
    
    checkUI(e: Laya.Event): void {
        // console.log("是3D还是UI：", e.target.name);
        JoystickManager.isUI = (e.target.name != "Main");
    }

    mouseDown(e: Laya.Event): void {
        if(JoystickManager.isUI) return;

        this.round.visible = true;
        this.round.pos(Laya.stage.mouseX, Laya.stage.mouseY);
        this.direction.visible = true;
        this.direction.pos(Laya.stage.mouseX, Laya.stage.mouseY);
        
        this.centerX = Laya.stage.mouseX;
        this.centerY = Laya.stage.mouseY;
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
    }

    mouseMove(e: MouseEvent): void {
        if(JoystickManager.isUI) return;

        if(this.centerX >= 0 && this.centerY >= 0) {
            //计算两点距离 如果超过一定距离 就停留在距离最大值处
            let dis = this.dis(this.centerX, this.centerY, Laya.stage.mouseX, Laya.stage.mouseY);

            if(dis > 20) {
                this.direction.pos(this.centerX + Math.cos(this.angle) * 20, this.centerY + Math.sin(this.angle) * 20);
            } else {
                this.direction.pos(Laya.stage.mouseX, Laya.stage.mouseY);
            }

            //如果距离太小 就代表没动
            if(dis > 3) {
                this.speed = 1; //此处还可以通过距离 控制速度
            } else {
                this.speed = 0;
            }
        }
    }

    onMouseOut(): void {
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        this.speed = 0;
        this.round.visible = false;
        this.direction.visible = false;
    }

    mouseUp(): void {
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        this.speed = 0;
        this.round.visible = false;
        this.direction.visible = false;
    }

    // 输出位移数据
    outputData(): void {
        if(JoystickManager.isUI) return;

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