import type { HandleServerError, ServerInit } from '@sveltejs/kit';
import { runMigrations } from '$lib/server/db';

export const init: ServerInit = () => {
	runMigrations();
};

export const handleError: HandleServerError = ({ error, status }) => {
	if (status !== 404) console.error(error);
	return { message: '問題が発生しました。管理者にお問い合わせください。' };
};
