<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';
	import { browser } from '$app/environment';

	export let data: PageData;
	export let form;

	$: browser && console.log(form);

	let editing = false;
	let user = { ...data.user };
	let submitting = false;
	function edit() {
		editing = true;
	}
</script>

<main>
	<h1>
		Profile (userid: {data.user.userId})
		{#if !editing}
			<button on:click={edit}>edit</button>
		{/if}
	</h1>

	<form
		method="post"
		use:enhance={() => {
			// pre submit : avant que le form ne soit envoyé à page server
			submitting = true;

			return async ({ result, update }) => {
				// post submit : après la réception du résultat de page server
				submitting = false;
				if (result.type == 'success') {
					editing = false;

					// force un rechargement de la fonction load du page server
					// grace au point d'ancrage créer avec depends
					invalidate('profile-session');
				} else {
					// gestion des errors
					update({
						// préserver les valeurs du formulaire sinon il sera réinitialiser c'est à dire vider
						reset: false
					});
				}
			};
		}}
	>
		<label for="firstname">Firstname:</label>
		<input
			id="firstname"
			name="firstname"
			type="text"
			disabled={!editing}
			bind:value={user.firstname}
		/>
		<label for="lastname">Lastname:</label>
		<input
			id="lastname"
			name="lastname"
			type="text"
			disabled={!editing}
			bind:value={user.lastname}
		/>
		{#if editing}
			<input type="submit" value={submitting ? 'saving...' : 'save'} disabled={submitting} />
		{/if}
	</form>

	{#if form?.error}
		<span class="error">{form.error.message}</span>
	{/if}
	<span></span>
</main>

<style>
	main {
		margin: auto;
		margin-top: 1rem;
		width: 300px;

		& p {
			margin: 0.3rem 0;
		}
		& h1 {
			margin-bottom: 1rem;
			display: flex;
			justify-content: space-between;
			font-weight: 700;
			align-items: center;
			height: 100px;

			& button {
				border: 1px solid darkred;
				color: darkred;
				box-shadow: 2px 2px black;
				padding: 4px;
			}
		}

		& form {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			gap: 0.3rem;
			& input {
				border: 1px solid black;
				padding: 0 0.2rem;

				&:disabled {
					border-color: white;
				}
				&[type='submit'] {
					width: 100%;
					text-align: center;
					border: 1px solid darkred;
					color: darkred;
					box-shadow: 2px 2px black;
					padding: 4px;

					&:active {
						background-color: lightcoral;
						transform: translate(2px, 2px);
						box-shadow: none;
					}
				}
			}
		}
	}
	.error {
		display: inline-block;
		width: 100%;
		padding: 0.3rem;
		margin-top: 1rem;
		color: red;
		text-align: center;
	}
</style>
