export const CUSTOMER_FAQ = [
  {
    q: "How do TripWayz packages differ from a personal plan?",
    a: "Packages are curated destinations with set imagery, pricing, and optional add-ons. Personal planning lets you describe any route or dream trip—our team reviews your brief and follows up with tailored options.",
  },
  {
    q: "How are trip estimates calculated?",
    a: "Estimates use nights, number of adults and children, travel style (budget, comfort, luxury), and any add-ons you select. Final quotes may vary with availability and seasonality.",
  },
  {
    q: "Can I change dates after booking a package?",
    a: "Yes. Open My Trips, expand Edit booking, adjust dates and travelers, and save. Totals refresh automatically; major changes may affect availability.",
  },
  {
    q: "What happens after I submit a personal trip request?",
    a: "Your request is logged as submitted. We recommend monitoring your email for next steps. Admins can mark requests as reviewed when planning moves forward.",
  },
  {
    q: "How do shared itineraries work?",
    a: "From a confirmed trip, generate a public link. Anyone with the link sees a read-only overview—great for family and friends. Links stay valid until you remove sharing.",
  },
  {
    q: "Which payment methods are supported?",
    a: "This demo focuses on planning and quotes. Production deployments typically integrate Stripe or similar—check with your administrator before paying.",
  },
  {
    q: "Can children travel on the same itinerary?",
    a: "Yes. Enter child counts when booking or requesting a personal plan. Pricing models treat children at a reduced traveler unit where applicable.",
  },
  {
    q: "How do I update my profile or avatar?",
    a: "Visit Profile, edit your details, and upload an image to the avatars bucket (requires Supabase Storage configured). Changes save instantly after upload.",
  },
  {
    q: "Who sees new packages the admin adds?",
    a: "Every signed-in customer sees admin-created destinations on the Explore dashboard alongside existing listings—no extra sync step required.",
  },
  {
    q: "How do I cancel a booking?",
    a: "Open My Trips, select the trip, and use Cancel booking. Cancelled trips appear under Past & cancelled and cannot be edited.",
  },
] as const;
