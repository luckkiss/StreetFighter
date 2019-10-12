export default class UserData {
    public static getInstance(): UserData {
        if(this.instance == null) {
            this.instance = new UserData();
        }
        return this.instance;
	}
	/*界面实例*/
    private static instance: UserData;

    public uid: string = "";
    public nickname: string = "";
    public playerStatus: PlayerStatus = PlayerStatus.FREE; // Depend on inlining
}
export enum PlayerStatus {
    FREE	= 0,	//空闲状态
    WAIT	= 1,	//等待匹配
    GAME	= 2,	//游戏中
}