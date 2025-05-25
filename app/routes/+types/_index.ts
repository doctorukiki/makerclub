export namespace Route {
	export interface LoaderArgs {
		request: Request;
	}

	export interface MetaArgs {}

	export interface ComponentProps {
		loaderData: {};
	}

	export type LoaderData = {};
	export type MetaFunction = () => Array<{
		title?: string;
		name?: string;
		content?: string;
	}>;
}
