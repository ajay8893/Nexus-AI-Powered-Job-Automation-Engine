import type { Request, Response } from 'express';
import { getAuthInstance } from '../lib/authInstance.js';
import {
	SignInSchema,
	SignUpSchema,
	type SignInInput,
	type SignUpInput,
} from '../schema/auth.schema.js';

export const signUpController = async (req: Request, res: Response) => {
	try {
		const validatedData: SignUpInput = SignUpSchema.parse(req.body);

		const auth = getAuthInstance();

		const user = await auth.api.signUpEmail({
			body: {
				email: validatedData.email,
				password: validatedData.password,
				name: validatedData.name,
			},
		});

		return res.status(201).json({ message: 'User created successfully', user });
	} catch (error: any) {
		return res.status(400).json({ error: error.message || 'Signup failed' });
	}
};

export const signInController = async (req: Request, res: Response) => {
	try {
		const validatedData: SignInInput = SignInSchema.parse(req.body);

		const auth = getAuthInstance();

		const user = await auth.api.signInEmail({
			body: {
				email: validatedData.email,
				password: validatedData.password,
			},
		});

		return res
			.status(200)
			.json({ message: 'User signed in successfully', user });
	} catch (error: any) {
		return res.status(400).json({ error: error.message || 'Signin failed' });
	}
};
