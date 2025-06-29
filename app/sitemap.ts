import { MetadataRoute } from "next";
import constants from "@/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: constants.url,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
  ];
}
