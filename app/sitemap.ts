import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://yomigana-sprint.vercel.app";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/game`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/study`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/report`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/legal`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];
}
