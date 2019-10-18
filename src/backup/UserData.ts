export default class UserData {
    private static instance: UserData;
    public static getInstance(): UserData {
        if(this.instance == null) {
            this.instance = new UserData();
        }
        return this.instance;
	}

    public token: string = ""; //登陆码
    public uid: string = "";
    public nickname: string = "";
    public gold: number = 0;
    public playerStatus: PlayerStatus = PlayerStatus.FREE; // Depend on inlining

    public updateGold(add: number): void {
        this.gold += add;
    }
}
export enum PlayerStatus {
    DISCONNECT	= -1,	//离线
    FREE	    = 0,	//空闲状态
    WAIT	    = 1,	//等待匹配
    GAME	    = 2,	//游戏中
}