import {ui} from "../ui/layaMaxUI";
import GameConfig from "../GameConfig";
import LoadView from "../scripts/LoadView";
import LobbyView from "../scripts/LobbyView";
import MatchView from "../scripts/MatchView";

export default class UIManager {
    //ui列表
    public static uiArray: Array<Laya.Scene> = [];

    constructor() {

    }

    //添加ui
    public static pushUI(ui: Laya.Scene): void {
        UIManager.uiArray.push(ui);
    }

    public static toUI(uiname: UIName): void {
        for(var i = 0 ; i < UIManager.uiArray.length ; i ++) {
             UIManager.uiArray[i].removeSelf();
             UIManager.uiArray[i].destroy();
         }
        var ui: Laya.Scene;
        if(uiname == UIName.LoadView) {
            ui = new LoadView();
            Laya.stage.addChild(ui);
        } else if (uiname == UIName.LobbyView) {
            ui = new LobbyView();
            Laya.stage.addChild(ui);
        } else if (uiname == UIName.MatchView) {
            ui = new MatchView();
            Laya.stage.addChild(ui);
        }

        if(ui != undefined) {
            UIManager.pushUI(ui);
        }
    }
}

const enum UIName {
    LoadView    = 0,
    LobbyView   = 1,
    MatchView   = 2,
}