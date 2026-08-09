<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>支払い確認画面 — Easy order</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="card bg-base-100 shadow-sm">
	<div class="card-body items-center text-center">
		<h1 class="card-title text-2xl">支払い確認画面</h1>
		<p class="text-sm opacity-80">
			料金をお支払の上この画面を学生にお見せください。(ご提示いただけなかった場合発送できません)
		</p>

		<div class="divider">確認番号</div>
		<p class="font-mono text-6xl font-bold tracking-[0.2em] text-primary">{data.confirm}</p>

		{#if data.paid}
			<div class="badge badge-success badge-lg">お支払い済み</div>
		{:else}
			<div class="badge badge-outline badge-lg">{data.payLabel}</div>
		{/if}
	</div>
</div>

<div class="card bg-base-100 shadow-sm">
	<div class="card-body">
		<h2 class="card-title text-lg">ご注文内容</h2>
		<div class="overflow-x-auto">
			<table class="table">
				<thead>
					<tr>
						<th>サイズ</th>
						<th class="text-right">枚数</th>
					</tr>
				</thead>
				<tbody>
					{#each data.lines as line (line.label)}
						<tr class:opacity-50={line.count === 0}>
							<td>{line.label}</td>
							<td class="text-right tabular-nums">{line.count}</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr class="font-bold">
						<th>合計</th>
						<th class="text-right tabular-nums">{data.total}</th>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
</div>

<a href="/" class="btn btn-ghost btn-block">新しく注文する</a>

<div role="alert" class="alert">
	<span class="text-sm">
		このページのURLは注文ごとの控えです。ブックマークしてお手元に保管してください。
	</span>
</div>
