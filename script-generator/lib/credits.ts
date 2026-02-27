import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "credits.json");
const INITIAL_CREDITS = 10;

interface DeviceRecord {
  credits: number;
  totalPurchased: number;
  subscriptionId?: string;
  subscriptionStatus?: "active" | "canceled";
}

type CreditStore = Record<string, DeviceRecord>;

function readStore(): CreditStore {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      return {};
    }
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw) as CreditStore;
  } catch {
    return {};
  }
}

function writeStore(store: CreditStore): void {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_PATH, JSON.stringify(store, null, 2), "utf-8");
}

export function getCredits(deviceId: string): number {
  const store = readStore();
  return store[deviceId]?.credits ?? -1;
}

export function isRegistered(deviceId: string): boolean {
  const store = readStore();
  return deviceId in store;
}

export function hasActiveSubscription(deviceId: string): boolean {
  const store = readStore();
  return store[deviceId]?.subscriptionStatus === "active";
}

export function initDevice(deviceId: string): void {
  const store = readStore();
  if (!(deviceId in store)) {
    store[deviceId] = { credits: INITIAL_CREDITS, totalPurchased: 0 };
    writeStore(store);
  }
}

export function deductCredit(deviceId: string): boolean {
  const store = readStore();
  const record = store[deviceId];
  if (!record || record.credits <= 0) return false;
  record.credits -= 1;
  writeStore(store);
  return true;
}

export function addCredits(deviceId: string, amount: number): void {
  const store = readStore();
  if (!(deviceId in store)) {
    store[deviceId] = { credits: 0, totalPurchased: 0 };
  }
  store[deviceId].credits += amount;
  store[deviceId].totalPurchased += amount;
  writeStore(store);
}

export function setSubscription(
  deviceId: string,
  subscriptionId: string,
  status: "active" | "canceled"
): void {
  const store = readStore();
  if (!(deviceId in store)) {
    store[deviceId] = { credits: 0, totalPurchased: 0 };
  }
  store[deviceId].subscriptionId = subscriptionId;
  store[deviceId].subscriptionStatus = status;
  writeStore(store);
}

export function getDeviceBySubscriptionId(subscriptionId: string): string | null {
  const store = readStore();
  for (const [deviceId, record] of Object.entries(store)) {
    if (record.subscriptionId === subscriptionId) return deviceId;
  }
  return null;
}
