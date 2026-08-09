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

<div class="card bg-base-100 shadow-sm">
	<div class="card-body">
		<h1 class="card-title text-2xl">文化祭 退学願 Tシャツ販売フォーム</h1>
		<p class="text-sm leading-relaxed opacity-80">
			ご購入頂きありがとうございます！<br />
			昨日から予想を上回る販売となり、おかげさまで店頭在庫が売り切れてしまいました。<br />
			大変申し訳ありませんが後日、受注して発送いたします。大変申し訳ございません。<br />
			7~10日程でご用意ができると思いますので、少々お待ちください。<br />
			重ね重ね大変恐縮ですが、ご購入本当にありがとうございます。<br />
			この後もぜひ木更津高専文化祭をお楽しみください。
		</p>
		<p class="text-sm font-medium">木更津高専 4年情報工学科　川名 健太</p>
	</div>
</div>

<noscript>
	<div role="alert" class="alert alert-warning">
		<span>このフォームはJavaScriptを有効にしてご利用ください。</span>
	</div>
</noscript>

{#if errors.form}
	<div role="alert" class="alert alert-error">
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
	class="space-y-4"
>
	<div class="card bg-base-100 shadow-sm">
		<div class="card-body">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">木更津高専生ですか？</legend>
				<label class="label cursor-pointer justify-start gap-3">
					<input type="radio" name="out" value="yes" bind:group={out} class="radio radio-primary" />
					<span>はい (基本的に学校での手渡しとなります)</span>
				</label>
				<label class="label cursor-pointer justify-start gap-3">
					<input type="radio" name="out" value="no" bind:group={out} class="radio radio-primary" />
					<span>いいえ (後日、配送となります)</span>
				</label>
				{#if errors.out}<p class="text-error text-sm">{errors.out}</p>{/if}
			</fieldset>
		</div>
	</div>

	{#if out === 'yes'}
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">学科をお答えください。</legend>
					{#each DEPARTMENTS as department (department)}
						<label class="label cursor-pointer justify-start gap-3">
							<input
								type="radio"
								name="department"
								value={department}
								checked={values.department === department}
								class="radio radio-primary"
							/>
							<span>{department}</span>
						</label>
					{/each}
					{#if errors.department}<p class="text-error text-sm">{errors.department}</p>{/if}
				</fieldset>
			</div>
		</div>

		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">学年をお答えください。</legend>
					{#each GRADES as grade (grade)}
						<label class="label cursor-pointer justify-start gap-3">
							<input
								type="radio"
								name="grade"
								value={grade}
								checked={values.grade === grade}
								class="radio radio-primary"
							/>
							<span>{grade}</span>
						</label>
					{/each}
					{#if errors.grade}<p class="text-error text-sm">{errors.grade}</p>{/if}
				</fieldset>
			</div>
		</div>

		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">お名前をお書きください。</legend>
					<input
						type="text"
						name="name"
						value={values.name ?? ''}
						autocomplete="name"
						class="input w-full"
						class:input-error={errors.name}
					/>
					{#if errors.name}<p class="text-error text-sm">{errors.name}</p>{/if}
				</fieldset>
			</div>
		</div>
	{:else if out === 'no'}
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<p class="text-sm opacity-80">
					電話番号は配送又はご連絡の際、メールアドレスはご連絡の用途に使用します。なるべくご記入ください。
				</p>
			</div>
		</div>

		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">
						ご連絡先の携帯番号をご記入ください(電話番号をお持ちでない方は、「なし」とお書きください)。
					</legend>
					<input
						type="tel"
						name="tel"
						value={values.tel ?? ''}
						autocomplete="tel"
						class="input w-full"
						class:input-error={errors.tel}
					/>
					{#if errors.tel}<p class="text-error text-sm">{errors.tel}</p>{/if}
				</fieldset>
			</div>
		</div>

		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">ご連絡先のメールアドレスをご記入ください。</legend>
					<input
						type="email"
						name="email"
						value={values.email ?? ''}
						autocomplete="email"
						class="input w-full"
						class:input-error={errors.email}
					/>
					{#if errors.email}<p class="text-error text-sm">{errors.email}</p>{/if}
				</fieldset>
			</div>
		</div>

		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">配送先ご住所をご記入ください。</legend>
					<input
						type="text"
						name="address"
						value={values.address ?? ''}
						autocomplete="street-address"
						class="input w-full"
						class:input-error={errors.address}
					/>
					{#if errors.address}<p class="text-error text-sm">{errors.address}</p>{/if}
				</fieldset>
			</div>
		</div>

		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">ご宛名をお書きください。</legend>
					<input
						type="text"
						name="name"
						value={values.name ?? ''}
						autocomplete="name"
						class="input w-full"
						class:input-error={errors.name}
					/>
					{#if errors.name}<p class="text-error text-sm">{errors.name}</p>{/if}
				</fieldset>
			</div>
		</div>
	{/if}

	{#if out}
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">
						Tシャツのサイズをお答えください。(その他のサイズをご希望の場合はご記入ください)。
					</legend>
					<p class="text-sm opacity-70">※参考</p>
					<img src="/img/size.png" alt="サイズ表" class="w-full rounded-box" />

					{#each SHIRT_SIZE_KEYS as key (key)}
						<label class="label" for="size-{key}">
							{SHIRT_SIZES[key].label}({SHIRT_SIZES[key].height})
						</label>
						<select id="size-{key}" name="size-{key}" class="select w-full">
							{#each quantities as quantity (quantity)}
								<option value={quantity} selected={(values[`size-${key}`] ?? '0') === String(quantity)}>
									{quantity}
								</option>
							{/each}
						</select>
					{/each}

					{#if errors.sizes}<p class="text-error text-sm">{errors.sizes}</p>{/if}
				</fieldset>
			</div>
		</div>

		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">
						今後、他の種類のTシャツを販売予定です。気になるものがあればお答えください。また、アイデアございましたら、その他にお書きください。
					</legend>
					{#each QUEST_OPTIONS as option (option)}
						<label class="label cursor-pointer justify-start gap-3">
							<input
								type="radio"
								name="quest"
								value={option}
								checked={values.quest === option}
								class="radio radio-primary"
							/>
							<span>{option}</span>
						</label>
					{/each}
					{#if errors.quest}<p class="text-error text-sm">{errors.quest}</p>{/if}
				</fieldset>
			</div>
		</div>

		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">その他要望があればご記入ください。</legend>
					<textarea name="etc" rows="3" class="textarea w-full">{values.etc ?? ''}</textarea>
					{#if errors.etc}<p class="text-error text-sm">{errors.etc}</p>{/if}
				</fieldset>
			</div>
		</div>

		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">支払い方法を選択してください。</legend>
					{#each PAYMENT_METHODS as method (method.value)}
						<label class="label cursor-pointer justify-start gap-3">
							<input
								type="radio"
								name="pay"
								value={method.value}
								checked={values.pay ? values.pay === method.value : true}
								class="radio radio-primary"
							/>
							<span>{method.label}</span>
						</label>
					{/each}
					{#if errors.pay}<p class="text-error text-sm">{errors.pay}</p>{/if}
				</fieldset>
			</div>
		</div>

		<button type="submit" class="btn btn-primary btn-block" disabled={submitting}>
			{#if submitting}<span class="loading loading-spinner"></span>{/if}
			確定
		</button>
	{/if}
</form>
