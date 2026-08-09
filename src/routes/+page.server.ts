import { fail, redirect } from '@sveltejs/kit';
import { validateOrder, type FieldErrors } from '$lib/order';
import { ConfirmCodeExhaustedError, createOrder } from '$lib/server/orders';
import type { Actions } from './$types';

/** Echo the submission back so the form survives a failed POST without JS. */
function submittedValues(form: FormData): Record<string, string> {
	const values: Record<string, string> = {};
	for (const [key, value] of form) {
		if (typeof value === 'string') values[key] = value;
	}
	return values;
}

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const result = validateOrder(form);

		if (!result.ok) {
			return fail(400, { errors: result.errors, values: submittedValues(form) });
		}

		let token: string;
		try {
			token = createOrder(result.data).token;
		} catch (error) {
			if (error instanceof ConfirmCodeExhaustedError) {
				console.error(error);
				const errors: FieldErrors = {
					form: '確認番号を発行できませんでした。時間をおいて再度お試しください。'
				};
				return fail(503, { errors, values: submittedValues(form) });
			}
			throw error;
		}

		// Outside the try block: redirect() signals by throwing.
		redirect(303, `/pay/${token}`);
	}
} satisfies Actions;
