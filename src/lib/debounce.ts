export function debounce(cb: () => void, delay: number = 10) {
	let timeoutId: NodeJS.Timeout | undefined = undefined;

	return () => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(cb, delay);
	};
}
