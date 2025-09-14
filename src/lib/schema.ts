import { z } from "zod";

export const settingsSchema = z.object({
  siteName: z.string().min(2),
  ministryName: z.string().min(2),
  vision: z.string().min(2),
  address: z.string().min(2),
  phoneSmsOnly: z.string().min(4),
  email: z.string().email(),
  instagram: z.string().url(),
  facebook: z.string().url(),
  youtube: z.string().url(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  heroHeadline: z.string().min(2),
  heroSub: z.string().min(2),
  yt1: z.string().optional(),
  yt2: z.string().optional(),
  yt3: z.string().optional()
});

export const serviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  day: z.string().min(2),
  time: z.string().min(2),
  details: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  visible: z.boolean().optional(),
  order: z.number().int().nonnegative().optional()
});
