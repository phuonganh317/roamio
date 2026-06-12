import { RoamioApp } from "@/components/roamio/roamio-app";
import { getDashboardState } from "@/lib/dashboard";
import { getSessionUserId } from "@/lib/session";

export default async function Page() {
  const dashboard = await getDashboardState(await getSessionUserId());
  return <RoamioApp initialDashboard={dashboard} />;
}
