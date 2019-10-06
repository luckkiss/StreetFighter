(function () {
    'use strict';

    class JoystickManager extends Laya.Script {
        constructor() {
            super();
            this.speed = 0;
            this.centerX = -1;
            this.centerY = -1;
            this.Horizontal = 0;
            this.Vertical = 0;
            this.myIndex = -1;
            this.lastX = 0;
            this.lastY = 0;
            JoystickManager.instance = this;
        }
        onAwake() {
            this.round = this.roundNode;
            this.stick = this.stickNode;
            this.stick.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
            Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.mouseOut);
            Laya.timer.frameLoop(1, this, this.outputData);
        }
        mouseDown(e) {
            this.myIndex = e.touchId;
            this.centerX = this.round.x;
            this.centerY = this.round.y;
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        }
        mouseMove(e) {
            var dx = 0;
            var dy = 0;
            if (Laya.Browser.onPC) {
                dx = Laya.stage.mouseX;
                dy = Laya.stage.mouseY;
            }
            else {
                if (e.touchId != this.myIndex) {
                    return;
                }
                if (e.touches.length <= this.myIndex) {
                    GameManager.instance.vConsole("数组越界：" + e.touches.length + " <= " + this.myIndex);
                    return;
                }
                this.touches = e.touches;
            }
            dx = this.touches[this.myIndex].stageX;
            dy = this.touches[this.myIndex].stageY;
            if (this.centerX >= 0 && this.centerY >= 0) {
                let dis = this.dis(this.centerX, this.centerY, dx, dy);
                if (dis > 40) {
                    this.stick.pos(this.centerX + Math.cos(this.angle) * 40, this.centerY + Math.sin(this.angle) * 40);
                }
                else {
                    this.stick.pos(dx, dy);
                }
                if (dis > 3) {
                    this.speed = 2;
                }
                else {
                    this.speed = 0;
                }
            }
        }
        mouseUp(e) {
            if (Laya.Browser.onPC) ;
            else {
                if (e.touchId != this.myIndex) {
                    return;
                }
            }
            this.myIndex = -1;
            Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
            this.speed = 0;
            this.stick.pos(this.round.x, this.round.y);
        }
        mouseOut(e) {
            if (Laya.Browser.onPC) ;
            else {
                if (e.touchId != this.myIndex) {
                    return;
                }
            }
            this.myIndex = -1;
            Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
            this.speed = 0;
            this.stick.pos(this.round.x, this.round.y);
        }
        outputData() {
            if (this.speed > 0) {
                var dx = 0;
                var dy = 0;
                if (Laya.Browser.onPC) {
                    dx = Laya.stage.mouseX - this.centerX;
                    dy = Laya.stage.mouseY - this.centerY;
                }
                else {
                    if (this.touches.length <= this.myIndex) {
                        GameManager.instance.vConsole("outputData.数组越界");
                        return;
                    }
                    dx = this.touches[this.myIndex].stageX - this.centerX;
                    dy = this.touches[this.myIndex].stageY - this.centerY;
                    if (isNaN(dx) || isNaN(dy)) {
                        dx = this.lastX;
                        dy = this.lastY;
                    }
                    else {
                        this.lastX = dx;
                        this.lastY = dy;
                    }
                }
                this.angle = Math.atan2(dy, dx);
                var h = Math.cos(this.angle) * this.speed;
                this.Horizontal = isNaN(h) ? 0 : h;
            }
        }
        dis(centerX, centerY, mouseX, mouseY) {
            let dx = centerX - mouseX;
            let dy = centerY - mouseY;
            let distance = Math.sqrt(dx * dx + dy * dy);
            return distance;
        }
    }

    class PlayerController extends Laya.Script3D {
        constructor() {
            super();
            this.motions = [
                "Unarmed-Idle",
                "Unarmed-Strafe-Forward",
                "Unarmed-Strafe-Backward",
                "Unarmed-Jump",
                "Unarmed-Land",
                "Unarmed-Attack-L1",
                "Unarmed-Attack-L2",
                "Unarmed-Attack-L3",
                "Unarmed-Attack-Kick-L1",
                "Unarmed-Defend",
            ];
            this.currentMotion = 0;
            this.animLastTime = 0;
            this.posy = 0;
            this.posz = 0;
            this.myIndex = -1;
            this.gameObject = GameManager.instance.playerA;
            this.animator = this.gameObject.getComponent(Laya.Animator);
            this.currentMotion = 0;
            this.animLastTime = 0;
            this.posy = 0;
            this.posz = 0;
            this._clickTime = 0;
            var gamePad = GameManager.instance.gamePad;
            this.fistBtn = gamePad.getChildByName("Fist");
            this.fistBtn.on(Laya.Event.MOUSE_DOWN, this, this.onFistHandler);
            this.kickBtn = gamePad.getChildByName("Kick");
            this.kickBtn.on(Laya.Event.MOUSE_DOWN, this, this.onKickHandler);
            this.jumpBtn = gamePad.getChildByName("Jump");
            this.jumpBtn.on(Laya.Event.MOUSE_DOWN, this, this.onJumpHandler);
            this.defendBtn = gamePad.getChildByName("Defend");
            this.defendBtn.on(Laya.Event.MOUSE_DOWN, this, this.onDefendHandler);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.handleMouseUp);
            JoystickManager.instance.stick.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        }
        onStart() {
            this.animator.play(this.motions[0]);
        }
        onUpdate() {
            if (this.gameObject.transform.position.y > 0 && this.posy == 0) {
                this.gameObject.transform.translate(new Laya.Vector3(0, -0.1, this.posz), true);
                if (this.gameObject.transform.position.y < 0) {
                    this.gameObject.transform.position.y = 0;
                }
            }
            else {
                this.gameObject.transform.translate(new Laya.Vector3(0, this.posy, this.posz), true);
            }
        }
        mouseDown(e) {
            if (this.animLastTime > Laya.Browser.now() - this._clickTime) {
                console.log("在播放其他动作");
                return;
            }
            this.myIndex = e.touchId;
            this.posz = 0;
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
            Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.mouseOut);
        }
        mouseMove(e) {
            if (this.animLastTime > Laya.Browser.now() - this._clickTime) {
                GameManager.instance.vConsole("在播放其他动作");
                this.posz = 0;
                return;
            }
            if (Laya.Browser.onPC) ;
            else {
                if (e.touchId != this.myIndex) {
                    return;
                }
            }
            this.posz = JoystickManager.instance.Horizontal * 0.02;
            this.currentMotion = (this.posz > 0) ? 1 : 2;
            this.animator.play(this.motions[this.currentMotion]);
        }
        mouseUp(e) {
            if (this.animLastTime > Laya.Browser.now() - this._clickTime) {
                console.log("在播放其他动作");
                return;
            }
            if (Laya.Browser.onPC) ;
            else {
                if (e.touchId != this.myIndex) {
                    GameManager.instance.vConsole("离开的点是其他手指：" + e.touchId + "，摇杆的手指是：" + this.myIndex);
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
        mouseOut(e) {
            if (this.animLastTime > Laya.Browser.now() - this._clickTime) {
                console.log("在播放其他动作");
                return;
            }
            if (Laya.Browser.onPC) ;
            else {
                if (e.touchId != this.myIndex) {
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
        handleMouseUp() {
            if (this.currentMotion == 9) {
                console.log("松手取消防御");
                this.animator.play(this.motions[0]);
            }
        }
        playIdle() {
            Laya.timer.clear(this, this.playOther);
            this.currentMotion = 0;
            this.animator.play(this.motions[this.currentMotion]);
            console.log("播放待机动画");
        }
        ;
        playOther() {
            this.animator.play(this.motions[this.currentMotion]);
        }
        ;
        onFistHandler(e) {
            this.animLastTime = 600;
            var waitTime = 0;
            if (this.animLastTime > Laya.Browser.now() - this._clickTime) {
                waitTime = this.animLastTime - (Laya.Browser.now() - this._clickTime);
                if (this.currentMotion == 5 && waitTime < 200) {
                    this._clickTime = Laya.Browser.now();
                    this.currentMotion = 6;
                    Laya.timer.once(waitTime, this, this.playOther);
                    console.log("========> onFistBtn.重拳2，等待：", waitTime);
                    waitTime += this.animLastTime;
                }
                else if (this.currentMotion == 6 && waitTime < 200) {
                    this._clickTime = Laya.Browser.now();
                    this.currentMotion = 7;
                    Laya.timer.once(waitTime, this, this.playOther);
                    console.log("========> onFistBtn.重拳3");
                    waitTime += this.animLastTime;
                }
                else {
                    console.error("点击过快");
                    return;
                }
            }
            else {
                waitTime = this.animLastTime;
                this._clickTime = Laya.Browser.now();
                this.currentMotion = 5;
                Laya.timer.once(0, this, this.playOther);
                console.log("========> onFistHandler.重拳1");
            }
            Laya.timer.once(waitTime, this, this.playIdle);
            console.log("播完自动放待机：", waitTime);
        }
        onKickHandler(e) {
            this.animLastTime = 600;
            var waitTime = 0;
            if (this.animLastTime > Laya.Browser.now() - this._clickTime) {
                waitTime = this.animLastTime - (Laya.Browser.now() - this._clickTime);
                console.error("点击过快，等待：", waitTime / 1000, "秒");
                return;
            }
            else {
                waitTime = this.animLastTime;
                this._clickTime = Laya.Browser.now();
                this.currentMotion = 8;
                Laya.timer.once(0, this, this.playOther);
                console.log("========> onKickHandler.踢腿");
            }
            Laya.timer.once(waitTime, this, this.playIdle);
            console.log("播完自动放待机：", waitTime);
        }
        onJumpHandler(e) {
            this.animLastTime = 800;
            var waitTime = 0;
            if (this.animLastTime > Laya.Browser.now() - this._clickTime) {
                waitTime = this.animLastTime - (Laya.Browser.now() - this._clickTime);
                console.error("点击过快，等待：", waitTime / 1000, "秒");
                return;
            }
            else {
                waitTime = this.animLastTime;
                this._clickTime = Laya.Browser.now();
                this.posy = 0.1;
                this.currentMotion = 3;
                this.animator.play(this.motions[this.currentMotion]);
                Laya.timer.once(300, this, function () {
                    this.posy = 0;
                    Laya.timer.once(100, this, function () {
                        this.currentMotion = 4;
                        this.animator.play(this.motions[this.currentMotion]);
                    });
                });
                console.log("========> onJumpHandler.跳跃");
            }
            Laya.timer.once(waitTime, this, this.playIdle);
            console.log("播完自动放待机：", waitTime);
        }
        onDefendHandler(e) {
            this.animLastTime = 800;
            var waitTime = 0;
            if (this.animLastTime > Laya.Browser.now() - this._clickTime) {
                waitTime = this.animLastTime - (Laya.Browser.now() - this._clickTime);
                console.error("点击过快，等待：", waitTime / 1000, "秒");
                return;
            }
            else {
                waitTime = this.animLastTime;
                this._clickTime = Laya.Browser.now();
                this.currentMotion = 9;
                this.animator.play(this.motions[this.currentMotion]);
                console.log("========> onDefendHandler.防御");
            }
        }
    }

    class GameManager extends Laya.Script {
        constructor() {
            super();
            Laya.stage.screenMode = "horizontal";
            GameManager.instance = this;
            Laya.Scene3D.load("res/unity3d/LayaScene.ls", Laya.Handler.create(this, function (scene) {
                Laya.stage.addChild(scene);
                scene.zOrder = -1;
                this.camera = scene.getChildByName("Main Camera");
                this.playerA = scene.getChildByName("RPG-CharacterA");
                this.playerA.addComponent(PlayerController);
                this.playerB = scene.getChildByName("RPG-CharacterB");
            }));
        }
        onStart() {
            var device_type = navigator.userAgent;
            console.log(device_type);
        }
        onAwake() {
            this.content = "";
            this.logText = this.logNode;
            Laya.stage.on(Laya.Event.DOUBLE_CLICK, this, this.resetConsole);
        }
        vConsole(msg) {
            if (msg == this.lastmsg) ;
            else {
                this.content += "\n" + msg;
            }
            this.logText.text = this.content;
            this.lastmsg = msg;
        }
        resetConsole() {
            this.content = "";
            this.logText.text = this.content;
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("scripts/GameManager.ts", GameManager);
            reg("scripts/JoystickManager.ts", JoystickManager);
        }
    }
    GameConfig.width = 1280;
    GameConfig.height = 720;
    GameConfig.scaleMode = "fixedheight";
    GameConfig.screenMode = "horizontal";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "Main.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
