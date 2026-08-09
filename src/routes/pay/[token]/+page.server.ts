import { error } from '@sveltejs/kit';
import { PAYMENT_METHODS, SHIRT_SIZE_KEYS, SHIRT_SIZES, totalShirts } from '$lib/order';
import { getOrderByToken } from '$lib/server/orders';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const order = getOrderByToken(params.token);
	if (!order) error(404, { message: '注文が見つかりませんでした。' });

	// Only the details the customer needs at the counter — no name/address/contact.
	return {
		confirm: order.confirm,
		paid: order.paid,
		payLabel:
			PAYMENT_METHODS.find((method) => method.value === order.data.pay)?.label ?? order.data.pay,
		lines: SHIRT_SIZE_KEYS.map((key) => ({
			label: SHIRT_SIZES[key].label,
			count: order.data.sizes[key]
		})),
		total: totalShirts(order.data.sizes)
	};
};
