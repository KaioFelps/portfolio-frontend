export class Jsonable {
	toJSON() {
		return {
			...this,
		};
	}
}
