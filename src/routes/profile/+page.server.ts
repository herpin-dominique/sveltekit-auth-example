import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/lucia';

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends('profile-session');
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/email/login');
	return {
		user: session.user
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		// verifie qu'il s'agit d'une requête provenant d'une personne authentifié
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/email/login');

		// récupère les data du formulaire
		const formData = await request.formData();
		const firstname = formData.get('firstname')?.toString();
		const lastname = formData.get('lastname')?.toString();

		try {
			// mis à jour des attributs de l'utilisateur
			await auth.updateUserAttributes(session.user.userId, {
				first_name: firstname,
				last_name: lastname
			});

			// invalidate la session afin qu'il soit rechargé avec les nouvelles attributs
			// lors de la prochaine appel à locals.auth.validate()
			locals.auth.invalidate();
		} catch (e) {
			// erreur générale
			console.error((e as { message: string }).message);
			return fail(500, {
				success: false,
				error: {
					message: 'Internal errrors'
				}
			});
		}

		return {
			success: true
		};
	}
};
