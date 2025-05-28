import { timestamp, bigint } from "drizzle-orm/pg-core";

/**
 * 공통 타임스탬프 필드를 위한 헬퍼
 * created_at과 updated_at 필드를 모든 테이블에 추가할 수 있습니다.
 */
export const timestamps = {
	created_at: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updated_at: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.$onUpdate(() => new Date()),
};

/**
 * Identity column 헬퍼 함수
 * Auto-incrementing bigint primary key를 생성합니다.
 */
export function makeIdentityColumn(columnName: string) {
	return {
		[columnName]: bigint(columnName, { mode: "number" })
			.primaryKey()
			.generatedAlwaysAsIdentity(),
	};
}
