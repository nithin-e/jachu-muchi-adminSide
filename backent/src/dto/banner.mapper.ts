import { BANNER_STATUS, BannerStatus, BANNER_STATUS_VALUES } from "../models/Banner";
import { CreateBannerInput, UpdateBannerInput } from "../types/banner.types";

function normalizeStatus(raw: unknown): BannerStatus {
  if (typeof raw !== "string" || !raw.trim()) return BANNER_STATUS.ACTIVE;
  const s = raw.trim() as BannerStatus;
  return BANNER_STATUS_VALUES.includes(s) ? s : BANNER_STATUS.ACTIVE;
}

export function mapBodyToCreateBannerInput(
  body: Record<string, unknown>,
  imageUrl?: string
): CreateBannerInput {
  const title =
    (typeof body.title === "string" && body.title) ||
    (typeof body.bannerTitle === "string" && body.bannerTitle) ||
    "";

  const explicitUrl =
    typeof body.imageUrl === "string" ? body.imageUrl : undefined;

  const resolvedImageUrl = imageUrl?.trim()
    ? imageUrl.trim()
    : explicitUrl?.trim() ?? "";

  return {
    title,
    status: normalizeStatus(body.status),
    imageUrl: resolvedImageUrl,
  };
}

export function mapBodyToUpdateBannerInput(
  body: Record<string, unknown>,
  imageUrl?: string
): UpdateBannerInput {
  const title =
    (typeof body.title === "string" && body.title) ||
    (typeof body.bannerTitle === "string" && body.bannerTitle) ||
    "";

  const explicitUrl =
    typeof body.imageUrl === "string" ? body.imageUrl : undefined;

  const base: UpdateBannerInput = {
    title,
    status: normalizeStatus(body.status),
  };

  if (imageUrl?.trim()) {
    return { ...base, imageUrl: imageUrl.trim() };
  }
  if (explicitUrl?.trim()) {
    return { ...base, imageUrl: explicitUrl.trim() };
  }

  return base;
}
