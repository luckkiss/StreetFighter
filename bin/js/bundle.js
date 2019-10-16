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
        ChooseUI.uiView = { "type": "Scene", "props": { "zOrder": 99, "width": 1136, "name": "Choose", "height": 640 }, "compId": 2, "child": [{ "type": "Script", "props": { "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 10 }, { "type": "Image", "props": { "var": "mask", "top": 0, "skin": "ui/mask_4x4_40%.png", "right": 0, "name": "Mask", "left": 0, "label": "确定", "bottom": 0, "anchorY": 0.5, "anchorX": 0.5, "sizeGrid": "5,5,5,5" }, "compId": 5, "child": [{ "type": "Image", "props": { "width": 360, "skin": "ui/mask_4x4_40%.png", "name": "Page", "label": "确定", "height": 200, "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5, "sizeGrid": "5,5,5,5" }, "compId": 6, "child": [{ "type": "Label", "props": { "top": 60, "text": "确定要选择吗？", "styleSkin": "comp/image.png", "fontSize": 20, "color": "#ffffff", "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 9 }, { "type": "Button", "props": { "var": "yesBtn", "skin": "comp/button.png", "name": "YesBtn", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "确定", "centerX": 80, "bottom": 40, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }, { "type": "Button", "props": { "var": "noBtn", "skin": "comp/button.png", "name": "NoBtn", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "取消", "centerX": -80, "bottom": 40, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }] }] }], "loadList": ["ui/mask_4x4_40%.png", "comp/image.png", "comp/button.png"], "loadList3D": [] };
        ui.ChooseUI = ChooseUI;
        REG("ui.ChooseUI", ChooseUI);
        class JoystickUI extends Laya.Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(JoystickUI.uiView);
            }
        }
        JoystickUI.uiView = { "type": "Scene", "props": { "zOrder": 1, "width": 1136, "name": "Joystick", "mouseThrough": true, "height": 640 }, "compId": 2, "child": [{ "type": "Image", "props": { "width": 240, "var": "roundImage", "skin": "ui/joystickBg.png", "name": "Round", "left": 20, "height": 240, "bottom": 20, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }, { "type": "Image", "props": { "y": 500, "x": 140, "width": 180, "var": "stickImage", "skin": "ui/joystickPoint.png", "name": "Stick", "left": 50, "height": 180, "bottom": 50, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }], "loadList": ["ui/joystickBg.png", "ui/joystickPoint.png"], "loadList3D": [] };
        ui.JoystickUI = JoystickUI;
        REG("ui.JoystickUI", JoystickUI);
        class LoadUI extends Laya.Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(LoadUI.uiView);
            }
        }
        LoadUI.uiView = { "type": "Scene", "props": { "width": 1136, "name": "Load", "height": 640 }, "compId": 2, "child": [{ "type": "Script", "props": { "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 4 }, { "type": "Image", "props": { "zOrder": -1, "top": 0, "skin": "ui/bg1.jpg", "scaleY": 2, "scaleX": 2, "name": "Background", "centerX": 0.5, "bottom": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 9 }, { "type": "Image", "props": { "top": 0, "right": 0, "name": "MainPanel", "left": 0, "bottom": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 11, "child": [{ "type": "ProgressBar", "props": { "y": 505, "x": 569, "width": 600, "var": "progressBar", "value": 0, "skin": "comp/progress.png", "sizeGrid": "0,10,0,10", "name": "ProgressBar", "height": 30, "centerX": 0.5, "bottom": 120, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5, "child": [{ "type": "Label", "props": { "var": "progressLabel", "text": "0%", "name": "ProgressLabel", "fontSize": 30, "font": "Arial", "color": "#ffffff", "centerX": 0.5, "bottom": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7 }] }, { "type": "Label", "props": { "text": "© 2019 Setsuodu. All Rights Reserved.", "name": "CopyRight", "left": 5, "fontSize": 22, "color": "#ffffff", "bottom": 5, "anchorY": 0.5, "anchorX": 0 }, "compId": 10 }, { "type": "Label", "props": { "var": "versionText", "text": "V0.0.1 Beta", "right": 5, "name": "VersionText", "fontSize": 22, "color": "#ffffff", "bottom": 5, "anchorY": 0.5, "anchorX": 1 }, "compId": 13 }] }], "loadList": ["ui/bg1.jpg", "comp/progress.png"], "loadList3D": [] };
        ui.LoadUI = LoadUI;
        REG("ui.LoadUI", LoadUI);
        class LoadingUI extends Laya.Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(LoadingUI.uiView);
            }
        }
        LoadingUI.uiView = { "type": "Scene", "props": { "zOrder": 99, "width": 1136, "pivotY": 0.5, "pivotX": 0.5, "name": "Loading", "height": 640 }, "compId": 2, "child": [{ "type": "Script", "props": { "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 42 }, { "type": "Image", "props": { "width": 1280, "var": "loadingPanel", "skin": "ui/mask_4x4_40%.png", "name": "LoadingPanel", "height": 640, "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5, "sizeGrid": "5,5,5,5" }, "compId": 3, "child": [{ "type": "Image", "props": { "width": 100, "var": "loadingImage", "skin": "ui/loading.png", "name": "LoadingImage", "height": 100, "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 39 }, { "type": "Label", "props": { "y": 380, "var": "loadingText", "text": "加载中...", "name": "LoadingText", "fontSize": 22, "color": "#ffffff", "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5, "align": "center" }, "compId": 40 }] }], "loadList": ["ui/mask_4x4_40%.png", "ui/loading.png"], "loadList3D": [] };
        ui.LoadingUI = LoadingUI;
        REG("ui.LoadingUI", LoadingUI);
        class LobbyUI extends Laya.Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(LobbyUI.uiView);
            }
        }
        LobbyUI.uiView = { "type": "Scene", "props": { "width": 1136, "name": "Lobby", "height": 640 }, "compId": 2, "child": [{ "type": "Script", "props": { "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 5 }, { "type": "Clip", "props": { "zOrder": -1, "skin": "ui/bg1.jpg", "scaleY": 2, "scaleX": 2, "name": "Background", "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 44 }, { "type": "Image", "props": { "width": 1136, "var": "userPanel", "name": "UserPanel", "height": 640, "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 22, "child": [{ "type": "Image", "props": { "y": 60, "x": 60, "width": 80, "var": "headImg", "skin": "comp/img_bg5.png", "sizeGrid": "10,10,10,10", "name": "HeadImg", "height": 80, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 23, "child": [{ "type": "Label", "props": { "x": 100, "var": "nickNameText", "top": 10, "text": "用户昵称", "name": "NickNameText", "fontSize": 22, "color": "#ffffff", "anchorY": 0.5 }, "compId": 24 }, { "type": "Image", "props": { "width": 24, "skin": "ui/status_coin.png", "name": "CoinImage", "left": 100, "height": 24, "bottom": 10, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 65, "child": [{ "type": "Label", "props": { "var": "goldText", "text": "100", "name": "GoldText", "left": 30, "fontSize": 22, "color": "#ffffff", "centerY": 0.5, "anchorY": 0.5 }, "compId": 64 }] }] }, { "type": "Button", "props": { "y": 200, "width": 100, "var": "signBtn", "stateNum": 1, "skin": "ui/UI_Button_Standard_Red.png", "sizeGrid": "10,10,10,10", "name": "SignBtn", "left": 50, "labelStrokeColor": "#ffffff", "labelSize": 22, "labelPadding": "-2", "labelColors": "#ffffff", "label": "签到", "height": 50, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }, { "type": "Button", "props": { "y": 300, "width": 100, "var": "rankBtn", "stateNum": 1, "skin": "ui/UI_Button_Standard_Red.png", "sizeGrid": "10,10,10,10", "name": "RankBtn", "left": 50, "labelStrokeColor": "#ffffff", "labelSize": 22, "labelPadding": "-2", "labelColors": "#ffffff", "label": "排行", "height": 50, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 73 }, { "type": "Button", "props": { "y": 400, "width": 100, "var": "shopBtn", "stateNum": 1, "skin": "ui/UI_Button_Standard_Red.png", "sizeGrid": "10,10,10,10", "name": "ShopBtn", "left": 50, "labelStrokeColor": "#ffffff", "labelSize": 22, "labelPadding": "-2", "labelColors": "#ffffff", "label": "商城", "height": 50, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 70 }, { "type": "Button", "props": { "y": 500, "width": 100, "var": "settingsBtn", "stateNum": 1, "skin": "ui/UI_Button_Standard_Red.png", "sizeGrid": "10,10,10,10", "name": "SettingsBtn", "left": 50, "labelStrokeColor": "#ffffff", "labelSize": 22, "labelPadding": "-2", "labelColors": "#ffffff", "label": "设置", "height": 50, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 72 }, { "type": "Button", "props": { "y": 350, "width": 300, "var": "learnBtn", "stateNum": 1, "skin": "ui/UI_Panel_Window.png", "sizeGrid": "15,15,15,15", "name": "LearnBtn", "left": 300, "labelStrokeColor": "#ffffff", "labelSize": 30, "labelPadding": "130", "labelColors": "#ffffff", "label": "教学模式", "height": 400, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 71, "child": [{ "type": "Image", "props": { "y": 150, "width": 240, "skin": "ui/f02.jpg", "height": 240, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 75 }] }, { "type": "Button", "props": { "y": 350, "width": 300, "var": "matchBtn", "stateNum": 1, "skin": "ui/UI_Panel_Window.png", "sizeGrid": "15,15,15,15", "name": "MatchBtn", "left": 650, "labelStrokeColor": "#ffffff", "labelSize": 30, "labelPadding": "130", "labelColors": "#ffffff", "label": "匹配模式", "height": 400, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4, "child": [{ "type": "Image", "props": { "y": 150, "x": -199, "width": 240, "skin": "ui/f01.jpg", "height": 240, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 74 }] }] }, { "type": "Image", "props": { "var": "registerPanel", "top": 0, "skin": "ui/mask_4x4_40%.png", "right": 0, "name": "RegisterPanel", "left": 0, "bottom": 0, "anchorY": 0.5, "anchorX": 0.5, "sizeGrid": "5,5,5,5" }, "compId": 9, "child": [{ "type": "Image", "props": { "width": 600, "skin": "ui/mask_4x4_40%.png", "name": "Page", "height": 320, "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5, "sizeGrid": "5,5,5,5" }, "compId": 10, "child": [{ "type": "Text", "props": { "y": 64, "x": 150, "text": "用户名", "fontSize": 22, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 17 }, { "type": "TextInput", "props": { "y": 60, "x": 240, "width": 160, "var": "nicknameInput", "valign": "middle", "skin": "comp/textinput.png", "sizeGrid": "10,10,10,10", "name": "NicknameInput", "height": 30, "fontSize": 22, "font": "Arial" }, "compId": 11, "child": [{ "type": "Text", "props": { "y": 35, "text": "2-12个字符", "fontSize": 12, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 20 }] }, { "type": "Text", "props": { "y": 124, "x": 172, "text": "密码", "fontSize": 22, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 18 }, { "type": "TextInput", "props": { "y": 120, "x": 240, "width": 160, "var": "passwordInput", "valign": "middle", "skin": "comp/textinput.png", "sizeGrid": "10,10,10,10", "name": "Password", "height": 30, "fontSize": 22, "font": "Arial" }, "compId": 12, "child": [{ "type": "Text", "props": { "y": 35, "x": 0, "text": "6-16个字符", "fontSize": 12, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 21 }] }, { "type": "Text", "props": { "y": 184, "x": 128, "text": "确认密码", "fontSize": 22, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 19 }, { "type": "TextInput", "props": { "y": 180, "x": 240, "width": 160, "var": "password2Input", "valign": "middle", "skin": "comp/textinput.png", "sizeGrid": "10,10,10,10", "name": "Password2", "height": 30, "fontSize": 22, "font": "Arial" }, "compId": 16 }, { "type": "Button", "props": { "x": 320, "width": 160, "var": "registerBtn", "skin": "comp/button.png", "sizeGrid": "10,10,10,10", "name": "RegisterBtn", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "立即注册", "height": 40, "bottom": 50, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 13 }, { "type": "Label", "props": { "width": 160, "var": "goLoginBtn", "valign": "middle", "text": "去登陆", "styleSkin": "comp/button.png", "sizeGrid": "10,10,10,10", "right": 0, "name": "GoLoginBtn", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "去登陆", "height": 40, "fontSize": 22, "color": "#ffffff", "bottom": 0, "anchorY": 1, "anchorX": 1, "align": "center" }, "compId": 62 }] }] }, { "type": "Image", "props": { "var": "loginPanel", "top": 0, "skin": "ui/mask_4x4_40%.png", "right": 0, "name": "LoginPanel", "left": 0, "bottom": 0, "anchorY": 0.5, "anchorX": 0.5, "sizeGrid": "5,5,5,5" }, "compId": 51, "child": [{ "type": "Image", "props": { "width": 600, "skin": "ui/mask_4x4_40%.png", "name": "Page", "height": 320, "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5, "sizeGrid": "5,5,5,5" }, "compId": 52, "child": [{ "type": "Text", "props": { "y": 84, "x": 150, "text": "用户名", "fontSize": 22, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 53 }, { "type": "TextInput", "props": { "y": 80, "x": 240, "width": 160, "var": "loginNickname", "valign": "middle", "skin": "comp/textinput.png", "sizeGrid": "10,10,10,10", "name": "LoginNickname", "height": 30, "fontSize": 22, "font": "Arial" }, "compId": 54, "child": [{ "type": "Text", "props": { "y": 35, "text": "2-12个字符", "fontSize": 12, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 55 }] }, { "type": "Text", "props": { "y": 144, "x": 172, "text": "密码", "fontSize": 22, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 56 }, { "type": "TextInput", "props": { "y": 140, "x": 240, "width": 160, "var": "loginPassword", "valign": "middle", "skin": "comp/textinput.png", "sizeGrid": "10,10,10,10", "name": "LoginPassword", "height": 30, "fontSize": 22, "font": "Arial" }, "compId": 57, "child": [{ "type": "Text", "props": { "y": 35, "x": 0, "text": "6-16个字符", "fontSize": 12, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 58 }] }, { "type": "Button", "props": { "x": 320, "width": 160, "var": "loginBtn", "skin": "comp/button.png", "sizeGrid": "10,10,10,10", "name": "LoginBtn", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "立即登录", "height": 40, "bottom": 50, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 61 }, { "type": "Label", "props": { "width": 160, "var": "goRegisterBtn", "valign": "middle", "text": "去注册", "styleSkin": "comp/button.png", "sizeGrid": "10,10,10,10", "right": 0, "name": "GoRegisterBtn", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "去登陆", "height": 40, "fontSize": 22, "color": "#ffffff", "bottom": 0, "anchorY": 1, "anchorX": 1, "align": "center" }, "compId": 63 }] }] }, { "type": "Image", "props": { "zOrder": 1, "var": "awardPanel", "top": 0, "skin": "ui/mask_4x4_40%.png", "right": 0, "name": "AwardPanel", "left": 0, "bottom": 0, "anchorY": 0.5, "anchorX": 0.5, "sizeGrid": "5,5,5,5" }, "compId": 25, "child": [{ "type": "Image", "props": { "width": 320, "skin": "ui/UI_Button_Standard_Orange.png", "sizeGrid": "10,10,20,10", "name": "Page", "height": 360, "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 26, "child": [{ "type": "Text", "props": { "y": 40, "x": 116, "text": "恭喜获得", "pivotX": 0.5, "name": "AwardTitle", "fontSize": 22, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 27 }, { "type": "Image", "props": { "y": 100, "x": 110, "width": 100, "skin": "comp/img_bg4.png", "sizeGrid": "10,10,10,10", "name": "AwardRound", "height": 100 }, "compId": 37, "child": [{ "type": "Image", "props": { "var": "awardImage", "top": 10, "skin": "ui/status_coin.png", "sizeGrid": "0,0,0,0", "right": 10, "name": "AwardImage", "left": 10, "bottom": 10, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 76 }] }, { "type": "Button", "props": { "y": 260, "width": 160, "var": "doubleAwardBtn", "skin": "comp/button.png", "sizeGrid": "10,10,10,10", "name": "DoubleAwardBtn", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "领取双倍", "height": 40, "centerX": 1, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 35 }, { "type": "Label", "props": { "y": 320, "x": 160, "var": "closeAwardBtn", "text": "直接关闭", "name": "CloseAward", "fontSize": 14, "color": "#ffffff", "centerX": 1, "anchorY": 0.5, "anchorX": 0.5, "align": "center" }, "compId": 36 }] }] }, { "type": "Image", "props": { "zOrder": 1, "var": "matchPanel", "top": 0, "skin": "ui/mask_4x4_40%.png", "right": 0, "name": "MatchPanel", "left": 0, "bottom": 0, "anchorY": 0.5, "anchorX": 0.5, "sizeGrid": "5,5,5,5" }, "compId": 45, "child": [{ "type": "Image", "props": { "width": 320, "skin": "ui/UI_Button_Standard_Orange.png", "sizeGrid": "10,10,20,10", "name": "Page", "height": 240, "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 46, "child": [{ "type": "Label", "props": { "y": 80, "x": 127, "var": "matchText", "text": "匹配中", "pivotY": 0.5, "name": "MatchText", "fontSize": 22, "color": "#ffffff" }, "compId": 47 }, { "type": "Button", "props": { "y": 160, "width": 160, "var": "cancelMatchBtn", "skin": "comp/button.png", "sizeGrid": "10,10,10,10", "name": "CancelMatchBtn", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "取消匹配", "height": 40, "centerX": 1, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 49 }] }] }], "loadList": ["ui/bg1.jpg", "comp/img_bg5.png", "ui/status_coin.png", "ui/UI_Button_Standard_Red.png", "ui/UI_Panel_Window.png", "ui/f02.jpg", "ui/f01.jpg", "ui/mask_4x4_40%.png", "comp/textinput.png", "comp/button.png", "ui/UI_Button_Standard_Orange.png", "comp/img_bg4.png"], "loadList3D": [] };
        ui.LobbyUI = LobbyUI;
        REG("ui.LobbyUI", LobbyUI);
        class MatchUI extends Laya.Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(MatchUI.uiView);
            }
        }
        MatchUI.uiView = { "type": "Scene", "props": { "width": 1136, "name": "Main", "labelSize": 30, "height": 640 }, "compId": 2, "child": [{ "type": "Script", "props": { "y": 0, "x": 0, "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 51 }, { "type": "Script", "props": { "y": 0, "x": 0, "logNode": "@node:71", "gamePad": "@node:41", "runtime": "scripts/LogManager.ts" }, "compId": 72 }, { "type": "Sprite", "props": { "name": "Viewport" }, "compId": 19, "child": [{ "type": "Label", "props": { "y": 320, "x": 568, "width": 936, "text": "log", "name": "Console", "height": 640, "fontSize": 16, "color": "#ff0400", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 71 }] }, { "type": "Image", "props": { "width": 1136, "name": "MainPanel", "height": 640, "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 90, "child": [{ "type": "Button", "props": { "width": 70, "var": "exitBtn", "top": 10, "stateNum": 1, "skin": "ui/arrow_prev_page_f.png", "name": "ExitBtn", "left": 10, "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff" }, "compId": 73 }, { "type": "Label", "props": { "y": 66, "x": 568, "top": 45, "text": "VS", "styleSkin": "comp/button.png", "name": "VS", "labelStrokeColor": "#ffffff", "labelSize": 22, "labelColors": "#ffffff", "label": "离开", "fontSize": 44, "color": "#ffcc00", "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 84 }, { "type": "Image", "props": { "y": 319, "x": 568, "width": 1136, "var": "leftHPPanel", "top": 0, "name": "LeftHPPanel", "height": 640, "clipWidth": 10, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 79, "child": [{ "type": "Label", "props": { "y": 40, "x": 200, "var": "name0Text", "text": "Player0", "styleSkin": "comp/label.png", "name": "Name0Text", "fontSize": 22, "color": "#ffffff", "anchorY": 0.5, "anchorX": 0 }, "compId": 82 }, { "type": "Image", "props": { "y": 16, "width": 310, "top": 50, "skin": "comp/progress$bar.png", "sizeGrid": "10,10,10,10", "name": "Background", "left": 200, "height": 32, "clipWidth": 10, "anchorY": 0.5 }, "compId": 77, "child": [{ "type": "Clip", "props": { "y": 16, "x": 5, "width": 300, "var": "fillImage0", "skin": "comp/progress.png", "sizeGrid": "10,10,10,10", "name": "FillImage0", "height": 24, "anchorY": 0.5, "anchorX": 0 }, "compId": 78 }, { "type": "Label", "props": { "var": "hp0Text", "text": "300", "styleSkin": "comp/label.png", "name": "HP0Text", "fontSize": 24, "color": "#ff0400", "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5, "align": "right" }, "compId": 83 }] }] }, { "type": "Image", "props": { "y": 319, "x": 568, "width": 1136, "var": "rightHPPanel", "top": 0, "name": "RightHPPanel", "height": 640, "clipWidth": 10, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 85, "child": [{ "type": "Label", "props": { "var": "name1Text", "top": 30, "text": "Player1", "styleSkin": "comp/label.png", "right": 200, "name": "Name1Text", "fontSize": 22, "color": "#ffffff", "anchorY": 0.5, "anchorX": 1 }, "compId": 86 }, { "type": "Image", "props": { "width": 310, "top": 50, "skin": "comp/progress$bar.png", "sizeGrid": "10,10,10,10", "right": 200, "name": "Background", "height": 32, "clipWidth": 10, "anchorY": 0.5, "anchorX": 1 }, "compId": 88, "child": [{ "type": "Clip", "props": { "y": 16, "x": 305, "width": 300, "var": "fillImage1", "skin": "comp/progress.png", "sizeGrid": "10,10,10,10", "name": "FillImage1", "height": 24, "anchorY": 0.5, "anchorX": 1 }, "compId": 89 }, { "type": "Label", "props": { "var": "hp1Text", "text": "300", "styleSkin": "comp/label.png", "name": "HP1Text", "fontSize": 24, "color": "#ff0400", "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 87 }] }] }] }, { "type": "Image", "props": { "width": 240, "var": "gamePad", "right": 50, "pivotY": 120, "pivotX": 120, "name": "GamePad", "height": 240, "bottom": 50 }, "compId": 41, "child": [{ "type": "Button", "props": { "width": 100, "var": "jumpBtn", "top": -10, "stateNum": 1, "skin": "ui/btn_retry.png", "name": "JumpBtn", "labelSize": 30, "labelColors": "#ffffff", "label": "跳", "height": 100, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 21 }, { "type": "Button", "props": { "width": 100, "var": "defendBtn", "stateNum": 1, "skin": "ui/btn_retry.png", "name": "DefendBtn", "left": -10, "labelSize": 30, "labelColors": "#ffffff", "label": "防", "height": 100, "centerY": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 22 }, { "type": "Button", "props": { "width": 100, "var": "kickBtn", "stateNum": 1, "skin": "ui/btn_retry.png", "right": -10, "name": "KickBtn", "labelSize": 30, "labelColors": "#ffffff", "label": "踢", "height": 100, "centerY": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 23 }, { "type": "Button", "props": { "width": 100, "var": "fistBtn", "stateNum": 1, "skin": "ui/btn_retry.png", "name": "FistBtn", "labelSize": 30, "labelColors": "#ffffff", "label": "拳", "height": 100, "centerX": 0.5, "bottom": -10, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 24 }] }, { "type": "Image", "props": { "zOrder": 1, "y": 321, "x": 569, "width": 1136, "var": "endPanel", "name": "EndPanel", "height": 640, "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 92, "child": [{ "type": "Image", "props": { "y": 322, "x": 570, "width": 400, "var": "winPage", "skin": "ui/UI_Button_Standard_Orange.png", "sizeGrid": "15,15,20,15", "name": "WinPage", "height": 300, "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 93 }, { "type": "Image", "props": { "y": 322, "x": 570, "width": 400, "var": "losePage", "skin": "ui/UI_Button_Standard_Sky.png", "sizeGrid": "15,15,20,15", "name": "LosePage", "height": 300, "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 95 }, { "type": "Button", "props": { "y": 393, "x": 570, "width": 120, "var": "endBtn", "stateNum": 1, "skin": "ui/UI_Button_Standard_Red.png", "sizeGrid": "10,10,20,10", "name": "EndBtn", "labelSize": 22, "labelPadding": "-2", "labelColors": "#ffffff", "label": "离开", "height": 60, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 94 }] }], "loadList": ["ui/arrow_prev_page_f.png", "comp/button.png", "comp/label.png", "comp/progress$bar.png", "comp/progress.png", "ui/btn_retry.png", "ui/UI_Button_Standard_Orange.png", "ui/UI_Button_Standard_Sky.png", "ui/UI_Button_Standard_Red.png"], "loadList3D": [] };
        ui.MatchUI = MatchUI;
        REG("ui.MatchUI", MatchUI);
        class TipsUI extends Laya.Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(TipsUI.uiView);
            }
        }
        TipsUI.uiView = { "type": "Scene", "props": { "width": 1136, "name": "Tips", "height": 640 }, "compId": 2, "child": [{ "type": "Script", "props": { "top": 0, "right": 0, "left": 0, "bottom": 0, "runtime": "laya.ui.Widget" }, "compId": 7 }, { "type": "Image", "props": { "zOrder": 99, "width": 1136, "name": "TipsPanel", "height": 640, "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4, "child": [{ "type": "Image", "props": { "width": 150, "var": "bgImage", "text": "消息提示", "skin": "ui/mask_4x4_40%.png", "name": "Background", "height": 50, "fontSize": 22, "color": "#ffffff", "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5, "sizeGrid": "5,5,5,5" }, "compId": 6, "child": [{ "type": "Label", "props": { "y": 26, "x": 76, "var": "messageText", "text": "消息提示", "name": "MessageText", "fontSize": 22, "color": "#ffffff", "centerY": 0.5, "centerX": 0.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5 }] }] }], "loadList": ["ui/mask_4x4_40%.png"], "loadList3D": [] };
        ui.TipsUI = TipsUI;
        REG("ui.TipsUI", TipsUI);
    })(ui || (ui = {}));

    class LoadingView extends ui.LoadingUI {
        static getInstance() {
            if (this.instance == null) {
                this.instance = new LoadingView();
            }
            return this.instance;
        }
        constructor() {
            super();
        }
        onEnable() {
            Laya.timer.frameLoop(1, this, () => {
                this.loadingImage.rotation += 5;
            });
        }
        onDisable() {
            Laya.timer.clearAll(this);
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
            if (WebSocketClient.getInstance().isConnected) {
                console.log("网络状态良好");
                return;
            }
            this.byte = new Laya.Byte();
            this.byte.endian = Laya.Byte.LITTLE_ENDIAN;
            this.socket = new Laya.Socket();
            this.socket.endian = Laya.Byte.LITTLE_ENDIAN;
            Laya.stage.addChild(LoadingView.getInstance());
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
            this.distance = 6;
            this.client = null;
            this.clientID = "";
            this.avatarID = "";
            this.isLocalPlayer = false;
            this.direction = 1;
            this.currentHP = 300;
            this.isDead = false;
            this.client = WebSocketClient.getInstance();
            Laya.stage.on("nethandle", this, this.handle);
            this.distance = 6;
            this.currentHP = 300;
            this.isDead = false;
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
                "uid": this.clientID,
                "posz": z,
            };
            this.client.sendData(obj);
        }
        checkDistance() {
            this.distance = MatchView.getInstance().checkDistance();
        }
        getOtherPlayer() {
            if (this == MatchView.getInstance().scriptA) {
                return MatchView.getInstance().scriptB;
            }
            else if (this == MatchView.getInstance().scriptB) {
                return MatchView.getInstance().scriptA;
            }
            return null;
        }
        handle(obj) {
            var isDriven = (obj.uid == this.avatarID);
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
                            if (this.isDead) {
                                console.log(obj.uid + "已死亡，无效攻击");
                                return;
                            }
                            console.log(obj.uid + "挨打(-" + obj.damage + ")");
                            this.currentHP -= obj.damage;
                            if (this.currentHP <= 0) {
                                this.currentHP = 0;
                                this.isDead = true;
                                console.log("========> 最后一拳打死");
                                Laya.timer.clearAll(this);
                                Laya.timer.once(400, this, function () {
                                    this.currentMotion = 11;
                                    this.animator.play(this.motions[this.currentMotion]);
                                    MatchView.getInstance().updateHP(this, obj.damage);
                                });
                            }
                            else {
                                Laya.timer.once(400, this, function () {
                                    this.currentMotion = 10;
                                    this.animator.play(this.motions[this.currentMotion]);
                                    MatchView.getInstance().updateHP(this, obj.damage);
                                    Laya.timer.once(600, this, function () {
                                        this.currentMotion = 0;
                                        this.animator.crossFade(this.motions[this.currentMotion], 0.2);
                                    });
                                });
                            }
                        }
                    }
                }
            }
        }
        setUid(modelid, side) {
            this.avatarID = modelid;
            this.clientID = UserData.getInstance().uid;
            this.isLocalPlayer = (this.avatarID == this.clientID);
            this.direction = (side == 0) ? 1 : -1;
            this.currentMotion = 0;
            this.animLastTime = 0;
            this.posy = 0;
            this.posz = 0;
            this.gameObject = this.owner;
            this.animator = this.gameObject.getComponent(Laya.Animator);
            this.animator.play(this.motions[this.currentMotion]);
            this._clickTime = 0;
            if (this.isLocalPlayer) {
                MatchView.getInstance().fistBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendFist);
                MatchView.getInstance().kickBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendKick);
                MatchView.getInstance().jumpBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendJump);
                MatchView.getInstance().defendBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendDefend);
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
                    if (this.currentMotion != motion && this.currentMotion != 9 && this.currentMotion != 10 && this.currentMotion != 10) {
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
            console.log(this.avatarID + "播放待机动画");
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
                "uid": this.clientID,
            };
            this.client.sendData(obj);
            console.log("发送出拳");
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
                "uid": this.clientID,
                "amount": amount,
                "broken": broken,
            };
            this.client.sendData(obj);
        }
        sendKick(e) {
            this.touchEvent = e;
            var obj = {
                "type": "cs_kick",
                "uid": this.clientID,
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
        }
        sendJump(e) {
            this.touchEvent = e;
            var obj = {
                "type": "cs_jump",
                "uid": this.clientID,
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
        }
        sendDefend(e) {
            this.touchEvent = e;
            var obj = {
                "type": "cs_defend",
                "uid": this.clientID,
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
                    "uid": this.clientID,
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
        static getInstance() {
            if (this.instance == null) {
                this.instance = new MatchView();
            }
            return this.instance;
        }
        constructor() {
            super();
        }
        onEnable() {
            console.log("MatchView.Enable");
            this.endPanel.visible = false;
            this.endPanel.mouseEnabled = false;
            Laya.stage.offAll("nethandle");
            Laya.stage.on("nethandle", this, this.handle);
            this.joystick = new JoystickView();
            Laya.stage.addChild(this.joystick);
            {
                this.scene3d = Laya.stage.addChild(new Laya.Scene3D());
                this.scene3d.zOrder = -1;
                var camera = (this.scene3d.addChild(new Laya.Camera(0, 0.1, 100)));
                camera.transform.translate(new Laya.Vector3(6, 2, 0));
                camera.transform.rotate(new Laya.Vector3(3, 90, 0), true, false);
                var directionLight = this.scene3d.addChild(new Laya.DirectionLight());
                directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
                directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, 1, 0));
                Laya.Sprite3D.load("remote/unity3d/Background.lh", Laya.Handler.create(this, this.onBackgroundComplete));
                Laya.Sprite3D.load("remote/unity3d/RPG-Character.lh", Laya.Handler.create(this, this.onPlayerComplete));
            }
            this.exitBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
                Laya.stage.removeChild(this.joystick);
                Laya.stage.removeChild(this.scene3d);
                Laya.stage.removeChild(this.playerA);
                Laya.stage.removeChild(this.playerB);
                this.removeSelf();
                console.log("跳转.LobbyView");
                Laya.stage.addChild(LobbyView.getInstance());
            });
            this.endBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
            });
        }
        onDisable() {
            console.log("MatchView.Disable");
            Laya.stage.offAll();
        }
        onBackgroundComplete(sp) {
            this.background = this.scene3d.addChild(sp);
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
                "uid": UserData.getInstance().uid,
            };
            WebSocketClient.getInstance().sendData(obj);
            console.log("发送准备完成");
        }
        sendExitGame() {
            var obj = {
                "type": "cs_exitGame",
                "uid": UserData.getInstance().uid,
            };
            WebSocketClient.getInstance().sendData(obj);
            console.log("发送离开游戏");
        }
        sendDead() {
            var obj = {
                "type": "cs_dead",
                "uid": UserData.getInstance().uid,
            };
            WebSocketClient.getInstance().sendData(obj);
        }
        handle(obj) {
            var isLocalPlayer = (obj.uid == UserData.getInstance().uid);
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
                    if (UserData.getInstance().uid == obj.user0.uid) {
                        console.log("我在左边");
                    }
                    else if (UserData.getInstance().uid == obj.user1.uid) {
                        console.log("我在右边");
                    }
                    this.scriptA.setUid(obj.user0.uid, 0);
                    this.scriptB.setUid(obj.user1.uid, 1);
                    this.hp0Text.text = this.scriptA.currentHP.toString();
                    this.fillImage0.width = this.scriptA.currentHP;
                    this.name0Text.text = obj.user0.nickname;
                    this.hp1Text.text = this.scriptB.currentHP.toString();
                    this.fillImage1.width = this.scriptB.currentHP;
                    this.name1Text.text = obj.user1.nickname;
                    break;
                }
                case "sc_dead": {
                    console.log(obj.win + "获胜，" + obj.lose + "失败");
                    this.endPanel.visible = true;
                    this.endPanel.mouseEnabled = true;
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
                this.hp0Text.text = this.scriptA.currentHP.toString();
                this.fillImage0.width = this.scriptA.currentHP;
            }
            else if (player == this.scriptB) {
                this.hp1Text.text = this.scriptB.currentHP.toString();
                this.fillImage1.width = this.scriptB.currentHP;
            }
            if (this.scriptA.clientID == UserData.getInstance().uid && this.scriptA.isDead) {
                this.sendDead();
                console.log("这边死了");
            }
            else if (this.scriptB.clientID == UserData.getInstance().uid && this.scriptB.isDead) {
                this.sendDead();
                console.log("这边死了");
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
            this.bgImage.width = 25 * msg.length;
            Laya.stage.addChild(TipsView.getInstance());
            if (this.delay > 0)
                Laya.timer.once(this.delay, this, this.autoDestroy);
        }
        autoDestroy() {
            console.log("自动销毁");
            Laya.stage.removeChild(this);
        }
    }

    class LobbyView extends ui.LobbyUI {
        constructor() {
            super();
            this.array = ["", "。", "。。", "。。。"];
            this.tick = 0;
            UserData.getInstance().uid = Laya.LocalStorage.getItem("uid");
            console.log("是否有用户信息：" + UserData.getInstance().uid);
        }
        static getInstance() {
            if (this.instance == null) {
                this.instance = new LobbyView();
            }
            return this.instance;
        }
        onEnable() {
            console.log("LobbyView.Enable");
            this.registerPanel.visible = false;
            this.loginPanel.visible = false;
            this.userPanel.visible = false;
            this.awardPanel.visible = false;
            this.matchPanel.visible = false;
            this.addUIListener();
            WebSocketClient.getInstance().initSocket();
            Laya.stage.on("nethandle", this, this.handle);
            Laya.SoundManager.playMusic("remote/audios/bgm.mp3");
            Laya.SoundManager.autoStopMusic = true;
            console.log("播放音乐.");
        }
        onDisable() {
            console.log("LobbyView.Disable");
            Laya.stage.offAll();
            Laya.timer.clearAll(this);
        }
        addUIListener() {
            this.nicknameInput.on(Laya.Event.BLUR, this, () => {
                console.log("网络校验昵称 3");
            });
            this.goLoginBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.registerPanel.visible = false;
                this.loginPanel.visible = true;
                this.loginNickname.text = "";
                this.loginPassword.text = "";
            });
            this.goRegisterBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
                this.registerPanel.visible = true;
                this.loginPanel.visible = false;
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
            this.doubleAwardBtn.on(Laya.Event.MOUSE_DOWN, this, () => {
                TipsView.getInstance().showText(2000, "UV不足1000，敬请支持");
            });
            this.matchBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendMatch);
            this.cancelMatchBtn.on(Laya.Event.MOUSE_DOWN, this, this.sendCancelMatch);
            if (UserData.getInstance().uid) {
                this.registerPanel.visible = false;
                this.userPanel.visible = true;
            }
            else {
                this.registerPanel.visible = true;
                this.userPanel.visible = false;
            }
        }
        handle(obj) {
            switch (obj.type) {
                case "connected": {
                    Laya.stage.removeChild(LoadingView.getInstance());
                    if (UserData.getInstance().uid) {
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
                    UserData.getInstance().uid = obj.uid;
                    this.registerPanel.visible = false;
                    this.loginPanel.visible = false;
                    this.userPanel.visible = true;
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
                    Laya.timer.once(1000, this, this.enterGame);
                    break;
                }
                case "sc_match_cancel": {
                    UserData.getInstance().playerStatus = PlayerStatus.FREE;
                    this.matchPanel.visible = false;
                    break;
                }
            }
        }
        enterGame() {
            UserData.getInstance().playerStatus = PlayerStatus.GAME;
            this.removeSelf();
            console.log("跳转.MatchView");
            Laya.stage.addChild(MatchView.getInstance());
        }
        sendCheckNickName() {
            var obj = {
                "type": "cs_check_register",
                "nick": this.nicknameInput.text,
            };
            WebSocketClient.getInstance().sendData(obj);
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
            WebSocketClient.getInstance().sendData(obj);
        }
        sendLogin() {
            var obj = {
                "type": "cs_login",
                "nickname": this.loginNickname.text,
                "pwd": this.md5(this.loginPassword.text),
            };
            WebSocketClient.getInstance().sendData(obj);
        }
        sendAutoLogin() {
            var obj = {
                "type": "cs_autoLogin",
                "uid": UserData.getInstance().uid,
                "pwd": Laya.LocalStorage.getItem("pwd")
            };
            WebSocketClient.getInstance().sendData(obj);
        }
        setUserData() { }
        sendSign() {
            var obj = {
                "type": "cs_sign",
                "uid": UserData.getInstance().uid,
            };
            WebSocketClient.getInstance().sendData(obj);
        }
        sendMatch() {
            this.matchPanel.visible = true;
            this.matchText.text = "匹配中";
            Laya.timer.loop(1000, this, this.textAnimation);
            var obj = {
                "type": "cs_match",
                "uid": UserData.getInstance().uid,
            };
            WebSocketClient.getInstance().sendData(obj);
        }
        sendCancelMatch() {
            this.matchPanel.visible = true;
            Laya.timer.clear(this, this.textAnimation);
            var obj = {
                "type": "cs_cancel_match",
                "uid": UserData.getInstance().uid,
            };
            WebSocketClient.getInstance().sendData(obj);
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
        md5(data) {
            return data;
        }
        addMask() {
            let maskSprite = new Laya.Sprite();
            maskSprite.graphics.drawCircle(95, 41, 50, "#ff0000");
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
            this.progressBar.value = 0;
            this.progressLabel.text = "0%";
            Laya.timer.once(1000, this, this.onProLoaded);
        }
        hide() {
            Laya.timer.clearAll(this);
            this.removeSelf();
        }
        onProLoaded() {
            var res = [
                { url: "res/atlas/ui.atlas", type: Laya.Loader.ATLAS },
                { url: "res/atlas/ui.png", type: Laya.Loader.IMAGE },
                { url: "remote/audios/bgm.mp3", type: Laya.Loader.SOUND },
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
            this.hide();
            Laya.stage.addChild(LobbyView.getInstance());
        }
    }

    class Main {
        constructor() {
            if (window["Laya3D"]) {
                console.log("Laya3D");
                Laya3D.init(GameConfig.width, GameConfig.height);
            }
            else {
                console.log("WebGL");
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            }
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
            Laya.URL.basePath = "http://192.168.1.101/budokai/";
        }
        onLoaded() {
            Laya.View.uiMap = Laya.Loader.getRes("ui.json");
            Laya.stage.addChild(LoadView.getInstance());
        }
    }
    new Main();

}());
