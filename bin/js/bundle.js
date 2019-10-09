(function () {
    'use strict';

    class LogManager extends Laya.Script {
        constructor() {
            super();
            LogManager.instance = this;
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
            reg("scripts/LogManager.ts", LogManager);
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
    GameConfig.stat = true;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        class JoystickUI extends Laya.Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(JoystickUI.uiView);
            }
        }
        JoystickUI.uiView = { "type": "Scene", "props": { "zOrder": 1, "width": 1280, "name": "Joystick", "height": 720 }, "compId": 2, "child": [{ "type": "Image", "props": { "width": 180, "var": "stickImage", "skin": "ui/joystickPoint.png", "name": "Stick", "left": 50, "height": 180, "bottom": 50, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }, { "type": "Image", "props": { "width": 240, "var": "roundImage", "skin": "ui/joystickBg.png", "name": "Round", "left": 20, "height": 240, "bottom": 20, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }], "loadList": ["ui/joystickPoint.png", "ui/joystickBg.png"], "loadList3D": [] };
        ui.JoystickUI = JoystickUI;
        REG("ui.JoystickUI", JoystickUI);
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
        MainUI.uiView = { "type": "Scene", "props": { "width": 1280, "name": "Main", "height": 720 }, "compId": 2, "child": [{ "type": "Script", "props": { "y": 0, "x": 0, "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 51 }, { "type": "Script", "props": { "y": 0, "x": 0, "logNode": "@node:71", "gamePad": "@node:41", "runtime": "scripts/LogManager.ts" }, "compId": 72 }, { "type": "Sprite", "props": { "name": "Viewport" }, "compId": 19, "child": [{ "type": "Text", "props": { "text": "左上1", "name": "TextUL", "fontSize": 40, "font": "Arial", "color": "#ffffff", "runtime": "laya.display.Text" }, "compId": 4 }, { "type": "Text", "props": { "y": 0, "x": 1200, "text": "右上", "name": "TextUR", "fontSize": 40, "color": "#ff0400", "runtime": "laya.display.Text" }, "compId": 12 }, { "type": "Text", "props": { "y": 680, "x": 0, "text": "左下", "name": "TextDL", "fontSize": 40, "color": "#ff0400", "runtime": "laya.display.Text" }, "compId": 14 }, { "type": "Text", "props": { "y": 680, "x": 1200, "text": "右下", "name": "TextDR", "fontSize": 40, "color": "#ff0400", "runtime": "laya.display.Text" }, "compId": 13 }, { "type": "Text", "props": { "x": 100, "presetID": 1, "y": 0, "width": 1080, "text": "log", "name": "Console", "isPresetRoot": true, "height": 720, "fontSize": 16, "color": "#ff0400", "runtime": "laya.display.Text" }, "compId": 71 }] }, { "type": "Image", "props": { "width": 240, "skin": "ui/joystickBg.png", "right": 50, "pivotY": 120, "pivotX": 120, "name": "GamePad", "height": 240, "bottom": 57 }, "compId": 41, "child": [{ "type": "Image", "props": { "y": 50, "x": 120, "width": 100, "stateNum": 3, "skin": "ui/joystickPoint.png", "name": "Jump", "labelSize": 30, "label": "跳跃", "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 21 }, { "type": "Image", "props": { "y": 120, "x": 50, "width": 100, "stateNum": 3, "skin": "ui/joystickPoint.png", "name": "Defend", "labelSize": 30, "label": "防御", "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 22 }, { "type": "Image", "props": { "y": 120, "x": 190, "width": 100, "stateNum": 3, "skin": "ui/joystickPoint.png", "name": "Kick", "labelSize": 30, "label": "踢腿", "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 23 }, { "type": "Image", "props": { "y": 190, "x": 120, "width": 100, "stateNum": 3, "skin": "ui/joystickPoint.png", "name": "Fist", "labelSize": 30, "label": "重拳", "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 24 }] }, { "type": "Image", "props": { "y": 430, "width": 240, "visible": false, "var": "roundImage", "skin": "ui/joystickBg.png", "name": "Round", "mouseThrough": true, "mouseEnabled": false, "left": 550, "hitTestPrior": false, "height": 240, "bottom": 50, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 57 }, { "type": "Image", "props": { "y": 0, "width": 180, "visible": false, "var": "stickImage", "skin": "ui/joystickPoint.png", "name": "Stick", "mouseThrough": true, "left": 580, "height": 180, "bottom": 80, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 61 }, { "type": "Button", "props": { "var": "exitBtn", "skin": "comp/button.png", "name": "Exit", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "离开" }, "compId": 73 }], "loadList": ["prefab/Console.prefab", "ui/joystickBg.png", "ui/joystickPoint.png", "comp/button.png"], "loadList3D": [] };
        ui.MainUI = MainUI;
        REG("ui.MainUI", MainUI);
    })(ui || (ui = {}));

    class JoystickView extends ui.JoystickUI {
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
            this.createView(Laya.View.uiMap["Joystick"]);
            JoystickView.instance = this;
            console.log("roundImage: ", this.roundImage != null);
            console.log("stickImage: ", this.stickImage != null);
            this.stickImage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
            Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.mouseOut);
            Laya.timer.frameLoop(1, this, this.outputData);
        }
        mouseDown(e) {
            console.log("mouseDown");
            this.myIndex = e.touchId;
            this.centerX = this.roundImage.x;
            this.centerY = this.roundImage.y;
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        }
        mouseMove(e) {
            console.log("mouseMove");
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
                    return;
                }
                this.touches = e.touches;
                dx = this.touches[this.myIndex].stageX;
                dy = this.touches[this.myIndex].stageY;
            }
            if (this.centerX >= 0 && this.centerY >= 0) {
                let dis = this.dis(this.centerX, this.centerY, dx, dy);
                if (dis > 40) {
                    this.stickImage.pos(this.centerX + Math.cos(this.angle) * 40, this.centerY + Math.sin(this.angle) * 40);
                }
                else {
                    this.stickImage.pos(dx, dy);
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
            console.log("mouseUp");
            if (Laya.Browser.onPC) ;
            else {
                if (e.touchId != this.myIndex) {
                    return;
                }
            }
            this.myIndex = -1;
            Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
            this.speed = 0;
            this.stickImage.pos(this.roundImage.x, this.roundImage.y);
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
            this.stickImage.pos(this.roundImage.x, this.roundImage.y);
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

    class TestScript extends Laya.Script {
        constructor() {
            super();
        }
        onStart() {
        }
        InitData(sp) {
            this.gameObject = sp;
            console.log("gameObject:", this.gameObject != null);
            this.animator = this.gameObject.getComponent(Laya.Animator);
            console.log("animator:", this.animator != null);
        }
    }

    class MainView extends ui.MainUI {
        static getInstance() {
            if (this.instance == null) {
                this.instance = new MainView();
            }
            return this.instance;
        }
        constructor() {
            super();
            this.createView(Laya.View.uiMap["Main"]);
            var joystick = new JoystickView();
            Laya.stage.addChild(joystick);
            Laya.Scene3D.load("res/scenes/Empty.ls", Laya.Handler.create(this, this.onScene3DComplete));
            this.exitBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
                Laya.stage.removeChild(this.scene3d);
                Laya.stage.removeChild(this.playerA);
                Laya.stage.removeChild(this);
                var lobbyView = new LobbyView();
                Laya.stage.addChild(lobbyView);
                console.log("离开游戏");
            });
        }
        onScene3DComplete(sc) {
            this.scene3d = sc;
            this.scene3d.zOrder = -1;
            Laya.stage.addChild(this.scene3d);
            console.log("场景加载完成");
            Laya.Sprite3D.load("res/prefabs/RPG-CharacterA.lh", Laya.Handler.create(this, this.onPlayerAComplete));
        }
        onPlayerAComplete(sp) {
            console.log("3D精灵加载完成");
            if (this.playerA == null) {
                this.playerA = this.scene3d.addChild(sp);
                var script = this.playerA.addComponent(TestScript);
                script.InitData(this.playerA);
            }
        }
    }

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
            Laya.SoundManager.playMusic("res/audios/bgm.mp3", 0);
            Laya.SoundManager.autoStopMusic = true;
            console.log("播放音乐");
        }
        onSign() {
            console.log("签到.");
        }
        onMatch() {
            console.log("开始匹配...");
            Laya.timer.once(1000, this, this.onEnterGame);
        }
        onEnterGame() {
            var mainView = new MainView();
            Laya.stage.addChild(mainView);
            Laya.stage.removeChild(this);
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
                { url: "res/atlas/ui.atlas", type: Laya.Loader.ATLAS },
                { url: "res/atlas/ui.png", type: Laya.Loader.IMAGE },
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
