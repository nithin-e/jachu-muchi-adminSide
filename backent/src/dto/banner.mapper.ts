import { BANNER_PRIMARY_BUTTON_LINK, BANNER_STATUS, BannerStatus, BANNER_STATUS_VALUES } from "../models/Banner";
import { CreateBannerInput, UpdateBannerInput } from "../types/banner.types";

function normalizeStatus(raw: unknown): BannerStatus {
  if (typeof raw !== "string" || !raw.trim()) return BANNER_STATUS.ACTIVE;
  const s = raw.trim() as BannerStatus;
  return BANNER_STATUS_VALUES.includes(s) ? s : BANNER_STATUS.ACTIVE;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asOrder(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.round(value));
  const n = Number(asString(value).trim());
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : 0;
}

function asStatus(raw: unknown): BannerStatus {
  if (typeof raw !== "string" || !raw.trim()) return BANNER_STATUS.ACTIVE;
  const s = raw.trim() as BannerStatus;
  return BANNER_STATUS_VALUES.includes(s) ? s : BANNER_STATUS.ACTIVE;
}

export function mapBodyToCreateBannerInput(
  body: Record<string, unknown>,
  image?: string
): CreateBannerInput {
  const explicitImage =
    typeof body.image === "string" ? body.image : undefined;

  const resolvedImage = image?.trim()
    ? image.trim()
    : explicitImage?.trim() ?? "";

  return {
    heading: asString(body.heading),
    highlightedText: asString(body.highlightedText),
    subtext: asString(body.subtext),
    primaryButtonText: asString(body.primaryButtonText),
    primaryButtonLink: BANNER_PRIMARY_BUTTON_LINK,
    secondaryButtonText: asString(body.secondaryButtonText),
    order: asOrder(body.order),
    status: normalizeStatus(body.status),
    image: resolvedImage,
  };
}

export function mapBodyToUpdateBannerInput(
  body: Record<string, unknown>,
  image?: string
): UpdateBannerInput {
  const base: UpdateBannerInput = {
    heading: asString(body.heading) || undefined,
    highlightedText: asString(body.highlightedText),
    subtext: asString(body.subtext),
    primaryButtonText: asString(body.primaryButtonText),
    secondaryButtonText: asString(body.secondaryButtonText),
    order: asOrder(body.order),
    status: asStatus(body.status),
  };

  const explicitImage =
    typeof body.image === "string" ? body.image : undefined;

  if (image?.trim()) {
    return { ...base, image: image.trim() };
  }
  if (explicitImage?.trim()) {
    return { ...base, image: explicitImage.trim() };
  }

  return base;
}
