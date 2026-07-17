/** Redis client connection (used for OTP, blocking, etc.). */
import { createClient } from "redis";
import { env } from "../../config/env.service.js";

let client: ReturnType<typeof createClient> | null = null;
let connecting: Promise<void> | null = null;

const connect = async (): Promise<void> => {
  if (client?.isOpen) return;

  client = createClient({
    url: env.REDIS_URL,
    socket: {
      reconnectStrategy: false,
      connectTimeout: 5000,
    },
  });

  client.on("error", () => {});

  connecting = client.connect().then(() => {}).catch((err: Error) => {
    console.error("Redis connection failed:", err.message);
    client = null;
    connecting = null;
  });

  await connecting;
  if (client?.isOpen) console.log("redis connected");
};

/** Returns the Redis client, connecting lazily on first call */
export const getClient = async (): Promise<ReturnType<typeof createClient>> => {
  if (!client?.isOpen && !connecting) await connect();
  else if (connecting) await connecting;
  if (!client?.isOpen) throw new Error("Redis not available");
  return client;
};
