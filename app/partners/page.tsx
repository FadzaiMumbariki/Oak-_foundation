import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import PartnerDirectory from "./PartnerDirectory";
import { fetchPartners } from "@/app/actions/content";
import type { Partner } from "@/lib/types";

export const metadata: Metadata = {
  title: "Partner Directory — OAK Partner Convening 2026",
};

export default async function PartnersPage() {
  const partners: Partner[] = await fetchPartners();

  return (
    <AppShell variant="public">
      <div className="max-w-2xl">
        <h1 className="oak-h1">Partner Directory</h1>
        <p className="text-sm text-gray-500 mt-0.5 mb-5">
          {partners.length > 0
            ? `${partners.length} partner organisations`
            : "8 partner organisations"}
        </p>
        <PartnerDirectory serverPartners={partners} />
      </div>
    </AppShell>
  );
}
