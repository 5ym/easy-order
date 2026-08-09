import { randomBytes, randomInt } from 'node:crypto';
import type { OrderData } from '$lib/order';
import { db } from './db';

const CONFIRM_DIGITS = 4;
const CONFIRM_SPACE = 10 ** CONFIRM_DIGITS;

/**
 * Retries for the confirm-code collision loop. The code space is only 10,000,
 * so once a festival gets anywhere near that many orders, insertion legitimately
 * starts failing — surface it loudly instead of spinning forever (the PHP
 * original looped unbounded here).
 */
const MAX_INSERT_ATTEMPTS = 25;

export interface Order {
	id: number;
	token: string;
	confirm: string;
	data: OrderData;
	paid: boolean;
	createdAt: Date;
	updatedAt: Date;
}

/** Column-for-column shape of a row, before decoding JSON/boolean/timestamps. */
interface OrderRow {
	id: number;
	token: string;
	confirm: string;
	data: string;
	paid: number;
	created_at: number;
	updated_at: number;
}

const toOrder = (row: OrderRow): Order => ({
	id: row.id,
	token: row.token,
	confirm: row.confirm,
	data: JSON.parse(row.data) as OrderData,
	paid: row.paid !== 0,
	createdAt: new Date(row.created_at * 1000),
	updatedAt: new Date(row.updated_at * 1000)
});

/** 4-digit, zero-padded, uniformly distributed over 0000-9999. */
function randomConfirmCode(): string {
	return String(randomInt(0, CONFIRM_SPACE)).padStart(CONFIRM_DIGITS, '0');
}

/** 22-char URL-safe token. Unguessable, so /pay/<token> is not enumerable. */
function randomToken(): string {
	return randomBytes(16).toString('base64url');
}

function isUniqueViolation(error: unknown): boolean {
	const code = (error as { code?: unknown } | null)?.code;
	if (typeof code === 'string' && code.startsWith('SQLITE_CONSTRAINT')) return true;
	return error instanceof Error && error.message.includes('UNIQUE constraint failed');
}

export class ConfirmCodeExhaustedError extends Error {
	constructor() {
		super(`Could not allocate a free ${CONFIRM_DIGITS}-digit confirm code`);
		this.name = 'ConfirmCodeExhaustedError';
	}
}

const insertOrder = () =>
	db.query<OrderRow, [string, string, string]>(
		'INSERT INTO orders (token, confirm, data) VALUES (?, ?, ?) RETURNING *'
	);

/**
 * Persist an order, allocating a unique token and confirm code.
 * Uniqueness is enforced by the DB, so concurrent inserts cannot collide —
 * we simply retry the losing side.
 */
export function createOrder(data: OrderData): Order {
	const payload = JSON.stringify(data);

	for (let attempt = 0; attempt < MAX_INSERT_ATTEMPTS; attempt++) {
		try {
			const row = insertOrder().get(randomToken(), randomConfirmCode(), payload);
			if (row) return toOrder(row);
		} catch (error) {
			if (!isUniqueViolation(error)) throw error;
		}
	}
	throw new ConfirmCodeExhaustedError();
}

export function getOrderByToken(token: string): Order | undefined {
	const row = db
		.query<OrderRow, [string]>('SELECT * FROM orders WHERE token = ?')
		.get(token);
	return row ? toOrder(row) : undefined;
}

export function markOrderPaid(token: string): Order | undefined {
	const row = db
		.query<OrderRow, [string]>(
			'UPDATE orders SET paid = 1, updated_at = unixepoch() WHERE token = ? RETURNING *'
		)
		.get(token);
	return row ? toOrder(row) : undefined;
}
