import { Flex, Avatar, AvatarProps } from "@radix-ui/themes";

export interface ProfileButtonProps {
	src?: string,
	fallback: NonNullable<AvatarProps['fallback']>
}

export default function ProfileButton({src, fallback}:ProfileButtonProps) {

	return (
		<Flex >
			<Avatar
				src={src}
				fallback={fallback}
				radius="full"
			/>
		</Flex>

	)
}