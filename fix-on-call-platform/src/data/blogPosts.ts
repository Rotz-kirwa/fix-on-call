export type BlogCategory =
  | "Car Maintenance"
  | "Roadside Emergencies"
  | "Driving Tips"
  | "Vehicle Safety";

export interface BlogSection {
  heading: string;
  paragraphs: string[];
  image?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  preview: string;
  category: BlogCategory;
  readTime: string;
  author: string;
  date: string;
  heroImage: string;
  featured?: boolean;
  popularScore: number;
  sections: BlogSection[];
}

export const blogCategories: BlogCategory[] = [
  "Car Maintenance",
  "Roadside Emergencies",
  "Driving Tips",
  "Vehicle Safety",
];

export const blogPosts: BlogPost[] = [
  {
    slug: "car-breaks-down-on-highway",
    title: "What To Do When Your Car Breaks Down on the Highway",
    preview: "A step-by-step emergency checklist to stay visible, safe, and calm while waiting for help.",
    category: "Roadside Emergencies",
    readTime: "6 min read",
    author: "Fix On Call Team",
    date: "2026-03-03",
    heroImage: "https://i.pinimg.com/1200x/59/bb/64/59bb6443272aa2cdce4d2ab3eac5de50.jpg",
    featured: true,
    popularScore: 98,
    sections: [
      {
        heading: "Move To A Safe Position First",
        paragraphs: [
          "If your vehicle is still moving, indicate early and steer to the shoulder or nearest safe bay. Avoid sudden braking in active lanes.",
          "Turn on hazard lights immediately so approaching drivers can react early.",
        ],
      },
      {
        heading: "Protect Yourself And Passengers",
        paragraphs: [
          "Exit from the safer side away from traffic where possible. Keep everyone behind barriers if available.",
          "Set reflective triangles or warning signs a safe distance behind your vehicle, especially at night or in low visibility.",
        ],
        image: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80",
      },
      {
        heading: "Call Roadside Help With Clear Details",
        paragraphs: [
          "Share your exact location, direction of travel, vehicle type, and visible issue symptoms.",
          "If you use Fix On Call, request help through the app and keep your phone reachable for operator updates.",
        ],
      },
    ],
  },
  {
    slug: "signs-battery-about-to-die",
    title: "5 Signs Your Car Battery Is About to Die",
    preview: "Catch battery failure early before you get stranded in traffic or late-night parking areas.",
    category: "Car Maintenance",
    readTime: "5 min read",
    author: "A. Njoroge",
    date: "2026-02-26",
    heroImage: "https://i.pinimg.com/736x/34/92/a1/3492a1585ecad60d8cdef02509fc705d.jpg",
    featured: true,
    popularScore: 93,
    sections: [
      {
        heading: "Slow Crank During Startup",
        paragraphs: [
          "If the engine turns over slowly in the morning, your battery charge may be weak.",
          "Repeated slow starts are a warning that replacement is near.",
        ],
      },
      {
        heading: "Electrical Dimming",
        paragraphs: [
          "Headlights, dashboard lights, and infotainment flickers often indicate low voltage under load.",
          "Test battery terminals for corrosion and ensure tight connections.",
        ],
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      },
      {
        heading: "Battery Age And Maintenance",
        paragraphs: [
          "Most batteries degrade after 2-4 years depending on climate and usage.",
          "Schedule a voltage test during routine service to avoid surprise breakdowns.",
        ],
      },
    ],
  },
  {
    slug: "change-flat-tire-safely",
    title: "How to Change a Flat Tire Safely",
    preview: "A practical roadside method to replace a flat tire without risking injury or vehicle damage.",
    category: "Roadside Emergencies",
    readTime: "7 min read",
    author: "Fix On Call Team",
    date: "2026-02-20",
    heroImage: "https://i.pinimg.com/1200x/41/2e/a4/412ea4d7a74d178428fd3ba63f9e31b5.jpg",
    featured: true,
    popularScore: 91,
    sections: [
      {
        heading: "Prepare The Vehicle",
        paragraphs: [
          "Park on stable flat ground, engage the handbrake, and place wheel chocks if available.",
          "Loosen lug nuts before lifting the vehicle with the jack.",
        ],
      },
      {
        heading: "Lift And Replace Carefully",
        paragraphs: [
          "Use designated jacking points from your vehicle manual.",
          "Remove the damaged wheel, mount spare tire, and tighten lug nuts in a star pattern.",
        ],
        image: "https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?auto=format&fit=crop&w=1200&q=80",
      },
      {
        heading: "Final Check",
        paragraphs: [
          "Lower the vehicle fully before final tightening.",
          "Drive slowly to a workshop and repair or replace the damaged tire permanently.",
        ],
      },
    ],
  },
  {
    slug: "prevent-overheating-in-traffic",
    title: "How To Prevent Engine Overheating in Heavy Traffic",
    preview: "Smart cooling checks and driving habits that protect your engine in stop-and-go city conditions.",
    category: "Car Maintenance",
    readTime: "4 min read",
    author: "M. Otieno",
    date: "2026-02-15",
    heroImage: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=1400&q=80",
    popularScore: 82,
    sections: [
      {
        heading: "Check Coolant And Radiator Health",
        paragraphs: [
          "Low coolant is one of the most common overheating causes. Check levels when engine is cool.",
          "Inspect hoses and radiator caps for leaks or cracks.",
        ],
      },
      {
        heading: "Manage Load In Gridlock",
        paragraphs: [
          "Avoid aggressive acceleration and long idle periods with poor airflow.",
          "Switch off unnecessary electrical loads when temperature climbs.",
        ],
      },
    ],
  },
  {
    slug: "night-driving-safety-checklist",
    title: "Night Driving Safety Checklist Every Driver Should Follow",
    preview: "Visibility, fatigue, and hazard awareness tips for safer night travel on urban and highway roads.",
    category: "Vehicle Safety",
    readTime: "5 min read",
    author: "K. Wanjiru",
    date: "2026-02-10",
    heroImage: "https://images.unsplash.com/photo-1462396881884-de2c07cb95ed?auto=format&fit=crop&w=1400&q=80",
    popularScore: 79,
    sections: [
      {
        heading: "Visibility First",
        paragraphs: [
          "Clean windscreen, mirrors, and headlights before departure.",
          "Use low beam when facing oncoming traffic and high beam only when road is clear.",
        ],
      },
      {
        heading: "Stay Alert",
        paragraphs: [
          "Take regular breaks and avoid driving drowsy.",
          "Keep a safe distance because reaction time at night is typically slower.",
        ],
      },
    ],
  },
  {
    slug: "fuel-saving-driving-habits",
    title: "Fuel-Saving Driving Habits That Actually Work",
    preview: "Reduce monthly fuel spend with smoother acceleration, better planning, and practical vehicle care.",
    category: "Driving Tips",
    readTime: "4 min read",
    author: "Fix On Call Team",
    date: "2026-02-04",
    heroImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1400&q=80",
    popularScore: 75,
    sections: [
      {
        heading: "Drive Smoothly",
        paragraphs: [
          "Harsh acceleration and braking increase fuel burn significantly.",
          "Maintain steady speeds and anticipate stops earlier.",
        ],
      },
      {
        heading: "Plan And Maintain",
        paragraphs: [
          "Combine errands to reduce cold starts and idle time.",
          "Keep tires properly inflated and service filters regularly for efficiency.",
        ],
      },
    ],
  },
  {
    slug: "when-to-call-towing-service",
    title: "When You Should Call Towing Instead of Driving Further",
    preview: "Understand warning signs that mean driving on could cause expensive engine or transmission damage.",
    category: "Roadside Emergencies",
    readTime: "6 min read",
    author: "D. Kiptoo",
    date: "2026-01-30",
    heroImage: "https://images.unsplash.com/photo-1511527844068-006b95d162c2?auto=format&fit=crop&w=1400&q=80",
    popularScore: 87,
    sections: [
      {
        heading: "Critical Warning Signs",
        paragraphs: [
          "Persistent overheating, oil pressure warning, brake failure feel, or heavy smoke require immediate stop.",
          "Driving through these conditions can multiply repair costs.",
        ],
      },
      {
        heading: "Call For Professional Recovery",
        paragraphs: [
          "Use towing when vehicle safety is uncertain.",
          "Fix On Call dispatch can route a tow provider directly to your position with ETA updates.",
        ],
      },
    ],
  },
  {
    slug: "rainy-season-roadside-prep",
    title: "Rainy Season Roadside Prep: What To Keep in Your Car",
    preview: "A compact emergency kit checklist for wet-weather breakdowns and low-visibility driving days.",
    category: "Vehicle Safety",
    readTime: "3 min read",
    author: "Fix On Call Team",
    date: "2026-01-24",
    heroImage: "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&w=1400&q=80",
    popularScore: 72,
    sections: [
      {
        heading: "Essentials To Pack",
        paragraphs: [
          "Reflective triangle, flashlight, jumper cables, raincoat, tow rope, and first aid kit.",
          "Store items in a waterproof organizer for quick access.",
        ],
      },
      {
        heading: "Keep Devices Powered",
        paragraphs: [
          "Carry a car charger and power bank so you can always contact support.",
          "Save emergency numbers in favorites before long trips.",
        ],
      },
    ],
  },
  {
    slug: "daily-vehicle-safety-check-2-minutes",
    title: "2-Minute Daily Vehicle Safety Check Before You Drive",
    preview: "A simple pre-drive routine that helps prevent roadside emergencies and avoidable accidents.",
    category: "Driving Tips",
    readTime: "3 min read",
    author: "P. Mwangi",
    date: "2026-01-17",
    heroImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
    popularScore: 68,
    sections: [
      {
        heading: "Walk Around Inspection",
        paragraphs: [
          "Check tire pressure appearance, visible leaks, and broken lights.",
          "Confirm mirrors and wipers are clean and functional.",
        ],
      },
      {
        heading: "Cabin Quick Check",
        paragraphs: [
          "Confirm warning lights clear after ignition and brakes feel normal.",
          "Set seat position and mirrors properly before moving.",
        ],
      },
    ],
  },
];
