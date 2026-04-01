'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from './ui/breadcrumb';

const Breadcrumbs = () => {
	const pathname = usePathname();
	const pathSegments = pathname.split('/').filter((segment) => segment !== '');
	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link className="text-black dark:text-white" href="/">
							Home
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				{pathSegments.map((segment, index) => {
					if (segment === 'home') return null;

					const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
					const isLast = index === pathSegments.length - 1;

					const title = segment.charAt(0).toUpperCase() + segment.slice(1);
					return (
						<React.Fragment key={index}>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage>{title}</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link href={href}>{title}</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default Breadcrumbs;
