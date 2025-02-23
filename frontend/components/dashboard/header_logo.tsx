import { Strong, Text } from "@radix-ui/themes"



function HeaderTitle({children}:{children:React.ReactNode}) {
	return (
		<Text as="p" size={'6'} ><Strong>{children}</Strong></Text>
	)
}

export default HeaderTitle