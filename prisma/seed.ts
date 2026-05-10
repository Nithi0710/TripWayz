import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const destinations = [
  {
    name: "Paris",
    slug: "paris",
    description:
      "Iconic art, café culture, and riverside strolls along the Seine — the City of Light never goes out of style.",
    imageUrl:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
    basePrice: 1899,
    country: "France",
    region: "Île-de-France",
  },
  {
    name: "London",
    slug: "london",
    description:
      "Royal history, West End theatre, and world-class museums in a endlessly walkable capital.",
    imageUrl:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
    basePrice: 2149,
    country: "United Kingdom",
    region: "England",
  },
  {
    name: "Dubai",
    slug: "dubai",
    description:
      "Futuristic skyline, desert adventures, and refined hospitality on the Arabian Gulf.",
    imageUrl:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
    basePrice: 2499,
    country: "UAE",
    region: "Middle East",
  },
  {
    name: "Bali",
    slug: "bali",
    description:
      "Rice terraces, volcanic peaks, and soulful wellness retreats across the Island of the Gods.",
    imageUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
    basePrice: 1599,
    country: "Indonesia",
    region: "Southeast Asia",
  },
  {
    name: "Maldives",
    slug: "maldives",
    description:
      "Overwater villas, turquoise lagoons, and some of the planet’s most pristine reefs.",
    imageUrl:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80",
    basePrice: 3299,
    country: "Maldives",
    region: "Indian Ocean",
  },
  {
    name: "Goa",
    slug: "goa",
    description:
      "Golden beaches, Portuguese heritage, and laid-back coastal living on India’s western shore.",
    imageUrl:
      "https://images.unsplash.com/photo-1583212292454-1fe62296026b?w=1200&q=80",
    basePrice: 899,
    country: "India",
    region: "West India",
  },
  {
    name: "Kashmir",
    slug: "kashmir",
    description:
      "Alpine valleys, serene lakes, and houseboats beneath the Himalayas.",
    imageUrl:
      "https://images.unsplash.com/photo-1566836617400-0a5f0e6b0c0b?w=1200&q=80",
    basePrice: 1199,
    country: "India",
    region: "North India",
  },
  {
    name: "Kerala",
    slug: "kerala",
    description:
      "Backwaters, spice plantations, and Ayurveda in lush tropical calm.",
    imageUrl:
      "https://images.unsplash.com/photo-1602216059366-39914c8adc57?w=1200&q=80",
    basePrice: 1049,
    country: "India",
    region: "South India",
  },
  {
    name: "Switzerland",
    slug: "switzerland",
    description:
      "Alpine railways, crystalline lakes, and chocolate-box villages year-round.",
    imageUrl:
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&q=80",
    basePrice: 2899,
    country: "Switzerland",
    region: "Central Europe",
  },
  {
    name: "Tokyo",
    slug: "tokyo",
    description:
      "Neon districts, serene shrines, and Michelin-level dining in perfect balance.",
    imageUrl:
      "https://images.unsplash.com/photo-1540959733332-eab4deab21af?w=1200&q=80",
    basePrice: 2299,
    country: "Japan",
    region: "Kantō",
  },
  {
    name: "New York",
    slug: "new-york",
    description:
      "Broadway, skyline views, and neighborhoods that feel like worlds of their own.",
    imageUrl:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80",
    basePrice: 2399,
    country: "USA",
    region: "East Coast",
  },
  {
    name: "Santorini",
    slug: "santorini",
    description:
      "Whitewashed cliffs, sunset caldera views, and Aegean breezes.",
    imageUrl:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&q=80",
    basePrice: 2199,
    country: "Greece",
    region: "Cyclades",
  },
  {
    name: "Rome",
    slug: "rome",
    description:
      "Ancient forums, Renaissance art, and trattorias on cobbled lanes.",
    imageUrl:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80",
    basePrice: 1799,
    country: "Italy",
    region: "Lazio",
  },
  {
    name: "Barcelona",
    slug: "barcelona",
    description:
      "Gaudí masterpieces, Mediterranean beaches, and tapas till midnight.",
    imageUrl:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=80",
    basePrice: 1699,
    country: "Spain",
    region: "Catalonia",
  },
  {
    name: "Singapore",
    slug: "singapore",
    description:
      "Gardens by the Bay, hawker flavors, and seamless urban design.",
    imageUrl:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80",
    basePrice: 1999,
    country: "Singapore",
    region: "Southeast Asia",
  },
  {
    name: "Sydney",
    slug: "sydney",
    description:
      "Harbour icons, coastal walks, and a vibrant creative food scene.",
    imageUrl:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80",
    basePrice: 2599,
    country: "Australia",
    region: "New South Wales",
  },
  {
    name: "Iceland",
    slug: "iceland",
    description:
      "Glaciers, geysers, and the northern lights across otherworldly landscapes.",
    imageUrl:
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=1200&q=80",
    basePrice: 2799,
    country: "Iceland",
    region: "Nordic",
  },
  {
    name: "Cape Town",
    slug: "cape-town",
    description:
      "Table Mountain, wine routes, and Atlantic-meets-Indian-Ocean beauty.",
    imageUrl:
      "https://images.unsplash.com/photo-1580060839134-75a16237a86a?w=1200&q=80",
    basePrice: 1899,
    country: "South Africa",
    region: "Western Cape",
  },
  {
    name: "Prague",
    slug: "prague",
    description:
      "Gothic spires, castle vistas, and café culture in the heart of Europe.",
    imageUrl:
      "https://images.unsplash.com/photo-1541849546-2165492e033a?w=1200&q=80",
    basePrice: 1399,
    country: "Czech Republic",
    region: "Bohemia",
  },
  {
    name: "Vienna",
    slug: "vienna",
    description:
      "Imperial palaces, classical music, and coffeehouse tradition refined over centuries.",
    imageUrl:
      "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1200&q=80",
    basePrice: 1649,
    country: "Austria",
    region: "Vienna",
  },
] as const;

/** Unsplash (license: Unsplash License) — stable photo IDs per add-on type */
const addonImageByCategory: Record<string, string> = {
  SIGHTSEEING:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
  ADVENTURE:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  FOOD_TOUR:
    "https://images.unsplash.com/photo-1504674902800-87df9d65d134?w=800&q=80",
  CULTURAL:
    "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&q=80",
  TRANSFER:
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
  PHOTOGRAPHY:
    "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80",
};

const addonTemplates: {
  category: string;
  suffix: string;
  duration: string;
  price: number;
  imageSeed: string;
}[] = [
  {
    category: "SIGHTSEEING",
    suffix: "Heritage & Icons Tour",
    duration: "4 hours",
    price: 89,
    imageSeed: "sightseeing",
  },
  {
    category: "ADVENTURE",
    suffix: "Outdoor Adventure Pass",
    duration: "5 hours",
    price: 129,
    imageSeed: "adventure",
  },
  {
    category: "FOOD_TOUR",
    suffix: "Chef-Led Food Walk",
    duration: "3 hours",
    price: 95,
    imageSeed: "food",
  },
  {
    category: "CULTURAL",
    suffix: "Evening Cultural Show",
    duration: "2.5 hours",
    price: 75,
    imageSeed: "culture",
  },
  {
    category: "TRANSFER",
    suffix: "Private Airport Transfer",
    duration: "45 min",
    price: 65,
    imageSeed: "transfer",
  },
  {
    category: "PHOTOGRAPHY",
    suffix: "Golden Hour Photo Session",
    duration: "2 hours",
    price: 149,
    imageSeed: "photo",
  },
];

function attractionFor(destName: string, idx: number) {
  const pairs = [
    {
      name: `${destName} Old Quarter`,
      description:
        "Wander lanes lined with local makers, historic façades, and hidden courtyards.",
    },
    {
      name: `${destName} Panorama Point`,
      description:
        "Sweeping views and a perfect sunrise or sunset moment away from the crowds.",
    },
  ];
  const p = pairs[idx % 2];
  return {
    name: p.name,
    description: p.description,
    imageUrl:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  };
}

async function main() {
  await prisma.bookingActivity.deleteMany();
  await prisma.sharedTrip.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.attraction.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const adminHash = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.user.create({
    data: {
      email: "admin@tripwayz.com",
      passwordHash: adminHash,
      role: Role.ADMIN,
      profile: {
        create: { name: "TripWayz Admin", bio: "Platform administrator" },
      },
    },
  });

  const demoUserHash = await bcrypt.hash("User@123", 12);
  await prisma.user.create({
    data: {
      email: "demo@tripwayz.com",
      passwordHash: demoUserHash,
      role: Role.USER,
      profile: {
        create: { name: "Demo Traveler", bio: "Loves weekend escapes" },
      },
    },
  });

  let activityCount = 0;
  const usedCombos = new Set<string>();

  for (const d of destinations) {
    const dest = await prisma.destination.create({
      data: {
        name: d.name,
        slug: d.slug,
        description: d.description,
        imageUrl: d.imageUrl,
        basePrice: d.basePrice,
        country: d.country,
        region: d.region,
        attractions: {
          create: [
            attractionFor(d.name, 0),
            attractionFor(d.name, 1),
          ],
        },
      },
    });

    let added = 0;
    let t = 0;
    while (added < 5 && activityCount < 100) {
      const tmpl = addonTemplates[t % addonTemplates.length];
      t++;
      const key = `${dest.id}-${tmpl.category}-${tmpl.suffix}`;
      if (usedCombos.has(key)) continue;
      usedCombos.add(key);
      const img =
        addonImageByCategory[tmpl.category] ??
        addonImageByCategory.SIGHTSEEING;
      await prisma.activity.create({
        data: {
          destinationId: dest.id,
          name: `${d.name} ${tmpl.suffix}`,
          description: `Curated ${tmpl.category.toLowerCase().replace("_", " ")} experience in ${d.name}, with local hosts and seamless logistics.`,
          category: tmpl.category,
          imageUrl: img,
          duration: tmpl.duration,
          price: tmpl.price + Math.floor(Math.random() * 40),
        },
      });
      added++;
      activityCount++;
    }
  }

  console.log("Seeded admin:", admin.email);
  console.log("Destinations:", destinations.length);
  console.log("Activities:", activityCount);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
