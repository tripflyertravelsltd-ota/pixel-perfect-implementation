import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  Plane,
  UserRound,
  Mail,
  Phone,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
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

export const Route = createFileRoute("/agent/flights/review")({
  validateSearch: searchSchema,
  component: FlightReview,
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

type BookingDetails = {
  passengers: Passenger[];
  contact: {
    email: string;
    phone: string;
  };
  savedAt: string;
};

function FlightReview() {
  const navigate = useNavigate();
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

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("tripflyer_booking_details");

    if (stored) {
      try {
        setBookingDetails(JSON.parse(stored) as BookingDetails);
      } catch {
        setBookingDetails(null);
      }
    }
  }, []);

  const selectedFlight = flights.find((item) => item.code === flight);

  const passengerCount = adults + children;
  const totalFare = selectedFlight ? selectedFlight.price * passengerCount : 0;

  const formatPrice = (amount: number) => `৳${amount.toLocaleString("en-BD")}`;

  if (!bookingDetails) {
    return (
      <>
        <PageHeader
          eyebrow="Booking"
          title="Review & Checkout"
          description="Review your flight and passenger information."
        />

        <Card className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 text-warning" />
            <div>
              <h2 className="font-semibold">Passenger details not found</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Please return to the passenger details page and save your information before
                continuing.
              </p>
            </div>
          </div>
        </Card>
      </>
    );
  }

  if (!selectedFlight) {
    return (
      <>
        <PageHeader
          eyebrow="Booking"
          title="Review & Checkout"
          description="Review your flight and passenger information."
        />
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            The selected flight could not be found. Please search and select a flight again.
          </p>
        </Card>
      </>
    );
  }

  const handleContinue = () => {
    if (!bookingDetails || !selectedFlight) {
      setMessage("Passenger or flight details are missing.");
      return;
    }

    void navigate({
      to: "/agent/flights/confirmation",
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Booking"
        title="Review & Checkout"
        description="Review all flight and passenger details before proceeding."
      />

      {/* Progress */}
      <div className="mb-6 grid grid-cols-5 gap-2">
        {["Search", "Flight Selection", "Passengers", "Review", "Confirmation"].map(
          (step, index) => {
            const completed = index < 3;
            const current = index === 3;

            return (
              <div key={step} className="min-w-0">
                <div
                  className={`mb-2 h-1.5 rounded-full ${
                    completed || current ? "bg-primary" : "bg-muted"
                  }`}
                />
                <p
                  className={`text-center text-[10px] font-medium sm:text-xs ${
                    current
                      ? "text-primary"
                      : completed
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  {index + 1}. {step}
                </p>
              </div>
            );
          },
        )}
      </div>

      {/* Flight summary */}
      <Card className="mb-6 overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-5 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Selected flight
            </p>
            <h2 className="mt-1 text-lg font-bold">{selectedFlight.airline}</h2>
            <p className="text-xs text-muted-foreground">{selectedFlight.code}</p>
          </div>

          <div className="text-right">
            <p className="text-xl font-bold">{formatPrice(selectedFlight.price)}</p>
            <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
              Sample fare
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-5">
          <div>
            <p className="font-display text-2xl font-bold">{from}</p>
            <p className="mt-1 text-sm font-semibold">{selectedFlight.dep}</p>
            {departure && <p className="mt-1 text-xs text-muted-foreground">{departure}</p>}
          </div>

          <div className="flex min-w-0 flex-col items-center gap-1">
            <span className="text-xs text-muted-foreground">{selectedFlight.dur}</span>
            <div className="flex w-full items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <Plane className="size-4 shrink-0 text-primary" />
              <div className="h-px flex-1 bg-border" />
            </div>
            <span className="text-xs text-muted-foreground">Sample itinerary</span>
          </div>

          <div className="text-right">
            <p className="font-display text-2xl font-bold">{to}</p>
            <p className="mt-1 text-sm font-semibold">{selectedFlight.arr}</p>
            {tripType === "round-trip" && returnDate && (
              <p className="mt-1 text-xs text-muted-foreground">Return: {returnDate}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border px-5 py-4 text-xs text-muted-foreground">
          <span>{tripType === "round-trip" ? "Round trip" : "One way"}</span>
          <span>{passengerCount} passenger(s)</span>
          <span>{cabin}</span>
          <span>{selectedFlight.bag} baggage</span>
          <span>{selectedFlight.refundable ? "Refundable" : "Non-refundable"}</span>
        </div>
      </Card>

      {/* Passenger details */}
      <Card className="mb-6 p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5">
            <UserRound className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Passenger details</h2>
            <p className="text-xs text-muted-foreground">
              {bookingDetails.passengers.length} passenger(s)
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {bookingDetails.passengers.map((passenger, index) => (
            <div key={`${passenger.type}-${index}`} className="rounded-xl border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">
                  {passenger.type === "adult" ? "Adult" : "Child"}{" "}
                  {
                    bookingDetails.passengers
                      .slice(0, index + 1)
                      .filter((item) => item.type === passenger.type).length
                  }
                </h3>
                <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {passenger.type}
                </span>
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Full name</p>
                  <p className="font-medium">
                    {passenger.title} {passenger.firstName} {passenger.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date of birth</p>
                  <p className="font-medium">{passenger.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Nationality</p>
                  <p className="font-medium">{passenger.nationality}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Passport number</p>
                  <p className="font-medium">{passenger.passportNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Passport expiry</p>
                  <p className="font-medium">{passenger.passportExpiry}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Contact information */}
      <Card className="mb-6 p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5">
            <Mail className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Booking contact</h2>
            <p className="text-xs text-muted-foreground">Contact details for booking updates</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-4">
            <Mail className="size-4 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="break-all text-sm font-medium">{bookingDetails.contact.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-4">
            <Phone className="size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">{bookingDetails.contact.phone}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Fare breakdown */}
      <Card className="mb-6 p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5">
            <FileText className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">Fare breakdown</h2>
            <p className="text-xs text-muted-foreground">Indicative sample pricing only</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Sample fare per passenger</span>
            <span className="font-medium">{formatPrice(selectedFlight.price)}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Passengers ({passengerCount})</span>
            <span className="font-medium">× {passengerCount}</span>
          </div>

          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold">Estimated total</span>
              <span className="font-display text-2xl font-bold text-primary">
                {formatPrice(totalFare)}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          This is a demonstration calculation using the same sample rate for each passenger. Actual
          adult and child fares, taxes and fees will come from the supplier API when integrated.
        </p>
      </Card>

      {/* Booking notice */}
      <div className="mb-6 flex gap-3 rounded-xl border border-border bg-muted/30 p-4">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-semibold">Review before booking</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Please verify all passenger names and passport information. Incorrect details may cause
            problems during ticket issuance.
          </p>
        </div>
      </div>

      {message && (
        <div className="mb-5 flex gap-3 rounded-xl bg-warning/10 p-4 text-sm">
          <AlertCircle className="size-5 shrink-0 text-warning" />
          <p>{message}</p>
        </div>
      )}

      <div className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-xs text-muted-foreground">
          No booking or wallet charge will occur at this stage.
        </p>

        <button
          type="button"
          onClick={handleContinue}
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-dark"
        >
          Continue to Booking
          <CheckCircle2 className="size-4" />
        </button>
      </div>
    </>
  );
}
