<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		DEPARTMENTS,
		GRADES,
		MAX_PER_SIZE,
		PAYMENT_METHODS,
		QUEST_OPTIONS,
		SHIRT_SIZE_KEYS,
		SHIRT_SIZES
	} from '$lib/order';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	const quantities = Array.from({ length: MAX_PER_SIZE + 1 }, (_, i) => i);

	/** Which branch of the form to show. Restored from a failed submission. */
	let out = $state<'yes' | 'no' | ''>('');
	let submitting = $state(false);

	$effect(() => {
		const previous = form?.values?.out;
		if (previous === 'yes' || previous === 'no') out = previous;
	});

	const errors = $derived(form?.errors ?? {});
	const values = $derived(form?.values ?? {});
</script>

<svelte:head>
	<title>Easy order — 文化祭 退学願 Tシャツ販売フォーム</title>
	<meta name="description" content="木更津高専 文化祭 退学願Tシャツの注文フォームです。" />
</svelte:head>

<div class="panel body">
	<h1>文化祭 退学願 Tシャツ販売フォーム</h1>
	<p class="small muted">
		ご購入頂きありがとうございます！<br />
		昨日から予想を上回る販売となり、おかげさまで店頭在庫が売り切れてしまいました。<br />
		大変申し訳ありませんが後日、受注して発送いたします。大変申し訳ございません。<br />
		7~10日程でご用意ができると思いますので、少々お待ちください。<br />
		重ね重ね大変恐縮ですが、ご購入本当にありがとうございます。<br />
		この後もぜひ木更津高専文化祭をお楽しみください。
	</p>
	<p class="small signature">木更津高専 4年情報工学科　川名 健太</p>
</div>

<noscript>
	<div role="alert" class="note warn">
		<span>このフォームはJavaScriptを有効にしてご利用ください。</span>
	</div>
</noscript>

{#if errors.form}
	<div role="alert" class="note err">
		<span>{errors.form}</span>
	</div>
{/if}

<form
	method="POST"
	novalidate
	use:enhance={() => {
		submitting = true;
		return async ({ update }) => {
			await update({ reset: false });
			submitting = false;
		};
	}}
	class="stack"
>
	<div class="panel body">
		<fieldset>
			<legend>木更津高専生ですか？</legend>
			<label class="check">
				<input type="radio" name="out" value="yes" bind:group={out} />
				<span>はい (基本的に学校での手渡しとなります)</span>
			</label>
			<label class="check">
				<input type="radio" name="out" value="no" bind:group={out} />
				<span>いいえ (後日、配送となります)</span>
			</label>
			{#if errors.out}<p class="small msg">{errors.out}</p>{/if}
		</fieldset>
	</div>

	{#if out === 'yes'}
		<div class="panel body">
			<fieldset>
				<legend>学科をお答えください。</legend>
				{#each DEPARTMENTS as department (department)}
					<label class="check">
						<input
							type="radio"
							name="department"
							value={department}
							checked={values.department === department}
						/>
						<span>{department}</span>
					</label>
				{/each}
				{#if errors.department}<p class="small msg">{errors.department}</p>{/if}
			</fieldset>
		</div>

		<div class="panel body">
			<fieldset>
				<legend>学年をお答えください。</legend>
				{#each GRADES as grade (grade)}
					<label class="check">
						<input type="radio" name="grade" value={grade} checked={values.grade === grade} />
						<span>{grade}</span>
					</label>
				{/each}
				{#if errors.grade}<p class="small msg">{errors.grade}</p>{/if}
			</fieldset>
		</div>

		<div class="panel body">
			<fieldset>
				<legend>お名前をお書きください。</legend>
				<input
					type="text"
					name="name"
					value={values.name ?? ''}
					autocomplete="name"
					class:invalid={errors.name}
				/>
				{#if errors.name}<p class="small msg">{errors.name}</p>{/if}
			</fieldset>
		</div>
	{:else if out === 'no'}
		<div class="panel body">
			<p class="small muted">
				電話番号は配送又はご連絡の際、メールアドレスはご連絡の用途に使用します。なるべくご記入ください。
			</p>
		</div>

		<div class="panel body">
			<fieldset>
				<legend>
					ご連絡先の携帯番号をご記入ください(電話番号をお持ちでない方は、「なし」とお書きください)。
				</legend>
				<input
					type="tel"
					name="tel"
					value={values.tel ?? ''}
					autocomplete="tel"
					class:invalid={errors.tel}
				/>
				{#if errors.tel}<p class="small msg">{errors.tel}</p>{/if}
			</fieldset>
		</div>

		<div class="panel body">
			<fieldset>
				<legend>ご連絡先のメールアドレスをご記入ください。</legend>
				<input
					type="email"
					name="email"
					value={values.email ?? ''}
					autocomplete="email"
					class:invalid={errors.email}
				/>
				{#if errors.email}<p class="small msg">{errors.email}</p>{/if}
			</fieldset>
		</div>

		<div class="panel body">
			<fieldset>
				<legend>配送先ご住所をご記入ください。</legend>
				<input
					type="text"
					name="address"
					value={values.address ?? ''}
					autocomplete="street-address"
					class:invalid={errors.address}
				/>
				{#if errors.address}<p class="small msg">{errors.address}</p>{/if}
			</fieldset>
		</div>

		<div class="panel body">
			<fieldset>
				<legend>ご宛名をお書きください。</legend>
				<input
					type="text"
					name="name"
					value={values.name ?? ''}
					autocomplete="name"
					class:invalid={errors.name}
				/>
				{#if errors.name}<p class="small msg">{errors.name}</p>{/if}
			</fieldset>
		</div>
	{/if}

	{#if out}
		<div class="panel body">
			<fieldset>
				<legend>
					Tシャツのサイズをお答えください。(その他のサイズをご希望の場合はご記入ください)。
				</legend>
				<p class="small muted">※参考</p>
				<img src="/img/size.png" alt="サイズ表" />

				{#each SHIRT_SIZE_KEYS as key (key)}
					<label for="size-{key}">
						{SHIRT_SIZES[key].label}({SHIRT_SIZES[key].height})
					</label>
					<select id="size-{key}" name="size-{key}">
						{#each quantities as quantity (quantity)}
							<option value={quantity} selected={(values[`size-${key}`] ?? '0') === String(quantity)}>
								{quantity}
							</option>
						{/each}
					</select>
				{/each}

				{#if errors.sizes}<p class="small msg">{errors.sizes}</p>{/if}
			</fieldset>
		</div>

		<div class="panel body">
			<fieldset>
				<legend>
					今後、他の種類のTシャツを販売予定です。気になるものがあればお答えください。また、アイデアございましたら、その他にお書きください。
				</legend>
				{#each QUEST_OPTIONS as option (option)}
					<label class="check">
						<input type="radio" name="quest" value={option} checked={values.quest === option} />
						<span>{option}</span>
					</label>
				{/each}
				{#if errors.quest}<p class="small msg">{errors.quest}</p>{/if}
			</fieldset>
		</div>

		<div class="panel body">
			<fieldset>
				<legend>その他要望があればご記入ください。</legend>
				<textarea name="etc" rows="3">{values.etc ?? ''}</textarea>
				{#if errors.etc}<p class="small msg">{errors.etc}</p>{/if}
			</fieldset>
		</div>

		<div class="panel body">
			<fieldset>
				<legend>支払い方法を選択してください。</legend>
				{#each PAYMENT_METHODS as method (method.value)}
					<label class="check">
						<input
							type="radio"
							name="pay"
							value={method.value}
							checked={values.pay ? values.pay === method.value : true}
						/>
						<span>{method.label}</span>
					</label>
				{/each}
				{#if errors.pay}<p class="small msg">{errors.pay}</p>{/if}
			</fieldset>
		</div>

		<button type="submit" disabled={submitting}>
			{#if submitting}<span class="spin"></span>{/if}
			確定
		</button>
	{/if}
</form>

<style>
	.signature {
		font-weight: 500;
	}
	/* 設問のひと組。枠は箱(.panel)側が持つので、fieldset からは外す */
	fieldset {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		border: 0;
		padding: 0;
	}
	legend {
		padding: 0;
		font-size: 0.95rem;
		font-weight: 700;
	}
	/* サイズごとの枚数。ラベルと選択欄の組の間を空ける */
	label[for] {
		margin-top: 0.5rem;
	}
	/* 入力の誤りは枠の色で示す */
	input.invalid {
		border-color: var(--ui-err);
	}
	.msg {
		color: var(--ui-err);
	}
	img {
		width: 100%;
		height: auto;
		border-radius: var(--pico-border-radius);
	}
	/* 送信は最後のひと押しなので横幅いっぱいに置く */
	button[type='submit'] {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
	}
</style>
