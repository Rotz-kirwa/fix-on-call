const API_URL = process.env.API_URL || "http://localhost:5000/api";

const rand = Math.floor(Math.random() * 1000000);

const users = [
  {
    name: `Smoke Driver ${rand}`,
    email: `smoke.driver.${rand}@example.com`,
    phone: `07${String(rand).padStart(8, "0").slice(0, 8)}`,
    password: "SmokePass123!",
    user_type: "driver",
    vehicle_info: {
      make: "Toyota",
      model: "Premio",
      year: 2020,
      license_plate: `KSM ${String(rand).slice(0, 3)}A`,
    },
  },
  {
    name: `Smoke Mechanic ${rand}`,
    email: `smoke.mechanic.${rand}@example.com`,
    phone: `07${String(rand + 1).padStart(8, "0").slice(0, 8)}`,
    password: "SmokePass123!",
    user_type: "mechanic",
  },
];

const post = async (path, body) => {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
};

const run = async () => {
  console.log(`Smoke run against ${API_URL}`);
  for (const payload of users) {
    const res = await post("/auth/register", payload);
    if (!res.ok) {
      console.log(`FAIL register ${payload.user_type}:`, res.status, res.data?.error || res.data);
      continue;
    }
    console.log(`OK register ${payload.user_type}:`, res.data?.user?.id, res.data?.user?.email);
  }

  console.log("\\nNext step:");
  console.log("1) Log in as admin on main site");
  console.log("2) Open admin /users and /overview");
  console.log("3) Confirm Total Users increased and new smoke users are listed");
};

run().catch((e) => {
  console.error("Smoke script failed:", e.message);
  process.exit(1);
});
