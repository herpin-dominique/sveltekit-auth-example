export async function load({ locals, depends }) {
	const session = await locals.auth.validate();

	return {
		session
	};
}
