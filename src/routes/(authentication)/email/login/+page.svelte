<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { navigating } from '$app/stores';
	export let form;
	let submiting = false;
</script>

<main>
	<h1>Sign in</h1>
	<form
		method="post"
		use:enhance={() => {
			submiting = true;

			return async ({ result }) => {
				submiting = false;
				await applyAction(result);
			};
		}}
	>
		<label for="username">Username</label>
		<input name="username" id="username" />

		<label for="password">Password</label>
		<input type="password" name="password" id="password" />

		<input
			type="submit"
			disabled={submiting || $navigating != null}
			value={submiting || $navigating != null ? 'logging in ...' : 'Log in'}
		/>
	</form>
	<a href="/email/signup">Create an account</a>

	{#if form}
		<p class="error">{form.message}</p>
	{/if}
</main>

<style>
	main {
		margin: auto;
		margin-top: 1rem;
		width: 300px;

		& h1 {
			text-decoration: underline;
			margin-bottom: 1rem;
		}

		& form {
			display: grid;
			grid-template-columns: repeat(2, 1fr); /* Two columns of equal width */
			grid-template-rows: auto auto auto; /* Three rows */
			gap: 10px; /* Space between grid items */
			margin-bottom: 0.5rem;

			& input {
				border: 1px solid gray;
			}

			& *:last-child {
				grid-column: 1 / -1;
				text-align: center;
				border: 1px solid darkred;
				padding: 0.25rem;
				color: darkred;
				box-shadow: 2px 2px black;

				&:active {
					background-color: lightcoral;
					transform: translate(2px, 2px);
					box-shadow: none;
				}
			}
		}
		& a {
			display: inline-block;
			width: 100%;
			text-decoration: underline;
			text-align: right;
		}
	}
	.error {
		color: darkred;
		font-weight: bold;
		text-align: center;
		margin-top: 1rem;
	}
</style>
