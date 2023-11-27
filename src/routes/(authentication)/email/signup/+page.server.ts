import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';

type VercelPostgresError = {
	code: string;
	detail: string;
	schema?: string;
	table?: string;
	column?: string;
	dataType?: string;
	constraint?: 'auth_user_username_key';
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();

		const username = formData.get('username');
		const password = formData.get('password');
		console.log({ username, password });
		// basic check
		if (typeof username !== 'string' || username.length < 4 || username.length > 31) {
			return fail(400, {
				message: 'Invalid username'
			});
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}
		try {
			const user = await auth.createUser({
				key: {
					providerId: 'username', // auth method
					providerUserId: username.toLowerCase(), // unique id when using "username" auth method
					password // hashed by Lucia
				},
				attributes: {
					username
				}
			});
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			locals.auth.setSession(session); // set session cookie
		} catch (e) {
			const maybeVercelPostgresError = (
				typeof e === 'object' ? e : {}
			) as Partial<VercelPostgresError>;

			console.dir(maybeVercelPostgresError, { depth: null });

			// // this part depends on the database you're using
			// // check for unique constraint error in user table
			// if (
			//     e instanceof SomeDatabaseError &&
			//     e.message === USER_TABLE_UNIQUE_CONSTRAINT_ERROR
			// ) {
			//     return fail(400, {
			//         message: "Username already taken"
			//     });
			// }
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
		// redirect to
		// make sure you don't throw inside a try/catch block!
		console.log(`created user: ${username}`);
		throw redirect(302, '/');
	}
};
