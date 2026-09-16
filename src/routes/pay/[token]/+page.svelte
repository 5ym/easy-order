<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>支払い確認画面 — Easy order</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="panel body center">
	<h1>支払い確認画面</h1>
	<p class="small muted">
		料金をお支払の上この画面を学生にお見せください。(ご提示いただけなかった場合発送できません)
	</p>

	<div class="sep">確認番号</div>
	<p class="confirm mono">{data.confirm}</p>

	{#if data.paid}
		<div class="tag ok">お支払い済み</div>
	{:else}
		<div class="tag">{data.payLabel}</div>
	{/if}
</div>

<div class="panel body">
	<h2>ご注文内容</h2>
	<div class="scroll-x">
		<table>
			<thead>
				<tr>
					<th>サイズ</th>
					<th class="num">枚数</th>
				</tr>
			</thead>
			<tbody>
				{#each data.lines as line (line.label)}
					<tr class:zero={line.count === 0}>
						<td>{line.label}</td>
						<td class="num">{line.count}</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<th>合計</th>
					<th class="num">{data.total}</th>
				</tr>
			</tfoot>
		</table>
	</div>
</div>

<a href="/" class="button ghost">新しく注文する</a>

<div role="alert" class="note">
	<span class="small">
		このページのURLは注文ごとの控えです。ブックマークしてお手元に保管してください。
	</span>
</div>

<style>
	.center {
		align-items: center;
		text-align: center;
	}
	/* 見出し付きの区切り線 */
	.sep {
		display: flex;
		align-self: stretch;
		align-items: center;
		gap: 1rem;
		color: var(--ui-muted);
		font-size: 0.9rem;
	}
	.sep::before,
	.sep::after {
		content: '';
		flex: 1 1 auto;
		height: 1px;
		background: var(--ui-base-300);
	}
	/* 店頭で見せる番号。離れていても読めるように大きく */
	.confirm {
		color: var(--pico-primary);
		font-size: 3.75rem;
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: 0.2em;
	}
	.tag {
		padding: 0.25rem 0.8rem;
		font-size: 0.9rem;
	}
	/* 頼んでいないサイズの行は薄くする */
	tr.zero {
		opacity: 0.5;
	}
	tfoot tr {
		font-weight: 700;
	}
	a.button {
		width: 100%;
	}
</style>
