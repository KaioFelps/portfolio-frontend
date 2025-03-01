/** Help managing form error and success toast display */
export class FormStatus {
	private _status: { code: "clean" } | { code: "error"; message: string } | { code: "success" } =
		$state({
			code: "clean",
		});

	get status() {
		return this._status;
	}

	clean() {
		this._status = { code: "clean" };
	}

	error(msg: string) {
		this._status = {
			code: "error",
			message: msg,
		};
	}

	success() {
		this._status = { code: "success" };
	}
}
