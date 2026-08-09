<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col bg-base-200">
	<main class="mx-auto w-full max-w-2xl flex-1 space-y-4 p-4">
		{@render children()}
	</main>

	<footer class="footer footer-center gap-2 bg-base-300 p-6 text-base-content">
		<nav class="grid grid-flow-col gap-4">
			<a class="link link-hover" href="https://github.com/5ym/easy-order">source</a>
			<a class="link link-hover" href="https://twitter.com/5yuim">author</a>
		</nav>
	</footer>
</div>
