import type { Metadata } from "next";

import {
  AddressBookList,
  AddressForm,
  DashboardSectionCard,
  DashboardShell,
  ProfileForm,
} from "@/components/dashboard";
import { getSavedAddresses } from "@/lib/queries/addresses";
import { getCurrentDashboardContext } from "@/lib/queries/dashboard";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const [context, addresses] = await Promise.all([
    getCurrentDashboardContext(),
    getSavedAddresses(),
  ]);

  return (
    <DashboardShell
      profile={context.profile}
      title="Profile and address book"
      description="Update account contact details and save reusable pickup or delivery addresses."
    >
      <ProfileForm profile={context.profile} email={context.user?.email} />

      <DashboardSectionCard
        title="Saved addresses"
        description="Addresses saved to your customer account for future booking requests."
      >
        <AddressBookList addresses={addresses} />
      </DashboardSectionCard>

      <AddressForm />
    </DashboardShell>
  );
}
