import { BranchStatus, BRANCH_STATUS_VALUES } from "../models/Branch";
import { CreateBranchInput, UpdateBranchInput } from "../types/branch.types";

function normalizeStatus(raw: unknown): BranchStatus {
  if (typeof raw !== "string" || !raw.trim()) return "Active";
  const s = raw.trim() as BranchStatus;
  return BRANCH_STATUS_VALUES.includes(s) ? s : "Active";
}

function parsePhoneNumbers(body: Record<string, unknown>): string[] {
  const fromArray = (value: unknown): string[] => {
    if (!Array.isArray(value)) return [];
    return value
      .filter((x): x is string => typeof x === "string")
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const direct = fromArray(body.phoneNumbers);
  if (direct.length > 0) return direct;

  const phones = fromArray(body.phones);
  if (phones.length > 0) return phones;

  if (typeof body.phoneNumbers === "string" && body.phoneNumbers.trim()) {
    try {
      const parsed = JSON.parse(body.phoneNumbers) as unknown;
      const asArr = fromArray(parsed);
      if (asArr.length > 0) return asArr;
    } catch {
      /* single string */
    }
  }

  if (typeof body.phone === "string" && body.phone.trim()) {
    return [body.phone.trim()];
  }

  return [];
}

export function mapBodyToCreateBranchInput(
  body: Record<string, unknown>
): CreateBranchInput {
  const name =
    (typeof body.name === "string" && body.name) ||
    (typeof body.branchName === "string" && body.branchName) ||
    "";

  const location =
    (typeof body.location === "string" && body.location) ||
    (typeof body.address === "string" && body.address) ||
    "";

  const mapUrl = typeof body.mapUrl === "string" ? body.mapUrl.trim() : "";

  const email = typeof body.email === "string" ? body.email.trim() : "";

  const phoneNumbers = parsePhoneNumbers(body);

  return {
    name,
    location,
    phoneNumbers,
    mapUrl,
    email,
    status: normalizeStatus(body.status),
  };
}

export function mapBodyToUpdateBranchInput(
  body: Record<string, unknown>
): UpdateBranchInput {
  return mapBodyToCreateBranchInput(body);
}
