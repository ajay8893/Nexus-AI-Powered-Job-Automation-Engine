import { authClient } from '@/lib/auth-client';
import { createUploadthing, FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
	resumeUploader: f({
		pdf: { maxFileSize: '4MB', maxFileCount: 5 },
	})
		.middleware(async ({ req }) => {
			// get the session
			const { data: session } = await authClient.getSession({
				fetchOptions: { headers: req.headers },
			});

			if (!session) {
				throw new Error('Unauthorized');
			}

			return { userId: session.user.id };
		})
		.onUploadComplete(async ({ file, metadata }) => {
			console.log('Upload completed for user:', metadata.userId);
			console.log('File URL: ', file.ufsUrl);

			// save to database
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/upload`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userId: metadata.userId,
						fileName: file.name,
						fileUrl: file.ufsUrl || file.url,
						fileKey: file.key,
					}),
				});

				if (!response.ok) {
					const errorData = await response.text();
					console.error('Failed to save resume to DB:', response.status, errorData);
				} else {
					console.log('Resume saved to DB successfully');
				}
			} catch (error) {
				console.error('Error saving resume to DB:', error);
			}

			return { uploadedBy: metadata.userId };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
