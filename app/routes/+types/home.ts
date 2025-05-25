export namespace Route {
	export interface MetaArgs {
		params: Record<string, string>;
		location: {
			pathname: string;
			search: string;
			hash: string;
		};
	}
}
