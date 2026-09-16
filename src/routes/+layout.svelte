<script lang="ts">
	import '../app.scss';

	let { children } = $props();
</script>

<div class="shell">
	<main class="page stack">
		{@render children()}
	</main>

	<footer>
		<nav>
			<a href="https://github.com/5ym/easy-order">source</a>
			<a href="https://twitter.com/5yuim">author</a>
		</nav>
	</footer>
</div>

<style>
	/* 中身が短いページでも footer を下端に置く */
	.shell {
		display: flex;
		flex-direction: column;
		min-height: 100svh;
	}
	main {
		flex: 1 1 auto;
		padding-block: 1rem;
	}
	footer {
		background: var(--ui-base-300);
		padding: 1.5rem 1rem;
	}
	footer nav {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem;
	}
	footer a {
		color: inherit;
		text-decoration: none;
	}
	footer a:hover {
		text-decoration: underline;
	}
</style>
