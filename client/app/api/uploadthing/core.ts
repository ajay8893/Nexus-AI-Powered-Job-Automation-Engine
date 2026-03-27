import { authClient } from '@/lib/auth-client';
import { createUploadthing, FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
	resumeUploader: f({
		pdf: { maxFileSize: '4MB', maxFileCount: 1 },
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
			await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/upload`, {
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

			return { uploadedBy: metadata.userId };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
