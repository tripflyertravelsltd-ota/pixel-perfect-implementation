import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeftRight, CalendarDays, Plane, Users } from "lucide-react";
import { Card } from "@/components/panel";

type TripType = "round-trip" | "one-way";

export function FlightSearch() {
  const navigate = useNavigate();

  const [tripType, setTripType] = useState<TripType>("round-trip");
  const [from, setFrom] = useState("DAC");
  const [to, setTo] = useState("DXB");
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [cabin, setCabin] = useState("Economy");
  const [error, setError] = useState("");

  const swapAirports = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = () => {
    setError("");

    if (!from.trim() || !to.trim()) {
      setError("Please enter both origin and destination airports.");
      return;
    }

    if (from.trim().toUpperCase() === to.trim().toUpperCase()) {
      setError("Origin and destination cannot be the same.");
      return;
    }

    if (!departure) {
      setError("Please select a departure date.");
      return;
    }

    if (tripType === "round-trip" && !returnDate) {
      setError("Please select a return date.");
      return;
    }

    if (returnDate && tripType === "round-trip" && returnDate < departure) {
      setError("Return date cannot be before departure date.");
      return;
    }

    void navigate({
      to: "/agent/flights/results",
      search: {
        from: from.trim().toUpperCase(),
        to: to.trim().toUpperCase(),
        tripType,
        departure,
        returnDate: tripType === "round-trip" ? returnDate : undefined,
        adults,
        children,
        cabin,
      },
    });
  };

  return (
    <Card className="overflow-visible p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Find your journey</span>
          <h2 className="mt-1 font-display text-xl font-bold">Search flights</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Compare flight options for your travellers.
          </p>
        </div>

        <div className="flex rounded-xl bg-muted p-1">
          <button
            type="button"
            onClick={() => setTripType("round-trip")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tripType === "round-trip"
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Round Trip
          </button>
          <button
            type="button"
            onClick={() => setTripType("one-way")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tripType === "one-way"
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            One Way
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_48px_1fr_1fr_1fr]">
        <div className="relative rounded-xl border border-input p-3">
          <label className="text-xs font-medium text-muted-foreground">FROM</label>
          <div className="mt-1 flex items-center gap-2">
            <Plane className="size-4 shrink-0 text-primary" />
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Airport code"
              maxLength={3}
              className="w-full bg-transparent font-display text-lg font-semibold uppercase outline-none"
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Origin airport code</p>
        </div>

        <button
          type="button"
          onClick={swapAirports}
          aria-label="Swap origin and destination"
          className="grid size-12 place-self-center rounded-full border border-border bg-surface text-muted-foreground transition hover:border-primary hover:text-primary"
        >
          <ArrowLeftRight className="m-auto size-4" />
        </button>

        <div className="rounded-xl border border-input p-3">
          <label className="text-xs font-medium text-muted-foreground">TO</label>
          <div className="mt-1 flex items-center gap-2">
            <Plane className="size-4 shrink-0 rotate-90 text-primary" />
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Airport code"
              maxLength={3}
              className="w-full bg-transparent font-display text-lg font-semibold uppercase outline-none"
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Destination airport code</p>
        </div>

        <div className="rounded-xl border border-input p-3">
          <label className="text-xs font-medium text-muted-foreground">DEPARTURE</label>
          <div className="mt-2 flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-primary" />
            <input
              type="date"
              value={departure}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDeparture(e.target.value)}
              className="w-full min-w-0 bg-transparent text-sm outline-none"
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Travel date</p>
        </div>

        {tripType === "round-trip" ? (
          <div className="rounded-xl border border-input p-3">
            <label className="text-xs font-medium text-muted-foreground">RETURN</label>
            <div className="mt-2 flex items-center gap-2">
              <CalendarDays className="size-4 shrink-0 text-primary" />
              <input
                type="date"
                value={returnDate}
                min={departure || new Date().toISOString().slice(0, 10)}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full min-w-0 bg-transparent text-sm outline-none"
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Return date</p>
          </div>
        ) : (
          <div className="flex items-center rounded-xl border border-dashed border-border p-3 text-sm text-muted-foreground">
            One-way journey
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-input p-3">
          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Users className="size-4" />
            PASSENGERS
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              Adults
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="rounded-lg border border-input bg-background px-2 py-1"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              Children
              <select
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="rounded-lg border border-input bg-background px-2 py-1"
              >
                {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-input p-3">
          <label className="text-xs font-medium text-muted-foreground">CABIN CLASS</label>
          <select
            value={cabin}
            onChange={(e) => setCabin(e.target.value)}
            className="mt-2 w-full bg-transparent text-sm font-medium outline-none"
          >
            <option>Economy</option>
            <option>Premium Economy</option>
            <option>Business</option>
            <option>First Class</option>
          </select>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-error">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Search results currently use sample flight data.
        </p>
        <button
          type="button"
          onClick={handleSearch}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-dark"
        >
          <Plane className="size-4" />
          Search Flights
        </button>
      </div>
    </Card>
  );
}
