import { Box, Grid, Heading, Section, Text } from "@radix-ui/themes";

function FeatureGrid() {
  return (
    <Box
      className="bg-gradient-to-r from-[#3D113E] to-[#772E79] rounded-2xl text-whites "
      p={"4"}
    >
      <Grid
        columns={"3"}
        rows={"1"}
        gap={"3"}
        className="divide-x-2 divide-gray-300"
      >
        <Section className="text-white text-center flex flex-col space-y-5 ">
          <Heading>
            Seamless Access to <br /> Healthcare Professionals{" "}
          </Heading>
          <Text>
            Doctors and midwives can set <br /> availability, and users can book
            via the app.
          </Text>
        </Section>
        <Section className="text-white text-center flex flex-col space-y-5">
          <Heading>
            Emergency <br /> Alert System
          </Heading>
          <Text>
            Auto-generates SOS messages <br /> to designated contacts and <br />{" "}
            healthcare providers.
          </Text>
        </Section>
        <Section className="text-white text-center flex flex-col space-y-5">
          <Heading>
            24/7 AI Chatbot <br /> for Maternal Queries{" "}
          </Heading>
          <Text>
            Answers pregnancy-related <br /> questions and provides emergency
            guidance.
          </Text>
        </Section>
      </Grid>
    </Box>
  );
}

export default FeatureGrid;
