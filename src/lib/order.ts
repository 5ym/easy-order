/** Maximum quantity selectable per shirt size. */
export const MAX_PER_SIZE = 10;

/** Upper bound on the total number of shirts in a single order. */
export const MAX_TOTAL_SHIRTS = 30;

/** Display order of the size selects. */
export const SHIRT_SIZE_KEYS = ['ss', 's', 'm', 'l', 'll', '3l'] as const;
export type ShirtSizeKey = (typeof SHIRT_SIZE_KEYS)[number];
export type ShirtCounts = Record<ShirtSizeKey, number>;

/** Label + height guidance per size. The Record type keeps this exhaustive. */
export const SHIRT_SIZES: Record<ShirtSizeKey, { label: string; height: string }> = {
	ss: { label: 'SSサイズ', height: '155cm-160cm' },
	s: { label: 'Sサイズ', height: '155cm-165cm' },
	m: { label: 'Mサイズ', height: '165cm-175cm' },
	l: { label: 'Lサイズ', height: '170cm-180cm' },
	ll: { label: 'LLサイズ', height: '175cm-185cm' },
	'3l': { label: '3Lサイズ', height: '180cm-190cm' }
};

export const DEPARTMENTS = [
	'機械工学科',
	'電気電子工学科',
	'電子制御工学科',
	'情報工学科',
	'環境都市工学科',
	'ME専攻科',
	'DJ専攻科',
	'CC専攻科'
] as const;
export type Department = (typeof DEPARTMENTS)[number];

export const GRADES = ['1年', '2年', '3年', '4年', '5年', '専攻1年', '専攻2年'] as const;
export type Grade = (typeof GRADES)[number];

/** Optional survey: which future shirt design interests the customer. */
export const QUEST_OPTIONS = [
	'再履修願',
	'年度内再評価願',
	'入寮願',
	'退寮願',
	'退職願'
] as const;
export type QuestOption = (typeof QUEST_OPTIONS)[number];

export const PAYMENT_METHODS = [{ value: 'cash', label: '当日現金払い' }] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]['value'];

interface BaseOrder {
	sizes: ShirtCounts;
	quest: QuestOption | null;
	etc: string;
	pay: PaymentMethod;
}

export interface StudentOrder extends BaseOrder {
	out: 'yes';
	department: Department;
	grade: Grade;
	name: string;
}

export interface CivilianOrder extends BaseOrder {
	out: 'no';
	name: string;
	tel: string;
	email: string;
	address: string;
}

/** The validated payload persisted in `orders.data`. */
export type OrderData = StudentOrder | CivilianOrder;

/** Field name -> message. The `form` key holds whole-form errors. */
export type FieldErrors = Record<string, string>;

export type ValidationResult =
	| { ok: true; data: OrderData }
	| { ok: false; errors: FieldErrors };

export const totalShirts = (counts: ShirtCounts): number =>
	SHIRT_SIZE_KEYS.reduce((sum, key) => sum + counts[key], 0);

/** Deliberately permissive: enough to catch typos, without rejecting valid addresses. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate a submitted order form.
 *
 * Every field is checked before returning, so the user sees all problems at
 * once rather than one per round trip.
 */
export function validateOrder(form: FormData): ValidationResult {
	const errors: FieldErrors = {};

	const text = (name: string): string => {
		const value = form.get(name);
		return typeof value === 'string' ? value.trim() : '';
	};

	/** Required free text, bounded so a single POST cannot store unbounded input. */
	const requiredText = (name: string, label: string, max: number): string => {
		const value = text(name);
		if (!value) errors[name] = `${label}をご記入ください。`;
		else if (value.length > max) errors[name] = `${label}は${max}文字以内でご記入ください。`;
		return value;
	};

	const option = <T extends string>(name: string, allowed: readonly T[], message: string) => {
		const value = text(name);
		if ((allowed as readonly string[]).includes(value)) return value as T;
		errors[name] = message;
		return undefined;
	};

	const sizes = {} as ShirtCounts;
	for (const key of SHIRT_SIZE_KEYS) {
		const raw = text(`size-${key}`) || '0';
		const count = Number(raw);
		if (!Number.isInteger(count) || count < 0 || count > MAX_PER_SIZE) {
			errors.sizes = `数量は各サイズ0〜${MAX_PER_SIZE}枚でご指定ください。`;
			sizes[key] = 0;
		} else {
			sizes[key] = count;
		}
	}

	if (!errors.sizes) {
		const total = totalShirts(sizes);
		if (total < 1) errors.sizes = 'Tシャツを1枚以上ご指定ください。';
		else if (total > MAX_TOTAL_SHIRTS) {
			errors.sizes = `1回のご注文は合計${MAX_TOTAL_SHIRTS}枚までです。`;
		}
	}

	const questRaw = text('quest');
	let quest: QuestOption | null = null;
	if (questRaw) {
		quest = option('quest', QUEST_OPTIONS, '選択肢が不正です。') ?? null;
	}

	const etc = text('etc');
	if (etc.length > 1000) errors.etc = 'その他要望は1000文字以内でご記入ください。';

	const pay = option('pay', PAYMENT_METHODS.map((m) => m.value), '支払い方法を選択してください。');

	const out = option('out', ['yes', 'no'] as const, '木更津高専生かどうかを選択してください。');
	const name = requiredText('name', out === 'no' ? 'ご宛名' : 'お名前', 100);

	let department: Department | undefined;
	let grade: Grade | undefined;
	let tel = '';
	let email = '';
	let address = '';

	if (out === 'yes') {
		department = option('department', DEPARTMENTS, '学科を選択してください。');
		grade = option('grade', GRADES, '学年を選択してください。');
	} else if (out === 'no') {
		tel = requiredText('tel', 'ご連絡先の携帯番号（お持ちでない場合は「なし」）', 50);
		address = requiredText('address', '配送先ご住所', 500);
		email = text('email');
		if (email.length > 255) errors.email = 'メールアドレスは255文字以内でご記入ください。';
		else if (email && !EMAIL_PATTERN.test(email)) {
			errors.email = 'メールアドレスの形式が正しくありません。';
		}
	}

	if (Object.keys(errors).length > 0) return { ok: false, errors };

	// Every branch above recorded an error for anything missing, so the
	// remaining narrowing is exhaustive.
	if (out === 'yes') {
		return {
			ok: true,
			data: { out, department: department!, grade: grade!, name, sizes, quest, etc, pay: pay! }
		};
	}
	return {
		ok: true,
		data: { out: 'no', name, tel, email, address, sizes, quest, etc, pay: pay! }
	};
}
