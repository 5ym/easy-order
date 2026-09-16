<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} — Easy order</title>
</svelte:head>

<div class="panel body center">
	<h1>{page.status}</h1>
	<p class="muted">
		{page.error?.message ?? 'ページが見つかりませんでした。'}
	</p>
	<a href="/" class="button">フォームに戻る</a>
</div>

<style>
	.center {
		align-items: center;
		text-align: center;
	}
	h1 {
		font-size: 3rem;
	}
	a.button {
		margin-top: 0.5rem;
	}
</style>
