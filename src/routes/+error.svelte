<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} — Easy order</title>
</svelte:head>

<div class="card bg-base-100 shadow-sm">
	<div class="card-body items-center text-center">
		<h1 class="card-title text-5xl">{page.status}</h1>
		<p class="opacity-80">
			{page.error?.message ?? 'ページが見つかりませんでした。'}
		</p>
		<a href="/" class="btn btn-primary mt-2">フォームに戻る</a>
	</div>
</div>
