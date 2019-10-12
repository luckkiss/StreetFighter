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
}