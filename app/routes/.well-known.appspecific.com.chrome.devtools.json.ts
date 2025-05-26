import type { LoaderFunctionArgs } from "react-router";

export function loader({ request }: LoaderFunctionArgs) {
	// Chrome DevTools 요청에 대해 빈 JSON 응답 반환
	return new Response("{}", {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
