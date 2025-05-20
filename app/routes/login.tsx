import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export default function Login() {
	return (
		<div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
					계정에 로그인하세요
				</h2>
				<p className="mt-2 text-center text-sm text-gray-600">
					또는{" "}
					<Link
						to="/signup"
						className="font-medium text-blue-600 hover:text-blue-500"
					>
						새 계정 만들기
					</Link>
				</p>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
					<form className="space-y-6" action="#" method="POST">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								이메일 주소
							</label>
							<div className="mt-1">
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								비밀번호
							</label>
							<div className="mt-1">
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
								/>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<label
									htmlFor="remember-me"
									className="ml-2 block text-sm text-gray-900"
								>
									로그인 상태 유지
								</label>
							</div>

							<div className="text-sm">
								<Link
									to="/forgot-password"
									className="font-medium text-blue-600 hover:text-blue-500"
								>
									비밀번호를 잊으셨나요?
								</Link>
							</div>
						</div>

						<div>
							<Button type="submit" className="w-full">
								로그인
							</Button>
						</div>
					</form>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-white px-2 text-gray-500">
									또는 계속하기
								</span>
							</div>
						</div>

						<div className="mt-6 grid grid-cols-3 gap-3">
							<div>
								<Button variant="outline" className="w-full">
									Google
								</Button>
							</div>
							<div>
								<Button variant="outline" className="w-full">
									discord
								</Button>
							</div>

							<div>
								<Button variant="outline" className="w-full">
									kakaotalk
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
