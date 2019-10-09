/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import LogManager from "./scripts/LogManager"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=1280;
    static height:number=720;
    static scaleMode:string="fixedheight";
    static screenMode:string="horizontal";
    static alignV:string="top";
    static alignH:string="left";
    static startScene:any="Load.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("scripts/LogManager.ts",LogManager);
    }
}
GameConfig.init();