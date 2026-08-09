import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { OrderData } from '$lib/order';

// The db module reads DATABASE_PATH at import time, so point it at a scratch
// file before pulling anything in.
const dir = mkdtempSync(join(tmpdir(), 'easy-order-test-'));
process.env.DATABASE_PATH = join(dir, 'test.sqlite');

const { runMigrations } = await import('./db');
const { createOrder, getOrderByToken, markOrderPaid } = await import('./orders');

const sampleOrder: OrderData = {
	out: 'yes',
	department: '情報工学科',
	grade: '4年',
	name: '川名 健太',
	sizes: { ss: 0, s: 0, m: 2, l: 0, ll: 0, '3l': 0 },
	quest: '再履修願',
	etc: '',
	pay: 'cash'
};

beforeAll(() => runMigrations());
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe('orders repository', () => {
	test('createOrder allocates a 4-digit confirm code and a URL-safe token', () => {
		const order = createOrder(sampleOrder);

		expect(order.confirm).toMatch(/^\d{4}$/);
		expect(order.token).toMatch(/^[A-Za-z0-9_-]{22}$/);
		expect(order.paid).toBe(false);
		expect(order.createdAt).toBeInstanceOf(Date);
	});

	test('round-trips the order payload through the JSON column', () => {
		const { token } = createOrder(sampleOrder);
		const found = getOrderByToken(token);

		expect(found).toBeDefined();
		expect(found?.data).toEqual(sampleOrder);
		expect(found?.data.sizes.m).toBe(2);
	});

	test('issues distinct tokens and confirm codes across many orders', () => {
		const created = Array.from({ length: 200 }, () => createOrder(sampleOrder));

		expect(new Set(created.map((o) => o.token)).size).toBe(created.length);
		expect(new Set(created.map((o) => o.confirm)).size).toBe(created.length);
	});

	test('getOrderByToken returns undefined for an unknown token', () => {
		expect(getOrderByToken('this-token-does-not-exist')).toBeUndefined();
	});

	test('markOrderPaid flips the paid flag', () => {
		const { token } = createOrder(sampleOrder);

		expect(markOrderPaid(token)?.paid).toBe(true);
		expect(getOrderByToken(token)?.paid).toBe(true);
	});

	test('runMigrations is idempotent', () => {
		const before = getOrderByToken(createOrder(sampleOrder).token);
		runMigrations();
		expect(getOrderByToken(before!.token)).toBeDefined();
	});
});
