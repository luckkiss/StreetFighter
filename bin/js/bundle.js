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
    GameConfig.startScene = "Load.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        class LoadUI extends Laya.Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(LoadUI.uiView);
            }
        }
        LoadUI.uiView = { "type": "Scene", "props": { "width": 1280, "name": "Load", "height": 720 }, "compId": 2, "child": [{ "type": "Script", "props": { "runtime": "laya.ui.Widget" }, "compId": 4 }, { "type": "ProgressBar", "props": { "x": 640, "width": 600, "var": "progressBar", "value": 0, "skin": "comp/progress.png", "sizeGrid": "0,10,0,10", "name": "ProgressBar", "height": 30, "bottom": 120, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5, "child": [{ "type": "Label", "props": { "x": 300, "var": "progressLabel", "text": "0%", "name": "ProgressLabel", "fontSize": 30, "font": "Arial", "color": "#ffffff", "bottom": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7 }] }], "loadList": ["comp/progress.png"], "loadList3D": [] };
        ui.LoadUI = LoadUI;
        REG("ui.LoadUI", LoadUI);
        class LobbyUI extends Laya.Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(LobbyUI.uiView);
            }
        }
        LobbyUI.uiView = { "type": "Scene", "props": { "width": 1280, "name": "Lobby", "height": 720 }, "compId": 2, "child": [{ "type": "Script", "props": { "y": 0, "x": 0, "runtime": "laya.ui.Widget" }, "compId": 5 }, { "type": "Button", "props": { "x": 640, "var": "signBtn", "skin": "comp/button.png", "name": "Sign", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "签到", "centerY": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }, { "type": "Button", "props": { "y": 359, "x": 640, "var": "matchBtn", "skin": "comp/button.png", "name": "Match", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "匹配", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }], "loadList": ["comp/button.png"], "loadList3D": [] };
        ui.LobbyUI = LobbyUI;
        REG("ui.LobbyUI", LobbyUI);
        class MainUI extends Laya.Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(MainUI.uiView);
            }
        }
        MainUI.uiView = { "type": "Scene", "props": { "width": 1280, "name": "Main", "height": 720 }, "compId": 2, "child": [{ "type": "Script", "props": { "y": 0, "x": 0, "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 51 }, { "type": "Script", "props": { "y": 0, "x": 0, "roundNode": "@node:57", "pad": "@node:41", "logText": "@node:71", "logNode": "@node:71", "gamePad": "@node:41", "directionNode": "@node:61", "runtime": "scripts/GameManager.ts" }, "compId": 46 }, { "type": "Script", "props": { "y": 0, "x": 0, "stickNode": "@node:61", "roundNode": "@node:57", "runtime": "scripts/JoystickManager.ts" }, "compId": 68 }, { "type": "Sprite", "props": { "name": "Viewport" }, "compId": 19, "child": [{ "type": "Text", "props": { "text": "左上1", "name": "TextUL", "fontSize": 40, "font": "Arial", "color": "#ffffff", "runtime": "laya.display.Text" }, "compId": 4 }, { "type": "Text", "props": { "y": 0, "x": 1200, "text": "右上", "name": "TextUR", "fontSize": 40, "color": "#ff0400", "runtime": "laya.display.Text" }, "compId": 12 }, { "type": "Text", "props": { "y": 680, "x": 0, "text": "左下", "name": "TextDL", "fontSize": 40, "color": "#ff0400", "runtime": "laya.display.Text" }, "compId": 14 }, { "type": "Text", "props": { "y": 680, "x": 1200, "text": "右下", "name": "TextDR", "fontSize": 40, "color": "#ff0400", "runtime": "laya.display.Text" }, "compId": 13 }, { "type": "Text", "props": { "x": 100, "presetID": 1, "y": 0, "width": 1080, "text": "log", "name": "Console", "isPresetRoot": true, "height": 720, "fontSize": 16, "color": "#ff0400", "runtime": "laya.display.Text" }, "compId": 71 }] }, { "type": "Image", "props": { "y": 550, "x": 170, "width": 240, "visible": false, "skin": "ui/joystickBg.png", "pivotY": 120, "pivotX": 120, "name": "Joystick", "height": 240 }, "compId": 31, "child": [{ "type": "Sprite", "props": { "y": 40, "x": 120, "width": 80, "texture": "ui/up.jpg", "pivotY": 40, "pivotX": 40, "name": "Up", "height": 80 }, "compId": 40 }, { "type": "Sprite", "props": { "y": 120, "x": 40, "width": 80, "texture": "ui/left.jpg", "pivotY": 40, "pivotX": 40, "name": "Left", "height": 80 }, "compId": 38 }, { "type": "Sprite", "props": { "y": 120, "x": 200, "width": 80, "texture": "ui/right.jpg", "pivotY": 40, "pivotX": 40, "name": "Right", "height": 80 }, "compId": 39 }, { "type": "Sprite", "props": { "y": 200, "x": 120, "width": 80, "texture": "ui/down.jpg", "pivotY": 40, "pivotX": 40, "name": "Down", "height": 80 }, "compId": 37 }] }, { "type": "Image", "props": { "width": 240, "skin": "ui/joystickBg.png", "right": 50, "pivotY": 120, "pivotX": 120, "name": "GamePad", "height": 240, "bottom": 57 }, "compId": 41, "child": [{ "type": "Image", "props": { "y": 50, "x": 120, "width": 100, "stateNum": 3, "skin": "ui/joystickPoint.png", "name": "Jump", "labelSize": 30, "label": "跳跃", "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 21 }, { "type": "Image", "props": { "y": 120, "x": 50, "width": 100, "stateNum": 3, "skin": "ui/joystickPoint.png", "name": "Defend", "labelSize": 30, "label": "防御", "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 22 }, { "type": "Image", "props": { "y": 120, "x": 190, "width": 100, "stateNum": 3, "skin": "ui/joystickPoint.png", "name": "Kick", "labelSize": 30, "label": "踢腿", "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 23 }, { "type": "Image", "props": { "y": 190, "x": 120, "width": 100, "stateNum": 3, "skin": "ui/joystickPoint.png", "name": "Fist", "labelSize": 30, "label": "重拳", "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 24 }] }, { "type": "Image", "props": { "y": 430, "x": 170, "width": 240, "skin": "ui/joystickBg.png", "name": "Round", "left": 50, "height": 240, "bottom": 50, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 57 }, { "type": "Image", "props": { "width": 180, "skin": "ui/joystickPoint.png", "name": "Stick", "left": 80, "height": 180, "bottom": 80, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 61 }], "loadList": ["prefab/Console.prefab", "ui/joystickBg.png", "ui/up.jpg", "ui/left.jpg", "ui/right.jpg", "ui/down.jpg", "ui/joystickPoint.png"], "loadList3D": [] };
        ui.MainUI = MainUI;
        REG("ui.MainUI", MainUI);
    })(ui || (ui = {}));

    class LobbyView extends ui.LobbyUI {
        static getInstance() {
            if (this.instance == null) {
                this.instance = new LobbyView();
            }
            return this.instance;
        }
        constructor() {
            super();
            this.createView(Laya.View.uiMap["Lobby"]);
            this.signBtn.on(Laya.Event.MOUSE_DOWN, this, this.onSign);
            this.matchBtn.on(Laya.Event.MOUSE_DOWN, this, this.onMatch);
        }
        onStart() {
            Laya.SoundManager.playMusic("res/audios/bgm.mp3", 0);
        }
        onSign() {
            console.log("签到.");
        }
        onMatch() {
            console.log("开始匹配...");
        }
    }

    class LoadView extends ui.LoadUI {
        static getInstance() {
            if (this.instance == null) {
                this.instance = new LoadView();
            }
            return this.instance;
        }
        constructor() {
            super();
            this.createView(Laya.View.uiMap["Load"]);
            this.progressBar.value = 0;
            this.progressLabel.text = "0%";
            Laya.timer.once(1000, this, this.onProLoaded);
        }
        onProLoaded() {
            var res = [
                { url: "res/atlas/ui.atlas", type: Laya.Loader.ATLAS },
                { url: "res/atlas/ui.png", type: Laya.Loader.IMAGE },
                { url: "res/audios/bgm.mp3", type: Laya.Loader.SOUND },
            ];
            Laya.loader.load(res, null, Laya.Handler.create(this, this.onProgress, null, false));
        }
        onProgress(pro) {
            this.progressBar.value = pro;
            this.progressLabel.text = Math.floor(pro * 100) + "%";
            if (this.progressBar.value == 1) {
                this.progressBar.value = pro;
                Laya.timer.once(1000, this, this.onComplete);
            }
        }
        onComplete() {
            var lobbyView = new LobbyView();
            Laya.stage.addChild(lobbyView);
            Laya.stage.removeChild(this);
        }
    }

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
            var res = [
                { url: "ui.json", type: Laya.Loader.JSON },
                { url: "res/atlas/comp.atlas", type: Laya.Loader.ATLAS },
                { url: "res/atlas/comp.png", type: Laya.Loader.IMAGE },
            ];
            Laya.loader.load(res, Laya.Handler.create(this, this.onLoaded));
        }
        onLoaded() {
            Laya.View.uiMap = Laya.Loader.getRes("ui.json");
            this.loadView = new LoadView();
            Laya.stage.addChild(this.loadView);
        }
    }
    new Main();

}());
