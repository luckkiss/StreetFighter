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
    GameConfig.width = 1136;
    GameConfig.height = 640;
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
        class ChooseUI extends Laya.Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(ChooseUI.uiView);
            }
        }
        ChooseUI.uiView = { "type": "Scene", "props": { "zOrder": 99, "width": 1136, "name": "Choose", "height": 640 }, "compId": 2, "child": [{ "type": "Image", "props": { "width": 1136, "var": "mask", "skin": "comp/img_blank.png", "name": "Mask", "label": "确定", "height": 640, "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5, "child": [{ "type": "Image", "props": { "width": 360, "skin": "comp/img_blank.png", "name": "Page", "label": "确定", "height": 200, "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 6, "child": [{ "type": "Label", "props": { "top": 60, "text": "确定要选择吗？", "styleSkin": "comp/image.png", "fontSize": 20, "color": "#ffffff", "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 9 }, { "type": "Button", "props": { "var": "yesBtn", "skin": "comp/button.png", "name": "YesBtn", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "确定", "centerX": 80, "bottom": 40, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }, { "type": "Button", "props": { "var": "noBtn", "skin": "comp/button.png", "name": "NoBtn", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "取消", "centerX": -80, "bottom": 40, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }] }] }], "loadList": ["comp/img_blank.png", "comp/image.png", "comp/button.png"], "loadList3D": [] };
        ui.ChooseUI = ChooseUI;
        REG("ui.ChooseUI", ChooseUI);
        class JoystickUI extends Laya.Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(JoystickUI.uiView);
            }
        }
        JoystickUI.uiView = { "type": "Scene", "props": { "zOrder": 1, "width": 1136, "name": "Joystick", "mouseThrough": true, "height": 640 }, "compId": 2, "child": [{ "type": "Image", "props": { "width": 180, "var": "stickImage", "skin": "ui/joystickPoint.png", "name": "Stick", "left": 50, "height": 180, "bottom": 50, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }, { "type": "Image", "props": { "width": 240, "var": "roundImage", "skin": "ui/joystickBg.png", "name": "Round", "left": 20, "height": 240, "bottom": 20, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }], "loadList": ["ui/joystickPoint.png", "ui/joystickBg.png"], "loadList3D": [] };
        ui.JoystickUI = JoystickUI;
        REG("ui.JoystickUI", JoystickUI);
        class LoadUI extends Laya.Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(LoadUI.uiView);
            }
        }
        LoadUI.uiView = { "type": "Scene", "props": { "width": 1136, "name": "Load", "height": 640 }, "compId": 2, "child": [{ "type": "Script", "props": { "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 4 }, { "type": "ProgressBar", "props": { "width": 600, "var": "progressBar", "value": 0, "skin": "comp/progress.png", "sizeGrid": "0,10,0,10", "name": "ProgressBar", "height": 30, "centerX": 0.5, "bottom": 120, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5, "child": [{ "type": "Label", "props": { "var": "progressLabel", "text": "0%", "name": "ProgressLabel", "fontSize": 30, "font": "Arial", "color": "#ffffff", "centerX": 0.5, "bottom": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7 }] }], "loadList": ["comp/progress.png"], "loadList3D": [] };
        ui.LoadUI = LoadUI;
        REG("ui.LoadUI", LoadUI);
        class LoadingUI extends Laya.Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(LoadingUI.uiView);
            }
        }
        LoadingUI.uiView = { "type": "Scene", "props": { "zOrder": 99, "width": 1136, "name": "Loading", "height": 640 }, "compId": 2, "child": [{ "type": "Image", "props": { "width": 1136, "var": "loadingPanel", "skin": "comp/img_blank.png", "name": "LoadingPanel", "height": 640, "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3, "child": [{ "type": "Image", "props": { "width": 100, "var": "loadingImage", "skin": "ui/loading.png", "name": "LoadingImage", "height": 100, "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 39 }, { "type": "Label", "props": { "y": 380, "var": "loadingText", "text": "加载中...", "name": "LoadingText", "fontSize": 22, "color": "#ffffff", "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5, "align": "center" }, "compId": 40 }] }], "loadList": ["comp/img_blank.png", "ui/loading.png"], "loadList3D": [] };
        ui.LoadingUI = LoadingUI;
        REG("ui.LoadingUI", LoadingUI);
        class LobbyUI extends Laya.Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(LobbyUI.uiView);
            }
        }
        LobbyUI.uiView = { "type": "Scene", "props": { "width": 1136, "name": "Lobby", "height": 640 }, "compId": 2, "child": [{ "type": "Script", "props": { "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 5 }, { "type": "Clip", "props": { "y": 0, "x": 0, "skin": "ui/bg2.jpg", "scaleY": 1.12, "scaleX": 1.12, "name": "Background", "clipWidth": 1015 }, "compId": 44, "child": [{ "type": "Button", "props": { "width": 100, "var": "signBtn", "top": 20, "skin": "comp/button.png", "right": 20, "name": "Sign", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "签到", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }, { "type": "Button", "props": { "width": 100, "var": "matchBtn", "skin": "comp/button.png", "right": 20, "name": "Match", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "匹配", "bottom": 20, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }] }, { "type": "Image", "props": { "width": 1136, "top": 0, "name": "UserPanel", "left": 0, "height": 640, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 22, "child": [{ "type": "Image", "props": { "y": 20, "width": 80, "skin": "comp/img_bg5.png", "sizeGrid": "10,10,10,10", "name": "HeadImg", "left": 20, "height": 80 }, "compId": 23, "child": [{ "type": "Text", "props": { "y": 10, "x": 100, "var": "nickNameText", "text": "用户昵称", "name": "NickName", "fontSize": 22, "color": "#ffffff", "runtime": "laya.display.Text" }, "compId": 24 }] }] }, { "type": "Image", "props": { "y": 320, "x": 568, "width": 1136, "var": "registerPanel", "skin": "comp/img_blank.png", "name": "RegisterPanel", "height": 640, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 9, "child": [{ "type": "Image", "props": { "y": 320, "x": 568, "width": 600, "skin": "comp/img_blank.png", "name": "Page", "height": 320, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 10, "child": [{ "type": "Text", "props": { "y": 64, "x": 150, "text": "用户名", "fontSize": 22, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 17 }, { "type": "TextInput", "props": { "y": 60, "x": 240, "width": 160, "var": "nicknameInput", "valign": "middle", "skin": "comp/textinput.png", "sizeGrid": "10,10,10,10", "name": "NicknameInput", "height": 30, "fontSize": 22, "font": "Arial" }, "compId": 11, "child": [{ "type": "Text", "props": { "y": 35, "text": "2-12个字符", "fontSize": 12, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 20 }] }, { "type": "Text", "props": { "y": 124, "x": 172, "text": "密码", "fontSize": 22, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 18 }, { "type": "TextInput", "props": { "y": 120, "x": 240, "width": 160, "var": "passwordInput", "valign": "middle", "skin": "comp/textinput.png", "sizeGrid": "10,10,10,10", "name": "Password", "height": 30, "fontSize": 22, "font": "Arial" }, "compId": 12, "child": [{ "type": "Text", "props": { "y": 35, "x": 0, "text": "6-16个字符", "fontSize": 12, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 21 }] }, { "type": "Text", "props": { "y": 184, "x": 128, "text": "确认密码", "fontSize": 22, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 19 }, { "type": "TextInput", "props": { "y": 180, "x": 240, "width": 160, "var": "password2Input", "valign": "middle", "skin": "comp/textinput.png", "sizeGrid": "10,10,10,10", "name": "Password2", "height": 30, "fontSize": 22, "font": "Arial" }, "compId": 16 }, { "type": "Button", "props": { "x": 320, "width": 160, "var": "registerBtn", "skin": "comp/button.png", "sizeGrid": "10,10,10,10", "name": "RegisterBtn", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "立即注册", "height": 40, "bottom": 50, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 13 }, { "type": "Label", "props": { "width": 160, "var": "goLoginBtn", "valign": "middle", "text": "去登陆", "styleSkin": "comp/button.png", "sizeGrid": "10,10,10,10", "right": 0, "name": "GoLoginBtn", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "去登陆", "height": 40, "fontSize": 22, "color": "#ffffff", "bottom": 0, "anchorY": 1, "anchorX": 1, "align": "center" }, "compId": 62 }] }] }, { "type": "Image", "props": { "y": 320, "x": 568, "width": 1136, "var": "loginPanel", "skin": "comp/img_blank.png", "name": "LoginPanel", "height": 640, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 51, "child": [{ "type": "Image", "props": { "y": 320, "x": 568, "width": 600, "skin": "comp/img_blank.png", "name": "Page", "height": 320, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 52, "child": [{ "type": "Text", "props": { "y": 84, "x": 150, "text": "用户名", "fontSize": 22, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 53 }, { "type": "TextInput", "props": { "y": 80, "x": 240, "width": 160, "var": "loginNickname", "valign": "middle", "skin": "comp/textinput.png", "sizeGrid": "10,10,10,10", "name": "LoginNickname", "height": 30, "fontSize": 22, "font": "Arial" }, "compId": 54, "child": [{ "type": "Text", "props": { "y": 35, "text": "2-12个字符", "fontSize": 12, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 55 }] }, { "type": "Text", "props": { "y": 144, "x": 172, "text": "密码", "fontSize": 22, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 56 }, { "type": "TextInput", "props": { "y": 140, "x": 240, "width": 160, "var": "loginPassword", "valign": "middle", "skin": "comp/textinput.png", "sizeGrid": "10,10,10,10", "name": "LoginPassword", "height": 30, "fontSize": 22, "font": "Arial" }, "compId": 57, "child": [{ "type": "Text", "props": { "y": 35, "x": 0, "text": "6-16个字符", "fontSize": 12, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 58 }] }, { "type": "Button", "props": { "x": 320, "width": 160, "var": "loginBtn", "skin": "comp/button.png", "sizeGrid": "10,10,10,10", "name": "LoginBtn", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "立即登录", "height": 40, "bottom": 50, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 61 }, { "type": "Label", "props": { "width": 160, "var": "goRegisterBtn", "valign": "middle", "text": "去注册", "styleSkin": "comp/button.png", "sizeGrid": "10,10,10,10", "right": 0, "name": "GoRegisterBtn", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "去登陆", "height": 40, "fontSize": 22, "color": "#ffffff", "bottom": 0, "anchorY": 1, "anchorX": 1, "align": "center" }, "compId": 63 }] }] }, { "type": "Image", "props": { "zOrder": 1, "y": 320, "x": 568, "width": 1136, "var": "awardPanel", "skin": "comp/img_blank.png", "name": "AwardPanel", "height": 640, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 25, "child": [{ "type": "Image", "props": { "y": 320, "x": 568, "width": 320, "skin": "comp/img_blank.png", "name": "Page", "height": 360, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 26, "child": [{ "type": "Text", "props": { "y": 40, "x": 116, "text": "恭喜获得", "pivotX": 0.5, "fontSize": 22, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 27 }, { "type": "Image", "props": { "y": 100, "x": 110, "width": 100, "skin": "comp/img_bg4.png", "sizeGrid": "10,10,10,10", "name": "AwardImg", "height": 100 }, "compId": 37 }, { "type": "Button", "props": { "y": 260, "width": 160, "skin": "comp/button.png", "sizeGrid": "10,10,10,10", "name": "Register", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "领取双倍", "height": 40, "centerX": 1, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 35 }, { "type": "Label", "props": { "y": 313, "x": 160, "var": "closeAwardBtn", "text": "直接关闭", "name": "CloseAward", "fontSize": 14, "color": "#ffffff", "centerX": 1, "bottom": 40, "anchorY": 0.5, "anchorX": 0.5, "align": "center" }, "compId": 36 }] }] }, { "type": "Image", "props": { "zOrder": 1, "y": 320, "x": 568, "width": 1136, "var": "matchPanel", "skin": "comp/img_blank.png", "name": "MatchPanel", "height": 640, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 45, "child": [{ "type": "Image", "props": { "y": 320, "x": 568, "width": 320, "skin": "comp/img_blank.png", "name": "Page", "height": 240, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 46, "child": [{ "type": "Label", "props": { "y": 80, "x": 127, "var": "matchText", "text": "匹配中", "pivotY": 0.5, "name": "MatchText", "fontSize": 22, "color": "#ffffff" }, "compId": 47 }, { "type": "Button", "props": { "y": 160, "width": 160, "var": "cancelMatchBtn", "skin": "comp/button.png", "sizeGrid": "10,10,10,10", "name": "CancelMatchBtn", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "取消匹配", "height": 40, "centerX": 1, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 49 }] }] }], "loadList": ["ui/bg2.jpg", "comp/button.png", "comp/img_bg5.png", "comp/img_blank.png", "comp/textinput.png", "comp/img_bg4.png"], "loadList3D": [] };
        ui.LobbyUI = LobbyUI;
        REG("ui.LobbyUI", LobbyUI);
        class MatchUI extends Laya.Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(MatchUI.uiView);
            }
        }
        MatchUI.uiView = { "type": "Scene", "props": { "width": 1136, "name": "Main", "height": 640 }, "compId": 2, "child": [{ "type": "Script", "props": { "y": 0, "x": 0, "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 51 }, { "type": "Script", "props": { "y": 0, "x": 0, "logNode": "@node:71", "gamePad": "@node:41", "runtime": "scripts/LogManager.ts" }, "compId": 72 }, { "type": "Sprite", "props": { "name": "Viewport" }, "compId": 19, "child": [{ "type": "Label", "props": { "y": 320, "x": 568, "width": 936, "text": "log", "name": "Console", "height": 640, "fontSize": 16, "color": "#ff0400", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 71 }] }, { "type": "Image", "props": { "width": 240, "var": "gamePad", "skin": "ui/joystickBg.png", "right": 50, "pivotY": 120, "pivotX": 120, "name": "GamePad", "height": 240, "bottom": 57 }, "compId": 41, "child": [{ "type": "Image", "props": { "y": 50, "x": 120, "width": 100, "var": "jumpBtn", "stateNum": 3, "skin": "ui/joystickPoint.png", "name": "JumpBtn", "labelSize": 30, "label": "跳跃", "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 21 }, { "type": "Image", "props": { "y": 120, "x": 50, "width": 100, "var": "defendBtn", "stateNum": 3, "skin": "ui/joystickPoint.png", "name": "DefendBtn", "labelSize": 30, "label": "防御", "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 22 }, { "type": "Image", "props": { "y": 120, "x": 190, "width": 100, "var": "kickBtn", "stateNum": 3, "skin": "ui/joystickPoint.png", "name": "KickBtn", "labelSize": 30, "label": "踢腿", "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 23 }, { "type": "Image", "props": { "y": 190, "x": 120, "width": 100, "var": "fistBtn", "stateNum": 3, "skin": "ui/joystickPoint.png", "name": "FistBtn", "labelSize": 30, "label": "重拳", "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 24 }] }, { "type": "Button", "props": { "width": 70, "var": "exitBtn", "top": 10, "skin": "comp/button.png", "name": "Exit", "left": 10, "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "离开" }, "compId": 73 }, { "type": "Label", "props": { "top": 45, "text": "VS", "styleSkin": "comp/button.png", "name": "VS", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "离开", "fontSize": 44, "color": "#ffcc00", "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 84 }, { "type": "Image", "props": { "width": 1136, "var": "leftHPPanel", "top": 0, "name": "LeftHPPanel", "height": 640, "clipWidth": 10, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 79, "child": [{ "type": "Label", "props": { "y": 40, "x": 200, "var": "name0Text", "text": "Player0", "styleSkin": "comp/label.png", "name": "Name0Text", "fontSize": 22, "color": "#ffffff", "anchorY": 0.5, "anchorX": 0 }, "compId": 82 }, { "type": "Image", "props": { "y": 16, "width": 310, "top": 50, "skin": "comp/progress$bar.png", "sizeGrid": "10,10,10,10", "name": "Background", "left": 200, "height": 32, "clipWidth": 10, "anchorY": 0.5 }, "compId": 77, "child": [{ "type": "Clip", "props": { "y": 16, "x": 5, "width": 300, "var": "fillImage0", "skin": "comp/progress.png", "sizeGrid": "10,10,10,10", "name": "FillImage0", "height": 24, "anchorY": 0.5, "anchorX": 0 }, "compId": 78 }, { "type": "Label", "props": { "var": "hp0Text", "text": "300", "styleSkin": "comp/label.png", "name": "HP0Text", "fontSize": 24, "color": "#ff0400", "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5, "align": "right" }, "compId": 83 }] }] }, { "type": "Image", "props": { "width": 1136, "var": "rightHPPanel", "top": 0, "name": "RightHPPanel", "height": 640, "clipWidth": 10, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 85, "child": [{ "type": "Label", "props": { "var": "name1Text", "top": 30, "text": "Player1", "styleSkin": "comp/label.png", "right": 200, "name": "Name1Text", "fontSize": 22, "color": "#ffffff", "anchorY": 0.5, "anchorX": 1 }, "compId": 86 }, { "type": "Image", "props": { "width": 310, "top": 50, "skin": "comp/progress$bar.png", "sizeGrid": "10,10,10,10", "right": 200, "name": "Background", "height": 32, "clipWidth": 10, "anchorY": 0.5, "anchorX": 1 }, "compId": 88, "child": [{ "type": "Clip", "props": { "y": 16, "x": 305, "width": 300, "var": "fillImage1", "skin": "comp/progress.png", "sizeGrid": "10,10,10,10", "name": "FillImage1", "height": 24, "anchorY": 0.5, "anchorX": 1 }, "compId": 89 }, { "type": "Label", "props": { "var": "hp1Text", "text": "300", "styleSkin": "comp/label.png", "name": "HP1Text", "fontSize": 24, "color": "#ff0400", "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 87 }] }] }], "loadList": ["ui/joystickBg.png", "ui/joystickPoint.png", "comp/button.png", "comp/label.png", "comp/progress$bar.png", "comp/progress.png"], "loadList3D": [] };
        ui.MatchUI = MatchUI;
        REG("ui.MatchUI", MatchUI);
        class TipsUI extends Laya.Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(TipsUI.uiView);
            }
        }
        TipsUI.uiView = { "type": "Scene", "props": { "width": 1136, "name": "Tips", "height": 640 }, "compId": 2, "child": [{ "type": "Image", "props": { "zOrder": 99, "width": 1136, "name": "TipsPanel", "height": 640, "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4, "child": [{ "type": "Image", "props": { "width": 150, "var": "bgImage", "text": "消息提示", "skin": "comp/img_blank.png", "name": "Background", "height": 50, "fontSize": 22, "color": "#ffffff", "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 6, "child": [{ "type": "Label", "props": { "y": 26, "x": 76, "var": "messageText", "text": "消息提示", "name": "MessageText", "fontSize": 22, "color": "#ffffff", "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5 }] }] }], "loadList": ["comp/img_blank.png"], "loadList3D": [] };
        ui.TipsUI = TipsUI;
        REG("ui.TipsUI", TipsUI);
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
            JoystickView.instance = this;
            this.stickImage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
            Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.mouseOut);
            Laya.timer.frameLoop(1, this, this.outputData);
        }
        mouseDown(e) {
            this.myIndex = e.touchId;
            this.centerX = this.roundImage.x;
            this.centerY = this.roundImage.y;
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

    class WebSocketClient extends Laya.Script {
        constructor() {
            super();
            this.url = "ws://192.168.1.101:3001";
        }
        static getInstance() {
            if (this.instance == null) {
                this.instance = new WebSocketClient();
            }
            return this.instance;
        }
        get isConnected() {
            if (this.socket != null && this.socket.connected) {
                return true;
            }
            return false;
        }
        reconnect() {
            if (this.socket == null)
                this.socket = new Laya.Socket();
            this.socket.connectByUrl(this.url);
        }
        initSocket() {
            this.byte = new Laya.Byte();
            this.byte.endian = Laya.Byte.LITTLE_ENDIAN;
            this.socket = new Laya.Socket();
            this.socket.endian = Laya.Byte.LITTLE_ENDIAN;
            this.socket.connectByUrl(this.url);
            this.socket.on(Laya.Event.OPEN, this, this.openHandler);
            this.socket.on(Laya.Event.MESSAGE, this, this.receiveHandler);
            this.socket.on(Laya.Event.CLOSE, this, this.closeHandler);
            this.socket.on(Laya.Event.ERROR, this, this.errorHandler);
        }
        sendData(obj) {
            if (!this.socket.connected) {
                console.error("已经断开连接.");
                return;
            }
            this.socket.send(JSON.stringify(obj));
        }
        openHandler(event = null) {
            console.log("正确建立连接；");
            var obj = {
                "type": "connected"
            };
            Laya.stage.event("nethandle", obj);
        }
        receiveHandler(msg = null) {
            var obj = JSON.parse(msg);
            Laya.stage.event("nethandle", obj);
        }
        closeHandler(e = null) {
            console.log("关闭事件");
        }
        errorHandler(e = null) {
            console.log("连接出错");
        }
    }

    class PlayerController extends Laya.Script3D {
        constructor() {
            super();
            this.myIndex = -1;
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
                "Unarmed-GetHit-F1",
                "Unarmed-Death1",
            ];
            this.currentMotion = 0;
            this.animLastTime = 0;
            this.posy = 0;
            this._posz = 0;
            this.distance = 0;
            this.client = null;
            this.clientUid = "";
            this.modelUid = "";
            this.isLocalPlayer = false;
            this.direction = 1;
            this.client = WebSocketClient.getInstance();
            Laya.stage.on("nethandle", this, this.handle);
            this.distance = 0;
        }
        get posz() {
            return this._posz;
        }
        set posz(z) {
            if (this.isLocalPlayer == false)
                return;
            console.log("发送z：", z.toFixed(3) + " / " + this.distance.toFixed(1));
            if (this.distance < 1.5 && this.direction == 1 && z > 0) {
                console.log("我在左边，无法再接近");
                z = 0;
            }
            else if (this.distance < 1.5 && this.direction == -1 && z > 0) {
                console.log("我在右边，无法再接近");
                z = 0;
            }
            var obj = {
                "type": "cs_move",
                "uid": this.clientUid,
                "posz": z,
            };
            this.client.sendData(obj);
        }
        checkDistance() {
            this.distance = MatchView.instance.checkDistance();
        }
        getOtherPlayer() {
            if (this == MatchView.instance.scriptA) {
                return MatchView.instance.scriptB;
            }
            else if (this == MatchView.instance.scriptB) {
                return MatchView.instance.scriptA;
            }
            return null;
        }
        handle(obj) {
            var isDriven = (obj.uid == this.modelUid);
            switch (obj.type) {
                case "sc_fist": {
                    if (isDriven) {
                        this.onFistCallback(this.touchEvent);
                    }
                    break;
                }
                case "sc_kick": {
                    if (isDriven) {
                        this.onKickCallback(this.touchEvent);
                        console.log("本地踢脚");
                    }
                    break;
                }
                case "sc_jump": {
                    if (isDriven) {
                        this.onJumpCallback(this.touchEvent);
                        console.log("本地跳跃");
                    }
                    break;
                }
                case "sc_defend": {
                    console.log("[防御]" + obj.uid + ":" + obj.defend);
                    if (isDriven) {
                        if (obj.defend == 1) {
                            this.onDefendCallback(this.touchEvent);
                            console.log("本地防御");
                        }
                        else if (obj.defend == 0) {
                            this.handleMouseUp();
                            console.log("本地取消防御");
                            this.currentMotion = 0;
                        }
                    }
                    break;
                }
                case "sc_move": {
                    if (isDriven) {
                        this._posz = obj.posz;
                    }
                    break;
                }
                case "sc_hit": {
                    if (isDriven) {
                        if (obj.broken == 1) {
                            console.log(obj.uid, "被破防了");
                        }
                        if (obj.damage == 0) {
                            console.log(obj.uid, "防御了，在他边上创建防御特效");
                        }
                        else if (obj.damage > 0) {
                            console.log(obj.uid + "受伤了(-" + obj.damage + ")，让他播放挨打硬直");
                            MatchView.instance.updateHP(this, obj.damage);
                        }
                    }
                }
            }
        }
        setUid(modelid, side) {
            console.log("设置uid：" + modelid);
            this.modelUid = modelid;
            this.clientUid = MatchView.instance.uid;
            this.isLocalPlayer = (this.modelUid == this.clientUid);
            this.direction = (side == 0) ? 1 : -1;
            this.gameObject = this.owner;
            this.animator = this.gameObject.getComponent(Laya.Animator);
            this.animator.play(this.motions[0]);
            this.currentMotion = 0;
            this.animLastTime = 0;
            this.posy = 0;
            this.posz = 0;
            this._clickTime = 0;
            if (this.isLocalPlayer) {
                MatchView.instance.fistBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendFist);
                MatchView.instance.kickBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendKick);
                MatchView.instance.jumpBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendJump);
                MatchView.instance.defendBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendDefend);
                Laya.stage.on(Laya.Event.MOUSE_UP, this, this.sendCancelDefend);
                if (this.isLocalPlayer) {
                    JoystickView.instance.stickImage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
                }
            }
            Laya.stage.frameLoop(1, this, () => {
                if (this.distance < 1.5 && this.direction == 1 && this.posz > 0) {
                    console.log("我在左边，无法再接近");
                    this.posz = 0;
                }
                else if (this.distance < 1.5 && this.direction == -1 && this.posz > 0) {
                    console.log("我在右边，无法再接近");
                    this.posz = 0;
                }
                if (this.gameObject.transform.position.y > 0 && this.posy == 0) {
                    this.gameObject.transform.translate(new Laya.Vector3(0, -0.1, this.posz), true);
                    if (this.gameObject.transform.position.y < 0) {
                        this.gameObject.transform.position.y = 0;
                    }
                }
                else {
                    this.gameObject.transform.translate(new Laya.Vector3(0, this.posy, this.posz), true);
                }
                if (this.isLocalPlayer == false && (this.animLastTime <= Laya.Browser.now() - this._clickTime)) {
                    var motion = 0;
                    if ((this.posz > 0)) {
                        motion = 1;
                    }
                    else if (this.posz < 0) {
                        motion = 2;
                    }
                    else {
                        motion = 0;
                    }
                    if (this.currentMotion != motion && this.currentMotion != 9) {
                        this.currentMotion = motion;
                        this.animator.play(this.motions[this.currentMotion]);
                    }
                }
            });
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
            Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.mouseUp);
            if (this.isLocalPlayer) {
                Laya.timer.frameLoop(1, this, this.checkDistance);
            }
        }
        mouseMove(e) {
            if (this.animLastTime > Laya.Browser.now() - this._clickTime) {
                this.posz = 0;
                return;
            }
            if (Laya.Browser.onPC) ;
            else {
                if (e.touchId != this.myIndex) {
                    return;
                }
            }
            if (this.isLocalPlayer) {
                this.posz = JoystickView.instance.Horizontal * 0.02 * this.direction;
                this.currentMotion = (this.posz > 0) ? 1 : 2;
                this.animator.play(this.motions[this.currentMotion]);
            }
        }
        mouseUp(e) {
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
            Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.mouseUp);
            if (this.isLocalPlayer) {
                Laya.timer.clear(this, this.checkDistance);
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
        sendFist(e) {
            this.touchEvent = e;
            var obj = {
                "type": "cs_fist",
                "uid": this.clientUid,
            };
            this.client.sendData(obj);
        }
        onFistCallback(e) {
            this.animLastTime = 600;
            var waitTime = 0;
            var hitAmount = 10;
            if (this.animLastTime > Laya.Browser.now() - this._clickTime) {
                waitTime = this.animLastTime - (Laya.Browser.now() - this._clickTime);
                if (this.currentMotion == 5 && waitTime < 200) {
                    this._clickTime = Laya.Browser.now();
                    this.currentMotion = 6;
                    Laya.timer.once(waitTime, this, this.playOther);
                    console.log("========> onFistBtn.重拳2，等待：", waitTime);
                    waitTime += this.animLastTime;
                    if (this.distance > 2.5) {
                        hitAmount = 0;
                    }
                    else {
                        hitAmount = 15;
                        this.sendHit(hitAmount);
                    }
                }
                else if (this.currentMotion == 6 && waitTime < 200) {
                    this._clickTime = Laya.Browser.now();
                    this.currentMotion = 7;
                    Laya.timer.once(waitTime, this, this.playOther);
                    console.log("========> onFistBtn.重拳3");
                    waitTime += this.animLastTime;
                    if (this.distance > 2.5) {
                        hitAmount = 0;
                    }
                    else {
                        hitAmount = 20;
                        this.sendHit(hitAmount);
                    }
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
                if (this.distance > 2.5) {
                    hitAmount = 0;
                }
                else {
                    hitAmount = 10;
                    this.sendHit(hitAmount);
                }
            }
            Laya.timer.once(waitTime, this, this.playIdle);
            console.log("播完自动放待机：", waitTime);
        }
        sendHit(amount, broken = 0) {
            if (this.isLocalPlayer == false)
                return;
            if (this.getOtherPlayer().currentMotion == 9 && broken == 0) {
                amount = 0;
                console.log("对方防御住了");
            }
            var obj = {
                "type": "cs_hit",
                "uid": this.clientUid,
                "amount": amount,
                "broken": broken,
            };
            this.client.sendData(obj);
        }
        sendKick(e) {
            this.touchEvent = e;
            var obj = {
                "type": "cs_kick",
                "uid": this.clientUid,
            };
            this.client.sendData(obj);
        }
        onKickCallback(e) {
            this.animLastTime = 600;
            var waitTime = 0;
            var hitAmount = 20;
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
                if (this.distance > 2) {
                    hitAmount = 0;
                }
                else {
                    hitAmount = 20;
                    this.sendHit(hitAmount, 1);
                }
            }
            Laya.timer.once(waitTime, this, this.playIdle);
            console.log("播完自动放待机：", waitTime);
        }
        sendJump(e) {
            this.touchEvent = e;
            var obj = {
                "type": "cs_jump",
                "uid": this.clientUid,
            };
            this.client.sendData(obj);
        }
        onJumpCallback(e) {
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
        sendDefend(e) {
            this.touchEvent = e;
            var obj = {
                "type": "cs_defend",
                "uid": this.clientUid,
                "defend": 1,
            };
            this.client.sendData(obj);
        }
        onDefendCallback(e) {
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
        sendCancelDefend(e) {
            if (this.currentMotion == 9) {
                this.touchEvent = e;
                var obj = {
                    "type": "cs_defend",
                    "uid": this.clientUid,
                    "defend": 0,
                };
                this.client.sendData(obj);
            }
        }
        handleMouseUp() {
            if (this.currentMotion == 9) {
                console.log("松手取消防御");
                this.animator.play(this.motions[0]);
            }
        }
    }

    class MatchView extends ui.MatchUI {
        constructor() {
            super();
            this.hpA = 300;
            this.hpB = 300;
            this.uid = "";
            MatchView.instance = this;
            this.uid = Laya.LocalStorage.getItem("uid");
            Laya.stage.offAll("nethandle");
            Laya.stage.on("nethandle", this, this.handle);
            this.joystick = new JoystickView();
            Laya.stage.addChild(this.joystick);
            Laya.Scene3D.load("res/unity3d/Empty.ls", Laya.Handler.create(this, this.onScene3DComplete));
            this.exitBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
                Laya.stage.removeChild(this.joystick);
                Laya.stage.removeChild(this.scene3d);
                Laya.stage.removeChild(this.playerA);
                Laya.stage.removeChild(this.playerB);
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
            Laya.Sprite3D.load("res/unity3d/RPG-Character.lh", Laya.Handler.create(this, this.onPlayerComplete));
        }
        onPlayerComplete(sp) {
            var prefabA = Laya.Sprite3D.instantiate(sp);
            var prefabB = Laya.Sprite3D.instantiate(sp);
            this.playerA = this.scene3d.addChild(prefabA);
            this.playerB = this.scene3d.addChild(prefabB);
            this.playerA.transform.position = new Laya.Vector3(0, 0, 3);
            this.playerA.transform.rotation = new Laya.Quaternion(0, 1, 0, 0);
            var matA = this.playerA.getChildAt(1).skinnedMeshRenderer.material;
            matA.albedoColor = new Laya.Vector4(0, 1, 0, 1);
            this.playerB.transform.position = new Laya.Vector3(0, 0, -3);
            this.playerB.transform.rotation = new Laya.Quaternion(0, 0, 0, -1);
            var matB = this.playerB.getChildAt(1).skinnedMeshRenderer.material;
            matB.albedoColor = new Laya.Vector4(0, 0, 1, 1);
            this.sendGameReady();
        }
        sendGameReady() {
            var obj = {
                "type": "cs_gameReady",
                "uid": this.uid,
            };
            WebSocketClient.getInstance().sendData(obj);
            console.log("发送准备完成");
        }
        sendExitGame() {
            var obj = {
                "type": "cs_exitGame",
                "uid": this.uid,
            };
            WebSocketClient.getInstance().sendData(obj);
            console.log("发送离开游戏");
        }
        handle(obj) {
            var isLocalPlayer = (obj.uid == this.uid);
            switch (obj.type) {
                case "sc_exit": {
                    console.log("收到逃跑" + obj.nickname);
                    break;
                }
                case "sc_ready": {
                    console.log("收到准备完成：" + obj.user0.nickname + " vs " + obj.user1.nickname);
                    this.playerA.addComponent(PlayerController);
                    this.playerB.addComponent(PlayerController);
                    this.scriptA = this.playerA.getComponent(PlayerController);
                    this.scriptB = this.playerB.getComponent(PlayerController);
                    if (this.uid == obj.user0.uid) {
                        console.log("我在左边");
                    }
                    else if (this.uid == obj.user1.uid) {
                        console.log("我在右边");
                    }
                    this.scriptA.setUid(obj.user0.uid, 0);
                    this.scriptB.setUid(obj.user1.uid, 1);
                    this.hpA = 300;
                    this.hp0Text.text = this.hpA.toString();
                    this.fillImage0.width = this.hpA;
                    this.name0Text.text = obj.user0.nickname;
                    this.hpB = 300;
                    this.hp1Text.text = this.hpB.toString();
                    this.fillImage1.width = this.hpB;
                    this.name1Text.text = obj.user1.nickname;
                    break;
                }
            }
        }
        checkDistance() {
            var distance = this.playerA.transform.position.z - this.playerB.transform.position.z;
            return distance;
        }
        updateHP(player, damage) {
            if (player == this.scriptA) {
                this.hpA -= damage;
                this.hp0Text.text = this.hpA.toString();
                this.fillImage0.width = this.hpA;
            }
            else if (player == this.scriptB) {
                this.hpB -= damage;
                this.hp1Text.text = this.hpB.toString();
                this.fillImage1.width = this.hpB;
            }
        }
    }

    class TipsView extends ui.TipsUI {
        constructor() {
            super();
            this.delay = 0;
        }
        static getInstance() {
            if (this.instance == null) {
                this.instance = new TipsView();
            }
            return this.instance;
        }
        showText(timer, msg) {
            this.messageText.text = msg;
            this.delay = timer;
            this.bgImage.width = 24 * msg.length;
            Laya.stage.addChild(TipsView.getInstance());
            if (this.delay > 0)
                Laya.timer.once(this.delay, this, this.autoDestroy);
        }
        autoDestroy() {
            console.log("自动销毁");
            Laya.stage.removeChild(this);
        }
    }

    class LoadingView extends ui.LoadingUI {
        static getInstance() {
            if (this.instance == null) {
                this.instance = new LoadingView();
            }
            return this.instance;
        }
        constructor() {
            super();
            Laya.timer.frameLoop(1, this, () => {
                this.loadingImage.rotation += 5;
            });
        }
    }

    class UserData {
        constructor() {
            this.uid = "";
            this.nickname = "";
            this.playerStatus = PlayerStatus.FREE;
        }
        static getInstance() {
            if (this.instance == null) {
                this.instance = new UserData();
            }
            return this.instance;
        }
    }
    var PlayerStatus;
    (function (PlayerStatus) {
        PlayerStatus[PlayerStatus["DISCONNECT"] = -1] = "DISCONNECT";
        PlayerStatus[PlayerStatus["FREE"] = 0] = "FREE";
        PlayerStatus[PlayerStatus["WAIT"] = 1] = "WAIT";
        PlayerStatus[PlayerStatus["GAME"] = 2] = "GAME";
    })(PlayerStatus || (PlayerStatus = {}));

    class LobbyView extends ui.LobbyUI {
        constructor() {
            super();
            this.client = null;
            this.uid = null;
            this.array = ["", "。", "。。", "。。。"];
            this.tick = 0;
            LobbyView.instance = this;
            console.log("播放音乐.");
            this.client = WebSocketClient.getInstance();
            this.client.initSocket();
            Laya.stage.offAll("nethandle");
            Laya.stage.on("nethandle", this, this.handle);
            this.awardPanel.visible = false;
            this.loginPanel.visible = false;
            this.registerPanel.visible = false;
            this.matchPanel.visible = false;
            this.addUIListener();
            Laya.stage.addChild(LoadingView.getInstance());
        }
        addUIListener() {
            this.nicknameInput.on(Laya.Event.BLUR, this, () => {
                console.log("网络校验昵称 3");
            });
            this.goLoginBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.loginPanel.visible = true;
                this.registerPanel.visible = false;
                this.loginNickname.text = "";
                this.loginPassword.text = "";
            });
            this.goRegisterBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.loginPanel.visible = false;
                this.registerPanel.visible = true;
                this.nicknameInput.text = "";
                this.passwordInput.text = "";
                this.password2Input.text = "";
            });
            this.loginBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendLogin);
            this.registerBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendRegister);
            this.signBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendSign);
            this.closeAwardBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.awardPanel.visible = false;
            });
            this.matchBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendMatch);
            this.cancelMatchBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendCancelMatch);
            this.uid = Laya.LocalStorage.getItem("uid");
            console.log("用户信息：" + this.uid);
            this.registerPanel.visible = (this.uid == null);
        }
        handle(obj) {
            switch (obj.type) {
                case "connected": {
                    Laya.stage.removeChild(LoadingView.getInstance());
                    if (this.uid != null) {
                        this.sendAutoLogin();
                    }
                    break;
                }
                case "sc_enter": {
                    break;
                }
                case "sc_message": {
                    break;
                }
                case "sc_register_failed": {
                    TipsView.getInstance().showText(1000, "注册失败，昵称被占用");
                    Laya.stage.removeChild(LoadingView.getInstance());
                    break;
                }
                case "sc_login_success": {
                    console.log("登陆成功，写入cookie：" + obj.uid + ": " + obj.pwd);
                    Laya.LocalStorage.setItem("uid", obj.uid);
                    Laya.LocalStorage.setItem("pwd", obj.pwd);
                    this.loginPanel.visible = false;
                    this.registerPanel.visible = false;
                    this.nickNameText.text = obj.nickname;
                    UserData.getInstance().playerStatus = PlayerStatus.FREE;
                    break;
                }
                case "sc_login_failed": {
                    TipsView.getInstance().showText(1000, "登陆失败");
                    UserData.getInstance().playerStatus = PlayerStatus.DISCONNECT;
                    this.loginPanel.visible = true;
                    Laya.stage.removeChild(LoadingView.getInstance());
                    break;
                }
                case "sc_sign_success": {
                    console.log("签到成功，看广告x2");
                    this.awardPanel.visible = true;
                    break;
                }
                case "sc_sign_failed": {
                    if (obj.code == 1) {
                        TipsView.getInstance().showText(1000, "今日已签到");
                    }
                    else if (obj.code == 2) {
                        TipsView.getInstance().showText(1000, "签到失败");
                    }
                    break;
                }
                case "sc_match_success": {
                    console.log("匹配成功");
                    Laya.timer.once(1000, this, this.onEnterGame);
                    UserData.getInstance().playerStatus = PlayerStatus.GAME;
                    break;
                }
                case "sc_match_cancel": {
                    UserData.getInstance().playerStatus = PlayerStatus.FREE;
                    this.matchPanel.visible = false;
                    break;
                }
            }
        }
        sendCheckNickName() {
            var obj = {
                "type": "cs_check_register",
                "nick": this.nicknameInput.text,
            };
            this.client.sendData(obj);
        }
        sendRegister() {
            if (this.nicknameInput.text.length < 2 || this.nicknameInput.text.length > 12) {
                TipsView.getInstance().showText(1000, "用户名应为2-12个字符");
                return;
            }
            if (this.passwordInput.text.length < 6 || this.passwordInput.text.length > 16) {
                TipsView.getInstance().showText(1000, "密码应为6-16个字符");
                return;
            }
            if (this.password2Input.text != this.passwordInput.text) {
                TipsView.getInstance().showText(1000, "两次密码输入不一致");
                return;
            }
            var obj = {
                "type": "cs_register",
                "nick": this.nicknameInput.text,
                "pwd": this.md5(this.passwordInput.text),
            };
            this.client.sendData(obj);
        }
        sendLogin() {
            var obj = {
                "type": "cs_login",
                "nickname": this.loginNickname.text,
                "pwd": this.md5(this.loginPassword.text),
            };
            this.client.sendData(obj);
        }
        sendAutoLogin() {
            var obj = {
                "type": "cs_autoLogin",
                "uid": Laya.LocalStorage.getItem("uid"),
                "pwd": Laya.LocalStorage.getItem("pwd")
            };
            this.client.sendData(obj);
        }
        setUserData() { }
        sendSign() {
            var obj = {
                "type": "cs_sign",
                "uid": Laya.LocalStorage.getItem("uid"),
            };
            this.client.sendData(obj);
        }
        sendMatch() {
            this.matchPanel.visible = true;
            this.matchText.text = "匹配中";
            Laya.timer.loop(1000, this, this.textAnimation);
            var obj = {
                "type": "cs_match",
                "uid": Laya.LocalStorage.getItem("uid"),
            };
            this.client.sendData(obj);
        }
        sendCancelMatch() {
            this.matchPanel.visible = true;
            Laya.timer.clear(this, this.textAnimation);
            var obj = {
                "type": "cs_cancel_match",
                "uid": Laya.LocalStorage.getItem("uid"),
            };
            this.client.sendData(obj);
        }
        textAnimation() {
            this.tick++;
            if (this.tick >= this.array.length) {
                this.tick = 0;
            }
            this.matchText.text = "匹配中" + this.array[this.tick];
        }
        onCheckRegister() {
            console.log("昵称检查结果.");
        }
        onCheckSign() { }
        onSign() { }
        onMatch() { }
        onEnterGame() {
            var matchView = new MatchView();
            Laya.stage.addChild(matchView);
            Laya.stage.removeChild(this);
            Laya.timer.clearAll(this);
        }
        md5(data) {
            return data;
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
            console.log("加载完成，进入大厅");
            var lobbyView = new LobbyView();
            Laya.stage.addChild(lobbyView);
            Laya.stage.removeChild(this);
        }
    }

    class Main {
        constructor() {
            if (Laya.Browser.onWeiXin) {
                Laya.MiniAdpter.init();
            }
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
            var loadView = new LoadView();
            Laya.stage.addChild(loadView);
        }
    }
    new Main();

}());
