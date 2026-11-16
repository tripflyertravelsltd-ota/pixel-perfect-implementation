
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  Plane,
  UserRound,
  Wallet,
  Ticket,
  ShieldCheck,
} from "lucide-react";
import { PageHeader, Card } from "@/components/panel";

export const Route = createFileRoute("/agent/flights/confirmation")({
  component: BookingConfirmation,
});

function BookingConfirmation() {
  const steps = [
    "Search",
    "Flight Selection",
    "Passenger Details",
    "Review & Checkout",
    "Booking Confirmation",
  ];

  return (
    <>
      <PageHeader
        eyebrow="Booking"
        title="Booking Confirmation"
        description="Check your booking, payment and ticket status."
      />

      {/* Progress */}
      <div className="mb-6 grid grid-cols-5 gap-2">
        {steps.map((step, index) => (
          <div key={step} className="min-w-0">
            <div
              className={`mb-2 h-1.5 rounded-full ${
                index < 5 ? "bg-primary" : "bg-muted"
              }`}
            />
            <p
              className={`text-center text-[10px] font-medium sm:text-xs ${
                index === 4
                  ? "text-primary"
                  : "text-foreground"
              }`}
            >
              {index + 1}. {step}
            </p>
          </div>
        ))}
      </div>

      {/* Booking status */}
      <Card className="mb-6 overflow-hidden p-0">
        <div className="border-b border-border bg-warning/10 p-6 text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-warning/15">
            <AlertCircle className="size-7 text-warning" />
          </div>

          <h2 className="font-display text-xl font-bold">
            Booking not confirmed
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Supplier booking integration is not connected yet.
            No flight booking has been created, no payment has been
            processed and no ticket has been issued.
          </p>

          <span className="mt-4 inline-flex rounded-full bg-warning/15 px-4 py-1.5 text-xs font-semibold text-warning">
            Awaiting supplier integration
          </span>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-muted p-3">
              <Plane className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Booking status</p>
              <p className="text-sm font-semibold">Not created</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-muted p-3">
              <Wallet className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Payment status</p>
              <p className="text-sm font-semibold">Not charged</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-muted p-3">
              <Ticket className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ticket status</p>
              <p className="text-sm font-semibold">Not issued</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Future booking reference */}
      <Card className="mb-6 p-5">
        <h2 className="font-display text-lg font-bold">
          Booking reference
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A booking reference will appear here after the supplier
          successfully creates and confirms a reservation.
        </p>
        <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/30 p-5 text-center">
          <p className="text-xs text-muted-foreground">
            Supplier booking reference
          </p>
          <p className="mt-2 font-mono text-lg font-semibold text-muted-foreground">
            Not available
          </p>
        </div>
      </Card>

      {/* Next steps */}
      <Card className="mb-6 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-3">
            <ShieldCheck className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">
              What happens next?
            </h2>
            <p className="text-xs text-muted-foreground">
              Once supplier integration is complete
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {[
            "Submit the booking request to the flight supplier.",
            "Receive the supplier booking reference and confirmation.",
            "Process payment through the agent wallet.",
            "Issue the ticket and make it available for download.",
          ].map((item, index) => (
            <div key={item} className="flex gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                {index + 1}
              </div>
              <p className="pt-1 text-sm text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </Card>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <UserRound className="size-4" />
        This page is a frontend placeholder, not proof of a completed booking.
      </p>
    </>
  );
}
