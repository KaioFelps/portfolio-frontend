export class PaginationHelper {
	public static getVisibleButtons(
		visibleButtons: number = 5,
		currentPage: number,
		lastPage: number,
	) {
		let maxLeft = currentPage - Math.floor(visibleButtons / 2);
		let maxRight = currentPage + Math.floor(visibleButtons / 2);

		if (maxLeft <= 1) {
			maxLeft = 1;
			maxRight = visibleButtons;
		}

		if (maxRight >= lastPage) {
			maxLeft = lastPage - (visibleButtons - 1);
			maxRight = lastPage;
		}

		if (lastPage < visibleButtons + 1) {
			maxLeft = 1;
			maxRight = lastPage;
		}

		return {
			maxLeft,
			maxRight,
		};
	}

	public static getQueryObjectFromUrl(url: string, args: Record<string, string | number> = {}) {
		let queryString = url;

		if (queryString.indexOf("?") === -1) {
			return {};
		}

		queryString = queryString.substring(queryString.indexOf("?") + 1);

		return Object.assign(Object.fromEntries(new URLSearchParams(queryString)), args);
	}

	public static getQueryStringFromUrl(url: string, args: Record<string, string | number> = {}) {
		const query = this.getQueryObjectFromUrl(url);

		const params = Object.entries({ ...query, ...args }).map(([key, value]) => {
			return `${key}=${value}`;
		});

		let string = "?" + params.join("&");

		return string;
	}
}
