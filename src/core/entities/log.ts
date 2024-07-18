import type { User } from "./user";

export enum LogAction {
	created = "CREATED",
	updated = "UPDATED",
	deleted = "DELETED",
}

export enum LogTargetType {
	post = "POST",
	project = "PROJECT",
	user = "USER",
}

export type Log = {
	id: string;
	action: LogAction;
	author: User;
	target: string;
	targetType: LogTargetType;
	createdAt: Date;
};
