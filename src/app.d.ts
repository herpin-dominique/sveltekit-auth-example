// src/app.d.ts
/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			username: string;
			last_name?: string | null;
			first_name?: string | null;
		};
		type DatabaseSessionAttributes = {};
	}
	namespace App {
		// interface Error {}
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
		// interface PageData {}
		// interface Platform {}
	}
}
// THIS IS IMPORTANT!!!
export {};
