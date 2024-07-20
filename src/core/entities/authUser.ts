import type { UserRoleEnum } from "./userRoleEnum";

export type AuthUser = {
	sub: string;
	name: string;
	role: UserRoleEnum;
};
