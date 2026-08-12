import { CorsOptions } from "cors";

export const allowedOrigins = [
  // Production — main site
  "https://vtrustinstitutions.com",
  "https://www.vtrustinstitutions.com",
  // Production — admin panel
  "https://admin.vtrustinstitutions.com",
  "http://admin.vtrustinstitutions.com",
  // Demo / staging
  "https://demo.vtrustinstitutions.com",
  "http://demo.vtrustinstitutions.com",
  // Local development
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174"
];

const normalizeOrigin = (value: string): string =>
  value.trim().toLowerCase().replace(/\/+$/, "");

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // ✅ Allow server-to-server / curl / pm2 / health checks
    if (!origin) return callback(null, true);

    // ✅ Normalize origin (REMOVE trailing slashes + case-insensitive host)
    const normalizedOrigin = normalizeOrigin(origin);

    const isAllowed = allowedOrigins.some(
      (allowed) => normalizeOrigin(allowed) === normalizedOrigin
    );

    if (isAllowed) {
      return callback(null, true);
    }

    console.log("❌ BLOCKED CORS:", origin);

    // ❗ Return a 403 error instead of silently passing through,
    // so a blocked origin never falls through to a generic 404.
    return callback(
      Object.assign(
        new Error(`CORS: origin "${origin}" is not allowed`),
        { status: 403 }
      )
    );
  },

  credentials: true,

  // ✅ PUT / POST / PATCH / DELETE explicitly allowed
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  // ✅ JSON body via PUT requires Content-Type to be allowed
  allowedHeaders: ["Content-Type", "Authorization"],

  exposedHeaders: ["Content-Type", "Authorization"]
};