export type SeedMuseumSite = {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  coordinates: [number, number];
  summary: string;
  image: string;
  shipSlugs: string[];
  description?: string;
  address?: string;
  visitorInfo?: string;
  accessibilityNotes?: string;
  visitDurationMinutes?: number;
  officialWebsite?: string;
  wikipediaUrl?: string;
  sourceNotes?: string;
  openStatus?: "OPEN" | "TEMPORARILY_CLOSED" | "EXTERIOR_ONLY" | "MEMORIAL_ONLY" | "CLOSED" | "UNKNOWN";
  statusNote?: string;
  statusSourceUrl?: string;
  expectedReopenText?: string;
  expectedReopenDate?: Date;
};

export type SeedShip = {
  id: string;
  slug: string;
  name: string;
  className: string;
  type: string;
  launched: number;
  country: string;
  siteSlug: string;
  summary: string;
  image: string;
  hullNumber?: string;
  commissionedYear?: number;
  decommissionedYear?: number;
  preservationStatus?: "PRESERVED" | "PARTIALLY_PRESERVED" | "RESTORATION" | "DISPLAY_ONLY" | "UNKNOWN";
  openStatus?: "OPEN" | "TEMPORARILY_CLOSED" | "EXTERIOR_ONLY" | "MEMORIAL_ONLY" | "CLOSED" | "UNKNOWN";
  statusNote?: string;
  statusSourceUrl?: string;
  expectedReopenText?: string;
  expectedReopenDate?: Date;
  overview?: string;
  whyVisit?: string;
  history?: string;
  technicalInfo?: Record<string, string | number | boolean>;
  visitorNotes?: string;
  officialWebsite?: string;
  wikipediaUrl?: string;
};

export const sites: SeedMuseumSite[] = [
  {
    id: "site-salem",
    slug: "united-states-naval-shipbuilding-museum",
    name: "United States Naval Shipbuilding Museum",
    city: "Quincy, Massachusetts",
    country: "United States",
    coordinates: [42.2442, -70.9692],
    summary: "A shipbuilding museum centered on the preserved heavy cruiser USS Salem.",
    image: "/placeholder-site.svg",
    shipSlugs: ["uss-salem"],
  },
  {
    id: "site-battleship-cove",
    slug: "battleship-cove",
    name: "Battleship Cove",
    city: "Fall River, Massachusetts",
    country: "United States",
    coordinates: [41.7066, -71.1633],
    summary: "A waterfront museum with a varied fleet spanning battleships, submarines, and destroyers.",
    image: "/placeholder-site.svg",
    shipSlugs: ["uss-massachusetts", "uss-lionfish", "uss-joseph-p-kennedy-jr"],
    description: "Centered on USS Massachusetts, Battleship Cove brings several preserved naval vessels together on the Fall River waterfront. The collection gives visitors an approachable look at life aboard ships of very different sizes and roles.",
    address: "5 Water Street, Fall River, MA 02721, United States",
    visitorInfo: "Allow time to explore multiple vessels, with ladders, narrow passageways, and outdoor waterfront areas. Seasonal access and special events can affect what is open, so check the museum website before traveling.",
    accessibilityNotes: "Access varies by vessel and may involve steep ladders or confined spaces. Visitors with mobility needs should review the museum's current accessibility guidance or contact the museum before visiting.",
    visitDurationMinutes: 180,
    officialWebsite: "https://www.battleshipcove.org/",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Battleship_Cove",
    sourceNotes: "Development/demo summary based on the museum's public visitor information. Confirm current access and operating details with Battleship Cove.",
    openStatus: "OPEN",
    statusNote: "Operating schedules and vessel access can vary by season, weather, maintenance, and special events. Check the official website for current details.",
    statusSourceUrl: "https://www.battleshipcove.org/visit",
  },
  {
    id: "site-belfast",
    slug: "hms-belfast-site",
    name: "HMS Belfast",
    city: "London",
    country: "United Kingdom",
    coordinates: [51.5066, -0.0816],
    summary: "The preserved Town-class cruiser moored on the River Thames near Tower Bridge.",
    image: "/placeholder-site.svg",
    shipSlugs: ["hms-belfast"],
  },
  {
    id: "site-victory",
    slug: "portsmouth-historic-dockyard",
    name: "Portsmouth Historic Dockyard",
    city: "Portsmouth",
    country: "United Kingdom",
    coordinates: [50.8019, -1.1094],
    summary: "A major naval heritage destination and home of HMS Victory.",
    image: "/placeholder-site.svg",
    shipSlugs: ["hms-victory"],
  },
  {
    id: "site-mikasa",
    slug: "mikasa-park",
    name: "Mikasa Park",
    city: "Yokosuka",
    country: "Japan",
    coordinates: [35.2851, 139.6744],
    summary: "A waterfront park built around the preserved pre-dreadnought battleship Mikasa.",
    image: "/placeholder-site.svg",
    shipSlugs: ["mikasa"],
  },
  {
    id: "site-aurora",
    slug: "aurora-museum-ship",
    name: "Aurora Museum Ship",
    city: "Saint Petersburg",
    country: "Russia",
    coordinates: [59.9555, 30.3378],
    summary: "The preserved Russian cruiser Aurora on the Petrogradskaya Embankment.",
    image: "/placeholder-site.svg",
    shipSlugs: ["aurora"],
  },
  {
    id: "site-maritiman",
    slug: "maritiman",
    name: "Maritiman",
    city: "Gothenburg",
    country: "Sweden",
    coordinates: [57.7101, 11.9665],
    summary: "A floating maritime museum whose collection includes the destroyer HSwMS Småland.",
    image: "/placeholder-site.svg",
    shipSlugs: ["hswms-smaland"],
  },
];

export const ships: SeedShip[] = [
  {
    id: "ship-salem",
    slug: "uss-salem",
    name: "USS Salem",
    className: "Des Moines class",
    type: "Heavy cruiser",
    launched: 1947,
    country: "United States",
    siteSlug: "united-states-naval-shipbuilding-museum",
    summary: "The world's only preserved Des Moines-class heavy cruiser and a landmark of Quincy shipbuilding.",
    image: "/placeholder-ship.svg",
  },
  {
    id: "ship-massachusetts",
    slug: "uss-massachusetts",
    name: "USS Massachusetts",
    className: "South Dakota class",
    type: "Battleship",
    launched: 1941,
    country: "United States",
    siteSlug: "battleship-cove",
    summary: "A World War II battleship preserved as the centerpiece of Battleship Cove.",
    image: "/placeholder-ship.svg",
    hullNumber: "BB-59",
    commissionedYear: 1942,
    decommissionedYear: 1947,
    preservationStatus: "PRESERVED",
    openStatus: "OPEN",
    statusNote: "Visit details can change by season or for special events; check Battleship Cove before planning a trip.",
    statusSourceUrl: "https://www.battleshipcove.org/visit",
    overview: "USS Massachusetts is a South Dakota-class battleship preserved on the Fall River waterfront. Visitors can explore a major World War II capital ship in the setting of a larger naval museum.",
    whyVisit: "Big Mamie is worth seeing in person for her scale, preserved battleship spaces, and setting among several other historic vessels at Battleship Cove.",
    visitorNotes: "Plan enough time for ladders, narrow passageways, and multiple decks. Comfortable shoes are helpful, and visitors with mobility needs should review current access guidance before arriving.",
    history: "Commissioned in 1942, USS Massachusetts served in World War II in both the Atlantic and Pacific. After decommissioning in 1947, she was preserved in Massachusetts and opened as a museum ship.",
    technicalInfo: {
      hullNumber: "BB-59",
      class: "South Dakota class",
      lengthFeet: 681,
      mainBattery: "9 x 16-inch guns",
      commissioned: 1942,
      decommissioned: 1947,
    },
    officialWebsite: "https://www.battleshipcove.org/uss-massachusetts",
    wikipediaUrl: "https://en.wikipedia.org/wiki/USS_Massachusetts_(BB-59)",
  },
  {
    id: "ship-lionfish",
    slug: "uss-lionfish",
    name: "USS Lionfish",
    className: "Balao class",
    type: "Submarine",
    launched: 1943,
    country: "United States",
    siteSlug: "battleship-cove",
    summary: "A Balao-class fleet submarine open to visitors alongside Battleship Cove's surface ships.",
    image: "/placeholder-ship.svg",
  },
  {
    id: "ship-joseph-p-kennedy-jr",
    slug: "uss-joseph-p-kennedy-jr",
    name: "USS Joseph P. Kennedy Jr.",
    className: "Gearing class",
    type: "Destroyer",
    launched: 1945,
    country: "United States",
    siteSlug: "battleship-cove",
    summary: "A Gearing-class destroyer preserved at Battleship Cove after Cold War and Korean War-era service.",
    image: "/placeholder-ship.svg",
  },
  {
    id: "ship-belfast",
    slug: "hms-belfast",
    name: "HMS Belfast",
    className: "Town class",
    type: "Light cruiser",
    launched: 1938,
    country: "United Kingdom",
    siteSlug: "hms-belfast-site",
    summary: "A Royal Navy cruiser with service from the Arctic convoys to the Korean War.",
    image: "/placeholder-ship.svg",
  },
  {
    id: "ship-victory",
    slug: "hms-victory",
    name: "HMS Victory",
    className: "104-gun first-rate",
    type: "Ship of the line",
    launched: 1765,
    country: "United Kingdom",
    siteSlug: "portsmouth-historic-dockyard",
    summary: "Nelson's flagship at Trafalgar and the oldest commissioned warship in the world.",
    image: "/placeholder-ship.svg",
  },
  {
    id: "ship-mikasa",
    slug: "mikasa",
    name: "Mikasa",
    className: "Mikasa class",
    type: "Pre-dreadnought battleship",
    launched: 1900,
    country: "Japan",
    siteSlug: "mikasa-park",
    summary: "Admiral Togo's flagship at the Battle of Tsushima and a rare surviving pre-dreadnought.",
    image: "/placeholder-ship.svg",
  },
  {
    id: "ship-aurora",
    slug: "aurora",
    name: "Aurora",
    className: "Pallada class",
    type: "Protected cruiser",
    launched: 1900,
    country: "Russia",
    siteSlug: "aurora-museum-ship",
    summary: "A turn-of-the-century cruiser remembered for its association with the October Revolution.",
    image: "/placeholder-ship.svg",
  },
  {
    id: "ship-smaland",
    slug: "hswms-smaland",
    name: "HSwMS Småland",
    className: "Halland class",
    type: "Destroyer",
    launched: 1952,
    country: "Sweden",
    siteSlug: "maritiman",
    summary: "A Cold War Swedish destroyer preserved as part of Gothenburg's floating museum fleet.",
    image: "/placeholder-ship.svg",
  },
];
