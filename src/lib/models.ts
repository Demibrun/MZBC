import { Schema, model, models } from "mongoose";

export type Role = "ADMIN" | "VIEWER";

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    name: String,
    passwordHash: String,
    role: { type: String, enum: ["ADMIN", "VIEWER"], default: "VIEWER" }
  },
  { timestamps: true }
);
export const User = models.User || model("User", UserSchema);

const SiteSettingsSchema = new Schema(
  {
    siteName: { type: String, default: "Mount Zion Bible Church Nigeria" },
    ministryName: { type: String, default: "Mount Zion Prayer Ministry Int'l" },
    vision: { type: String, default: "Zion, where captives become captains." },
    address: {
      type: String,
      default: "26 Busayo Taiwo Street, Oni and Sons, Ibadan, Nigeria"
    },
    phoneSmsOnly: { type: String, default: "0814 859 9942" },
    email: { type: String, default: "mzpmintal@gmail.com" },
    instagram: {
      type: String,
      default: "https://www.instagram.com/mountzionbiblechurch/"
    },
    facebook: { type: String, default: "https://web.facebook.com/mzpmi" },
    youtube: {
      type: String,
      default:
        "https://www.youtube.com/@MountZionPrayerMinistryI-fz9ls/videos"
    },
    logoUrl: {
      type: String,
      default:
        "https://web.facebook.com/photo/?fbid=459743116191355&set=ecnf.100064670110523"
    },
    heroHeadline: { type: String, default: "Mount Zion Bible Church Nigeria" },
    heroSub: { type: String, default: "Zion, where captives become captains." },
    yt1: { type: String, default: "XICJmTCnfJ4" },
    yt2: { type: String, default: "EE6elPu3PiM" },
    yt3: { type: String, default: "VKnGhDa8gAo" }
  },
  { timestamps: true }
);
export const SiteSettings =
  models.SiteSettings || model("SiteSettings", SiteSettingsSchema);

const LeaderSchema = new Schema(
  {
    name: String,
    title: String,
    photoUrl: String,
    bio: String,
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);
export const Leader = models.Leader || model("Leader", LeaderSchema);

const ServiceSchema = new Schema(
  {
    name: String,
    day: String,
    time: String,
    details: String,
    imageUrl: String,
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);
export const Service = models.Service || model("Service", ServiceSchema);

const AnnouncementSchema = new Schema(
  {
    title: String,
    body: String,
    startDate: Date,
    endDate: Date,
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);
export const Announcement =
  models.Announcement || model("Announcement", AnnouncementSchema);
