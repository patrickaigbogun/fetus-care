"use client";

import { Button, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const HeaderMenu = () => {
  const { isLoggedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

  return (
    <Flex direction="row" gap="4" align={"center"}>
      <Text weight={"bold"}>About</Text>
      <Text weight={"bold"}>Services</Text>
      <Link href={isLoggedIn ? "/dashboard" : "/login"}>
        <Button variant={"solid"}>Get Started</Button>
      </Link>
    </Flex>
  );
};
