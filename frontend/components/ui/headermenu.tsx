import { Button, Flex, Text } from "@radix-ui/themes";


export const HeaderMenu =()=> {
  return (
    <Flex direction="row" gap="4" align={'center'}>
	<Text weight={'bold'}>About</Text>
	<Text weight={'bold'}>Services</Text>
	<Button variant={'solid'}>Get Started </Button>
    </Flex>
  )
}

