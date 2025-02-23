import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Section,
  Text,
} from "@radix-ui/themes";
import { HeaderMenu } from "@/components/ui/headermenu";
import FeatureGrid from "@/components/ui/featuregrid";

const LandingPage = () => {
  return (
    <Box>
      <Container py={"5"}>
        <nav className="flex flex-row justify-between sticky top-0 z-50 bg-white/60 backdrop-blur-md p-2">
          <img src="/logoandtext.svg" alt="logo" /> <HeaderMenu />
        </nav>

        <Section className="flex flex-col items-center">
          <Heading
            align={"center"}
            size={"9"}
            className="bg-gradient-to-r from-[#380B38] to-[#D86F8C] bg-clip-text text-transparent"
          >
            Smart Pregnancy Care, <br /> Anytime, Anywhere!
          </Heading>

          <img
            src="/heroimage.svg"
            alt="heroimage"
            className="w-fit m-[-25px] object-contain h-auto aspect-auto"
          />

          <FeatureGrid />
        </Section>
      </Container>
    </Box>
  );
};

export default LandingPage;
