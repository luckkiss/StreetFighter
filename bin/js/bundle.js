(function () {
    'use strict';

    class PlayerController extends Laya.Script3D {
        constructor() {
            super();
            this.currentMotion = 0;
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
            this.animLastTime = 0;
            this.is_move = false;
            this.posy = 0;
            this.posz = 0;
            this.gameObject = GameManager.instance.player;
            this.animator = this.gameObject.getComponent(Laya.Animator);
            this.currentMotion = 0;
            this.is_move = false;
            this.animLastTime = 0;
            this.posy = 0;
            this.posz = 0;
            var gamePad = GameManager.instance.gamePad;
            this._clickTime = 0;
            this.fistBtn = gamePad.getChildByName("Fist");
            this.fistBtn.on(Laya.Event.MOUSE_DOWN, this, this.onFistHandler);
            this.kickBtn = gamePad.getChildByName("Kick");
            this.kickBtn.on(Laya.Event.MOUSE_DOWN, this, this.onKickHandler);
            this.jumpBtn = gamePad.getChildByName("Jump");
            this.jumpBtn.on(Laya.Event.MOUSE_DOWN, this, this.onJumpHandler);
            this.defendBtn = gamePad.getChildByName("Defend");
            this.defendBtn.on(Laya.Event.MOUSE_DOWN, this, this.onDefendHandler);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.handleMouseUp);
            Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.handleMouseOut);
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
        handleMouseUp() {
            if (this.currentMotion == 9) {
                console.log("松手取消防御");
                this.animator.play(this.motions[0]);
            }
        }
        handleMouseOut() {
        }
        playIdle() {
            Laya.timer.clear(this, this.playOther);
            this.animator.play(this.motions[0]);
        }
        ;
        playOther() {
            Laya.timer.clear(this, this.playIdle);
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
                    Laya.timer.clear(this, this.playIdle);
                    Laya.timer.once(waitTime, this, this.playOther);
                    console.log("========> onFistBtn.重拳2，等待：", waitTime);
                    waitTime += this.animLastTime;
                }
                else if (this.currentMotion == 6 && waitTime < 200) {
                    this._clickTime = Laya.Browser.now();
                    this.currentMotion = 7;
                    Laya.timer.clear(this, this.playIdle);
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
            return;
        }
    }

    class GameManager extends Laya.Script {
        constructor() {
            super();
            GameManager.instance = this;
            Laya.Scene3D.load("res/unity3d/LayaScene.ls", Laya.Handler.create(this, function (scene) {
                Laya.stage.addChild(scene);
                scene.zOrder = -1;
                this.camera = scene.getChildByName("Main Camera");
                this.player = scene.getChildByName("RPG-Character");
                this.player.addComponent(PlayerController);
                console.log("角色");
                var text = scene.getChildByName("Text");
                console.log("text: ", (text != null));
            }));
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("scripts/GameManager.ts", GameManager);
        }
    }
    GameConfig.width = 1280;
    GameConfig.height = 720;
    GameConfig.scaleMode = "fixedheight";
    GameConfig.screenMode = "none";
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
