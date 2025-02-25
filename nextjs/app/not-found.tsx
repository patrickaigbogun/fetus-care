'use client';

import { baseDashboardUrl, baseUrl } from "@/constants/consts";
import { House, WarningCircle } from "@phosphor-icons/react";
import { Heading, Text, Container, Flex, Button, Strong, IconButton } from "@radix-ui/themes";
import Link from 'next/link';

export default function NotFound() {
	return (
		<Container className="100vh py-5">
			<Flex direction="column" align="center" justify="center" gap="6" className="h-full">
				<IconButton color="red" variant="ghost">
					<WarningCircle size={96} weight="duotone" />
				</IconButton>
				<Heading size="8" className="text-center">Not Found</Heading>
				<Text size="5" className="text-gray-500 text-center mb-6">
					Oops! The page you&apos;re looking for doesn&apos;t exist.
				</Text>
				<Link href={`${baseDashboardUrl}`}><Button size={'3'} variant="classic">
					<House weight="bold" size={24} /><Strong >Return Home</Strong>
				</Button>
				</Link>
			</Flex>
		</Container>
	);
}