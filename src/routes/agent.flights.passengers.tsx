import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Plane, UserRound, FileText, Mail, Phone, CheckCircle2, CalendarDays } from "lucide-react";
import { PageHeader, Card } from "@/components/panel";

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

export const Route = createFileRoute("/agent/flights/passengers")({
  validateSearch: searchSchema,
  component: PassengerDetails,
});

type Passenger = {
  type: "adult" | "child";
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
};

const createPassenger = (type: "adult" | "child"): Passenger => ({
  type,
  title: type === "adult" ? "Mr" : "Master",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  nationality: "Bangladeshi",
  passportNumber: "",
  passportExpiry: "",
});

const flights = [
  {
    airline: "Biman Bangladesh",
    code: "BG 347",
    dep: "08:15",
    arr: "11:40",
    dur: "7h 25m",
    bag: "35 kg",
    price: 42500,
    refundable: true,
  },
  {
    airline: "US-Bangla Airlines",
    code: "BS 341",
    dep: "19:30",
    arr: "22:50",
    dur: "7h 20m",
    bag: "30 kg",
    price: 39800,
    refundable: false,
  },
  {
    airline: "Emirates",
    code: "EK 583",
    dep: "10:05",
    arr: "13:25",
    dur: "7h 20m",
    bag: "30 kg",
    price: 51200,
    refundable: true,
  },
  {
    airline: "flydubai",
    code: "FZ 502",
    dep: "23:55",
    arr: "03:10",
    dur: "7h 15m",
    bag: "20 kg",
    price: 36900,
    refundable: false,
  },
  {
    airline: "Air Arabia",
    code: "G9 518",
    dep: "04:20",
    arr: "11:05",
    dur: "10h 45m",
    bag: "20 kg",
    price: 33400,
    refundable: false,
  },
];

function PassengerDetails() {
  const navigate = useNavigate();
  const {
    from = "DAC",
    to = "DXB",
    flight: flightCode = "",
    tripType = "round-trip",
    departure = "",
    returnDate = "",
    adults = 1,
    children = 0,
    cabin = "Economy",
  } = Route.useSearch();

  const selectedFlight = flights.find((item) => item.code === flightCode);

  const [passengers, setPassengers] = useState<Passenger[]>(() => [
    ...Array.from({ length: adults }, () => createPassenger("adult")),
    ...Array.from({ length: children }, () => createPassenger("child")),
  ]);

  const [contact, setContact] = useState({
    email: "",
    phone: "",
  });

  const [message, setMessage] = useState("");

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    setPassengers((current) =>
      current.map((passenger, passengerIndex) =>
        passengerIndex === index ? { ...passenger, [field]: value } : passenger,
      ),
    );
    setMessage("");
  };

  const updateContact = (field: "email" | "phone", value: string) => {
    setContact((current) => ({
      ...current,
      [field]: value,
    }));
    setMessage("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (!selectedFlight) {
    setMessage("Please select a flight before continuing.");
    return;
  }

  const bookingDetails = {
    passengers,
    contact,
    savedAt: new Date().toISOString(),
  };

  sessionStorage.setItem(
    "tripflyer_booking_details",
    JSON.stringify(bookingDetails),
  );

  void navigate({
    to: "/agent/flights/review",
    search: {
      from,
      to,
      flight: selectedFlight.code,
      tripType,
      departure,
      returnDate,
      adults,
      children,
      cabin,
    },
  });
};

  if (!selectedFlight) {
    return (
      <>
        <PageHeader
          eyebrow="Booking"
          title="Passenger details"
          description="The selected flight could not be found."
        />
        <Card>
          <p className="text-sm text-muted-foreground">
            Please return to flight results and select a flight again.
          </p>
        </Card>
      </>
    );
  }

  const renderPassengerForm = (passenger: Passenger, index: number, passengerNumber: number) => {
    const isAdult = passenger.type === "adult";

    return (
      <div
        key={`${passenger.type}-${passengerNumber}`}
        className="overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-primary/30"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/30 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-sand-soft text-primary">
              <UserRound className="size-5" />
            </div>

            <div>
              <h3 className="font-display text-base font-semibold">
                {isAdult ? "Adult" : "Child"} passenger {passengerNumber}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">Passenger information</p>
            </div>
          </div>

          <span className="rounded-full bg-sand-soft px-3 py-1 text-xs font-semibold text-foreground">
            {isAdult ? "Adult" : "Child"}
          </span>
        </div>

        <div className="space-y-6 p-5">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <UserRound className="size-4 text-primary" />
              <h4 className="text-sm font-semibold">Personal information</h4>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className="block text-sm">
                <span className="mb-2 block font-medium">
                  Title <span className="text-destructive">*</span>
                </span>
                <select
                  required
                  value={passenger.title}
                  onChange={(e) => updatePassenger(index, "title", e.target.value)}
                  className="field h-12 w-full"
                >
                  {isAdult ? (
                    <>
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Ms">Ms</option>
                      <option value="Miss">Miss</option>
                    </>
                  ) : (
                    <>
                      <option value="Master">Master</option>
                      <option value="Miss">Miss</option>
                    </>
                  )}
                </select>
              </label>

              <label className="block text-sm">
                <span className="mb-2 block font-medium">
                  First name <span className="text-destructive">*</span>
                </span>
                <input
                  required
                  value={passenger.firstName}
                  onChange={(e) => updatePassenger(index, "firstName", e.target.value)}
                  placeholder="Enter first name"
                  className="field h-12 w-full"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-2 block font-medium">
                  Last name <span className="text-destructive">*</span>
                </span>
                <input
                  required
                  value={passenger.lastName}
                  onChange={(e) => updatePassenger(index, "lastName", e.target.value)}
                  placeholder="Enter last name"
                  className="field h-12 w-full"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-2 block font-medium">
                  Date of birth <span className="text-destructive">*</span>
                </span>
                <div className="relative">
                  <input
                    required
                    type="date"
                    value={passenger.dateOfBirth}
                    onChange={(e) => updatePassenger(index, "dateOfBirth", e.target.value)}
                    className="field h-12 w-full"
                  />
                </div>
              </label>

              <label className="block text-sm">
                <span className="mb-2 block font-medium">
                  Nationality <span className="text-destructive">*</span>
                </span>
                <input
                  required
                  value={passenger.nationality}
                  onChange={(e) => updatePassenger(index, "nationality", e.target.value)}
                  placeholder="Enter nationality"
                  className="field h-12 w-full"
                />
              </label>
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              <h4 className="text-sm font-semibold">Passport information</h4>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-2 block font-medium">
                  Passport number <span className="text-destructive">*</span>
                </span>
                <input
                  required
                  value={passenger.passportNumber}
                  onChange={(e) => updatePassenger(index, "passportNumber", e.target.value)}
                  placeholder="Enter passport number"
                  className="field h-12 w-full"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-2 block font-medium">
                  Passport expiry date <span className="text-destructive">*</span>
                </span>
                <input
                  required
                  type="date"
                  value={passenger.passportExpiry}
                  onChange={(e) => updatePassenger(index, "passportExpiry", e.target.value)}
                  className="field h-12 w-full"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <PageHeader
        eyebrow="Booking · Step 3 of 5"
        title="Passenger details"
        description="Add traveller information exactly as shown on their travel documents."
      />

      {/* Booking progress */}
      <div className="mb-6 rounded-2xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold">Booking progress</span>
          <span className="text-xs font-medium text-primary">Step 3 of 5</span>
        </div>

        <div className="flex gap-1.5">
          {["Search", "Flight", "Passengers", "Review", "Confirm"].map((step, index) => (
            <div key={step} className="min-w-0 flex-1">
              <div className={`h-1.5 rounded-full ${index < 3 ? "bg-primary" : "bg-muted"}`} />
              <p
                className={`mt-2 truncate text-[10px] sm:text-xs ${
                  index === 2 ? "font-semibold text-foreground" : "text-muted-foreground"
                }`}
              >
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Selected flight */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-5 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Selected flight
            </p>
            <h2 className="mt-1 font-display text-lg font-bold">{selectedFlight.airline}</h2>
            <p className="text-xs text-muted-foreground">{selectedFlight.code}</p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="font-display text-xl font-bold text-foreground">
              ৳{selectedFlight.price.toLocaleString("en-BD")}
            </span>
            <span className="rounded-full bg-warning/10 px-3 py-1.5 text-xs font-semibold text-warning">
              Sample fare
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-5">
          <div>
            <p className="font-display text-2xl font-bold">{from}</p>
            <p className="mt-1 text-sm font-semibold">{selectedFlight.dep}</p>
          </div>

          <div className="flex min-w-0 flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">{selectedFlight.dur}</span>
            <div className="flex w-full items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <Plane className="size-4 shrink-0 text-primary" />
              <div className="h-px flex-1 bg-border" />
            </div>
            <span className="text-xs text-success">Non-stop / direct*</span>
          </div>

          <div className="text-right">
            <p className="font-display text-2xl font-bold">{to}</p>
            <p className="mt-1 text-sm font-semibold">{selectedFlight.arr}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border px-5 py-4 text-xs text-muted-foreground">
          <span>{tripType === "round-trip" ? "Round trip" : "One way"}</span>
          {departure && <span>Departure: {departure}</span>}
          {tripType === "round-trip" && returnDate && <span>Return: {returnDate}</span>}
          <span>{adults} adult(s)</span>
          <span>{children} child(ren)</span>
          <span>{cabin}</span>
          <span>{selectedFlight.bag} baggage</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Adult passengers */}
        {adults > 0 && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="font-display text-xl font-bold">Adult travellers</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter details for each adult passenger.
                </p>
              </div>
              <span className="rounded-full bg-sand-soft px-3 py-1.5 text-xs font-semibold">
                {adults} passenger(s)
              </span>
            </div>

            {Array.from({ length: adults }, (_, index) => {
              const passenger = passengers[index];

              return passenger ? renderPassengerForm(passenger, index, index + 1) : null;
            })}
          </section>
        )}

        {/* Child passengers */}
        {children > 0 && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="font-display text-xl font-bold">Child travellers</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter details for each child passenger.
                </p>
              </div>
              <span className="rounded-full bg-sand-soft px-3 py-1.5 text-xs font-semibold">
                {children} passenger(s)
              </span>
            </div>

            {Array.from({ length: children }, (_, index) => {
              const passengerIndex = adults + index;
              const passenger = passengers[passengerIndex];

              return passenger ? renderPassengerForm(passenger, passengerIndex, index + 1) : null;
            })}
          </section>
        )}

        {/* Booking contact */}
        <section className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="border-b border-border bg-muted/30 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-sand-soft text-primary">
                <Mail className="size-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold">Booking contact</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Contact details for booking updates and communication.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-2 flex items-center gap-2 font-medium">
                <Mail className="size-4 text-muted-foreground" />
                Contact email <span className="text-destructive">*</span>
              </span>
              <input
                required
                type="email"
                value={contact.email}
                onChange={(e) => updateContact("email", e.target.value)}
                placeholder="traveller@example.com"
                className="field h-12 w-full"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-2 flex items-center gap-2 font-medium">
                <Phone className="size-4 text-muted-foreground" />
                Contact phone <span className="text-destructive">*</span>
              </span>
              <input
                required
                type="tel"
                value={contact.phone}
                onChange={(e) => updateContact("phone", e.target.value)}
                placeholder="+8801XXXXXXXXX"
                className="field h-12 w-full"
              />
            </label>
          </div>
        </section>

        {/* Submit */}
        {message && (
          <div className="flex items-start gap-3 rounded-xl border border-success/30 bg-success/5 p-4 text-sm">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
            <p>{message}</p>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{adults + children} passenger(s) in total</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Check all passenger information before continuing.
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground">Sample fare per passenger</p>
              <p className="font-display text-lg font-bold">
                ৳ {selectedFlight.price.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-dark sm:w-auto sm:min-w-56"
          >
            Continue to Review
            <CheckCircle2 className="size-4" />
          </button>
        </div>
      </form>

      <div className="mt-5 rounded-xl bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
        Development mode: passenger and contact information is currently held in page state. It is
        not yet saved to the backend or submitted to an airline supplier.
      </div>
    </>
  );
}
