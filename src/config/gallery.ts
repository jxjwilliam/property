const R2_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";

const phoneFiles = [
  "phone__Weixin Image_20260518190536_13_1.jpg",
  "phone__Weixin Image_20260518190540_14_1.jpg",
  "phone__Weixin Image_20260518190543_15_1.jpg",
  "phone__Weixin Image_20260518190547_16_1.jpg",
  "phone__Weixin Image_20260518190550_17_1.jpg",
];

const realtorNumbers = [
  1, 2, 11, 12, 13, 14,
  ...Array.from({ length: 7 }, (_, i) => 19 + i),
  ...Array.from({ length: 21 }, (_, i) => 27 + i),
];

export interface GalleryGroup {
  key: string;
  label: string;
  description: string;
  files: string[];
}

export interface GalleryImage {
  id: string;
  fileName: string;
  url: string;
  source: string;
  caption: string;
  subcaption: string;
}

export interface GalleryStat {
  value: string;
  label: string;
}

export const galleryGroups: GalleryGroup[] = [
  {
    key: "all",
    label: "All",
    description: "Every frame in the upload set",
    files: [
      ...phoneFiles,
      "scraped-media__matterport__image-001.jpg",
      ...realtorNumbers.map((n) => `scraped-media__realtor-ca__image-${String(n).padStart(3, "0")}.jpg`),
      ...Array.from({ length: 34 }, (_, i) => `scraped-media__rew-ca__image-${String(i + 1).padStart(3, "0")}.jpeg`),
    ],
  },
  {
    key: "phone",
    label: "Phone",
    description: "Guest-facing mobile captures",
    files: phoneFiles,
  },
  {
    key: "matterport",
    label: "Matterport",
    description: "3D tour preview",
    files: ["scraped-media__matterport__image-001.jpg"],
  },
  {
    key: "realtor",
    label: "Realtor.ca",
    description: "Listing photo set",
    files: realtorNumbers.map((n) => `scraped-media__realtor-ca__image-${String(n).padStart(3, "0")}.jpg`),
  },
  {
    key: "rew",
    label: "REW.ca",
    description: "MLS and market listing set",
    files: Array.from({ length: 34 }, (_, i) => `scraped-media__rew-ca__image-${String(i + 1).padStart(3, "0")}.jpeg`),
  },
];

const titleMap: Record<string, string> = {
  phone: "Phone capture",
  matterport: "Matterport tour",
  realtor: "Realtor.ca listing photo",
  rew: "REW.ca listing photo",
};

export const statsData: GalleryStat[] = [
  { value: "Brand new", label: "Summer-ready rental" },
  { value: "SkyTrain", label: "Transit access" },
  { value: "Mall + park", label: "Walkable convenience" },
];

function imageUrl(fileName: string): string {
  return `${R2_BASE}/${encodeURIComponent(fileName)}`;
}

export function getGroup(key: string): GalleryGroup {
  return galleryGroups.find((g) => g.key === key) ?? galleryGroups[0];
}

export function buildItems(group: GalleryGroup): GalleryImage[] {
  return group.files.map((fileName, index) => {
    const source = group.label;
    const title = titleMap[group.key] ?? group.label;
    return {
      id: `${group.key}-${index}`,
      fileName,
      url: imageUrl(fileName),
      source,
      caption: `${title} ${String(index + 1).padStart(2, "0")}`,
      subcaption: fileName.replace(/^.*__/, "").replace(/_/g, " "),
    };
  });
}

export function getFilteredItems(filterKey: string): GalleryImage[] {
  return buildItems(getGroup(filterKey));
}
