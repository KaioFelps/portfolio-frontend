type Status = { code: "clean" } | { code: "error"; message: string } | { code: "success" };
type InternalStatus = Status & { message?: string };

/** Help managing form error and success toast display */
export class FormStatus {
	private _status: InternalStatus = $state<InternalStatus>({
		code: "clean",
	});

	get status(): Status {
		return this._status;
	}

	clean() {
		this._status.code = "clean";
		delete this._status.message;
	}

	getCleanCallback() {
		return this.clean.bind(this);
	}

	error(msg: string) {
		this._status.code = "error";
		this._status.message = msg;
	}

	success() {
		this._status.code = "success";
		delete this._status.message;
	}
}
