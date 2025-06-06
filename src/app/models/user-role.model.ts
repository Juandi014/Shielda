export class UserRole {
    id?: number;
    userId?: number;
    roleId?: number;
    startAt?: Date;
    endAt?: Date;

    constructor(userId: number, roleId: number, startAt?: Date, endAt?: Date) {
        this.userId = userId;
        this.roleId = roleId;
        this.startAt = startAt;
        this.endAt = endAt;
    }
}
