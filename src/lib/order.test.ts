import { describe, expect, test } from 'bun:test';
import { MAX_PER_SIZE, SHIRT_SIZE_KEYS, totalShirts, validateOrder } from './order';

function buildForm(fields: Record<string, string>): FormData {
	const form = new FormData();
	for (const [key, value] of Object.entries(fields)) form.append(key, value);
	return form;
}

const studentFields = {
	out: 'yes',
	department: '情報工学科',
	grade: '4年',
	name: '川名 健太',
	'size-m': '2',
	quest: '再履修願',
	etc: '',
	pay: 'cash'
};

const civilianFields = {
	out: 'no',
	name: '山田 太郎',
	tel: '090-0000-0000',
	email: 'taro@example.com',
	address: '千葉県木更津市清見台東2-11-1',
	'size-l': '1',
	pay: 'cash'
};

const validate = (fields: Record<string, string>) => validateOrder(buildForm(fields));

describe('validateOrder', () => {
	test('accepts a student order and defaults unspecified sizes to 0', () => {
		const result = validate(studentFields);
		expect(result.ok).toBe(true);
		if (!result.ok) return;

		expect(result.data.out).toBe('yes');
		expect(result.data.sizes.m).toBe(2);
		expect(result.data.sizes.ss).toBe(0);
		expect(totalShirts(result.data.sizes)).toBe(2);
	});

	test('accepts a civilian order', () => {
		const result = validate(civilianFields);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.data.out).toBe('no');
		if (result.data.out !== 'no') return;
		expect(result.data.address).toBe('千葉県木更津市清見台東2-11-1');
	});

	test('drops contact fields that do not belong to the chosen branch', () => {
		const result = validate({ ...studentFields, address: '送信されるべきでない住所' });
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.data as unknown as Record<string, unknown>).not.toHaveProperty('address');
	});

	test('trims surrounding whitespace', () => {
		const result = validate({ ...studentFields, name: '  川名 健太  ' });
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.data.name).toBe('川名 健太');
	});

	test('rejects an order with no shirts', () => {
		const result = validate({ ...studentFields, 'size-m': '0' });
		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.errors.sizes).toBe('Tシャツを1枚以上ご指定ください。');
	});

	test('rejects a per-size quantity above the maximum', () => {
		const result = validate({ ...studentFields, 'size-m': String(MAX_PER_SIZE + 1) });
		expect(result.ok).toBe(false);
	});

	test('rejects a non-integer quantity', () => {
		expect(validate({ ...studentFields, 'size-m': '1.5' }).ok).toBe(false);
		expect(validate({ ...studentFields, 'size-m': 'abc' }).ok).toBe(false);
	});

	test('rejects a total above MAX_TOTAL_SHIRTS', () => {
		const maxed = Object.fromEntries(
			SHIRT_SIZE_KEYS.map((key) => [`size-${key}`, String(MAX_PER_SIZE)])
		);
		const result = validate({ ...studentFields, ...maxed });
		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.errors.sizes).toContain('合計');
	});

	test('rejects an unknown department', () => {
		const result = validate({ ...studentFields, department: '存在しない学科' });
		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.errors).toHaveProperty('department');
	});

	test('rejects a missing "out" answer', () => {
		const { out, ...rest } = studentFields;
		void out;
		expect(validate(rest).ok).toBe(false);
	});

	test('requires a name', () => {
		const result = validate({ ...studentFields, name: '   ' });
		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.errors.name).toBe('お名前をご記入ください。');
	});

	test('requires tel and address only for non-students', () => {
		const { tel, address, ...rest } = civilianFields;
		void tel;
		void address;
		const result = validate(rest);
		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(result.errors).toHaveProperty('tel');
		expect(result.errors).toHaveProperty('address');
	});

	test('allows an empty email but rejects a malformed one', () => {
		expect(validate({ ...civilianFields, email: '' }).ok).toBe(true);
		expect(validate({ ...civilianFields, email: 'not-an-email' }).ok).toBe(false);
	});

	test('reports every problem in one pass', () => {
		const result = validate({ out: 'no', pay: 'cash' });
		expect(result.ok).toBe(false);
		if (result.ok) return;
		expect(Object.keys(result.errors).sort()).toEqual(['address', 'name', 'sizes', 'tel']);
	});

	test('treats an unanswered survey as null', () => {
		const { quest, ...rest } = studentFields;
		void quest;
		const result = validate(rest);
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		expect(result.data.quest).toBeNull();
	});

	test('rejects an unsupported payment method', () => {
		expect(validate({ ...studentFields, pay: 'card' }).ok).toBe(false);
	});
});
