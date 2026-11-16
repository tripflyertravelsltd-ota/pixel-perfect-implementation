
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PanelShell } from "@/components/panel";

export const Route = createFileRoute("/agent/flights")({
  head: () => ({
    meta: [
      { title: "Flights — TripFlyer Agent" },
      {
        name: "description",
        content: "Search flights and manage agent bookings on TripFlyer.",
      },
    ],
  }),
  component: () => (
    <PanelShell area="agent">
      <Outlet />
    </PanelShell>
  ),
});
