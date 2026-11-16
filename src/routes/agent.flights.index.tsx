
import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import {
  PageHeader,
  PendingIntegration,
  Skeleton,
} from "@/components/panel";
import { FlightSearch } from "@/components/flight-search";
import { useAgent } from "@/components/agent-data";
import { verificationStatus } from "@/lib/mock/agents";

export const Route = createFileRoute("/agent/flights/")({
  component: AgentFlightsSearch,
});

function AgentFlightsSearch() {
  const { agent, session } = useAgent();

  if (!agent) return <Skeleton />;

  const verified = verificationStatus(agent) === "approved";
  const walletLinked = !!session?.backendAgentId;

  return (
    <>
      <PageHeader
        eyebrow="Booking"
        title="Flights"
        description="Search flight options for your travellers."
      />

      <FlightSearch />

      {(!verified || !walletLinked) && (
        <div className="mt-5 flex gap-3 rounded-[20px] bg-sand-soft p-4 text-sm">
          <Lock className="mt-0.5 size-4 shrink-0" />
          <div>
            <div className="font-medium">Booking requirements</div>
            <ul className="mt-1 list-disc pl-5 text-muted-foreground">
              {!verified && (
                <li>
                  Your business verification must be approved before you can
                  book on behalf of travellers.
                </li>
              )}
              {!walletLinked && (
                <li>
                  A funded wallet linked to your agent account is required to
                  pay for bookings.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      <div className="mt-6">
        <PendingIntegration title="Agent booking & ticketing">
          Supplier search, booking and ticket-issuance APIs are not connected
          yet. Search results currently use sample data.
        </PendingIntegration>
      </div>
    </>
  );
}
