"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flex, Text } from "@once-ui-system/core";

const TABS = [
  { href: "/dashboard", label: "Outreach" },
  { href: "/dashboard/analytics", label: "Site analytics" },
] as const;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Flex direction="column" gap="24" fillWidth maxWidth="l">
      <Flex gap="16" wrap>
        {TABS.map((tab) => {
          const active =
            tab.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(tab.href);
          return (
            <Link key={tab.href} href={tab.href}>
              <Text
                variant={active ? "label-strong-s" : "label-default-s"}
                onBackground={active ? "brand-strong" : "neutral-weak"}
              >
                {tab.label}
              </Text>
            </Link>
          );
        })}
      </Flex>
      {children}
    </Flex>
  );
}
