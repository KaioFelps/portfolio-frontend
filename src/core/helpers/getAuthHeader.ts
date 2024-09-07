export function genHeadersWithAuth(
	token: string | undefined,
	headers: Record<string, string> = {},
) {
	if (token) headers["Authorization"] = `Bearer ${token}`;
	return new Headers(headers);
}
