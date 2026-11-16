import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Check, ArrowRight } from "lucide-react";
import { PageHeader, PendingIntegration } from "@/components/panel";

const searchSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  flight: z.string().optional(),
  tripType: z.enum(["round-trip", "one-way"]).optional(),
  departure: z.string().optional(),
  returnDate: z.string().optional(),
  adults: z.coerce.number().int().min(1).optional(),
  children: z.coerce.number().int().min(0).optional(),
  cabin: z.string().optional(),
});

export const Route = createFileRoute("/agent/flights/results")({
  validateSearch: searchSchema,
  component: AgentFlightResults,
});

const base = [
  {
    airline: "Biman Bangladesh",
    code: "BG 347",
    dep: "08:15",
    arr: "11:40",
    dur: 445,
    stops: 0,
    bag: "35 kg",
    price: 42500,
    refundable: true,
  },
  {
    airline: "US-Bangla Airlines",
    code: "BS 341",
    dep: "19:30",
    arr: "22:50",
    dur: 440,
    stops: 0,
    bag: "30 kg",
    price: 39800,
    refundable: false,
  },
  {
    airline: "Emirates",
    code: "EK 583",
    dep: "10:05",
    arr: "13:25",
    dur: 440,
    stops: 0,
    bag: "30 kg",
    price: 51200,
    refundable: true,
  },
  {
    airline: "flydubai",
    code: "FZ 502",
    dep: "23:55",
    arr: "03:10",
    dur: 435,
    stops: 0,
    bag: "20 kg",
    price: 36900,
    refundable: false,
  },
  {
    airline: "Air Arabia",
    code: "G9 518",
    dep: "04:20",
    arr: "11:05",
    dur: 645,
    stops: 1,
    bag: "20 kg",
    price: 33400,
    refundable: false,
  },
];

const fmt = (minutes: number) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

function AgentFlightResults() {
  const {
    from = "DAC",
    to = "DXB",
    flight,
    tripType = "round-trip",
    departure = "",
    returnDate = "",
    adults = 1,
    children = 0,
    cabin = "Economy",
  } = Route.useSearch();
  const navigate = useNavigate();

  const [sort, setSort] = useState<"recommended" | "cheapest" | "fastest">("recommended");

  const [nonstop, setNonstop] = useState(false);

  const [selectedFlight, setSelectedFlight] = useState(flight ?? "");

  const list = useMemo(() => {
    let flights = base.filter((item) => !nonstop || item.stops === 0);

    if (sort === "cheapest") {
      flights = [...flights].sort((a, b) => a.price - b.price);
    }

    if (sort === "fastest") {
      flights = [...flights].sort((a, b) => a.dur - b.dur);
    }

    return flights;
  }, [sort, nonstop]);

  const handleNext = () => {
    if (!selectedFlight) return;

    void navigate({
      to: "/agent/flights/passengers",
      search: {
        from,
        to,
        flight: selectedFlight,
        tripType,
        departure,
        returnDate,
        adults,
        children,
        cabin,
      },
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Booking"
        title="Flight results"
        description={`Available options for ${from} to ${to}`}
      />
      {/* Booking progress */}
      <div className="mb-6 grid grid-cols-5 gap-2">
        {[
          "Search",
          "Flight Selection",
          "Passenger Details",
          "Review & Checkout",
          "Booking Confirmation",
        ].map((step, index) => {
          const completed = index < 1;
          const current = index === 1;

          return (
            <div key={step} className="min-w-0">
              <div
                className={`mb-2 h-1.5 rounded-full ${
                  completed || current ? "bg-primary" : "bg-muted"
                }`}
              />
              <p
                className={`text-center text-[10px] font-medium sm:text-xs ${
                  current ? "text-primary" : completed ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {index + 1}. {step}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mb-5 rounded-xl border border-warning/30 bg-sand-soft px-4 py-3 text-sm">
        <span className="font-semibold">Sample results:</span> These fares are for UI development
        only. Live supplier fares and availability are not connected yet.
      </div>

      {/* Search summary */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-display text-2xl font-bold">{list.length} flights found</div>

          <p className="mt-1 text-sm text-muted-foreground">
            {from} → {to}
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={nonstop}
            onChange={(e) => setNonstop(e.target.checked)}
            className="accent-primary"
          />
          Non-stop only
        </label>
      </div>

      {/* Sorting */}
      <div className="mb-4 flex w-fit gap-1 rounded-2xl border border-border bg-surface p-1">
        {(["recommended", "cheapest", "fastest"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSort(option)}
            className={`rounded-xl px-4 py-2 text-sm font-medium capitalize ${
              sort === option ? "bg-foreground text-background" : "text-muted-foreground"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Flight list */}
      <div className="divide-y divide-border overflow-hidden rounded-[24px] border border-border bg-surface">
        {list.map((item) => {
          const isSelected = selectedFlight === item.code;

          return (
            <div
              key={item.code}
              onClick={() => setSelectedFlight(item.code)}
              className={`grid cursor-pointer items-center gap-4 p-5 transition md:grid-cols-[1.3fr_2fr_1fr] ${
                isSelected ? "bg-sand-soft ring-2 ring-inset ring-primary" : "hover:bg-muted/40"
              }`}
            >
              {/* Airline information */}
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-sky-soft font-mono text-xs font-medium">
                  {item.code.slice(0, 2)}
                </div>

                <div>
                  <div className="font-medium">{item.airline}</div>

                  <div className="font-mono text-xs text-muted-foreground">
                    {item.code} · {item.bag} baggage
                  </div>
                </div>
              </div>

              {/* Flight schedule */}
              <div className="flex items-center gap-4">
                <div>
                  <div className="font-display text-xl font-semibold">{item.dep}</div>

                  <div className="font-mono text-xs text-muted-foreground">{from}</div>
                </div>

                <div className="flex-1 text-center">
                  <div className="text-xs text-muted-foreground">{fmt(item.dur)}</div>

                  <div className="my-1 h-px bg-border" />

                  <div className={`text-xs ${item.stops ? "text-warning" : "text-success"}`}>
                    {item.stops ? `${item.stops} stop` : "Non-stop"}
                  </div>
                </div>

                <div>
                  <div className="font-display text-xl font-semibold">{item.arr}</div>

                  <div className="font-mono text-xs text-muted-foreground">{to}</div>
                </div>
              </div>

              {/* Fare and selection */}
              <div className="flex items-center justify-between gap-3 md:justify-end">
                <div className="text-right">
                  <div className="font-display text-lg font-bold">
                    ৳ {item.price.toLocaleString("en-IN")}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {item.refundable ? "Refundable" : "Non-refundable"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFlight(item.code);
                  }}
                  className={`inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium transition ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-surface text-foreground hover:border-primary"
                  }`}
                >
                  {isSelected && <Check className="size-4" />}
                  {isSelected ? "Selected" : "Select"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue to passenger details */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-border bg-surface p-5">
        <div>
          <div className="font-medium">
            {selectedFlight ? `Selected flight: ${selectedFlight}` : "No flight selected"}
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {selectedFlight
              ? "Continue to enter passenger information."
              : "Select a flight to continue your booking."}
          </p>
        </div>

        <button
          type="button"
          disabled={!selectedFlight}
          onClick={handleNext}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next: Passenger Details
          <ArrowRight className="size-4" />
        </button>
      </div>

      <div className="mt-6">
        <PendingIntegration title="Live flight availability">
          These are sample flights. Actual fares, seat availability, fare rules and baggage
          conditions will come from the supplier API.
        </PendingIntegration>
      </div>
    </>
  );
}
