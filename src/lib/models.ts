// src/lib/models.ts
import mongoose, { Schema, model, models } from "mongoose";

/** ===== Existing models you already had ===== */
const UserSchema = new Schema({
  email: { type: String, unique: true },
  name: String,
  passwordHash: String,
  role: { type: String, enum: ["ADMIN", "VIEWER"], default: "VIEWER" },
}, { timestamps: true });

const SiteSettingsSchema = new Schema({
  siteName: { type: String, default: "Mount Zion Bible Church Nigeria" },
  ministryName: { type: String, default: "Mount Zion Prayer Ministry Int'l" },
  vision: { type: String, default: "Zion, where captives become captains." },
  address: { type: String, default: "26 Busayo Taiwo Street, Oni and Sons, Ibadan, Nigeria" },
  phoneSmsOnly: { type: String, default: "0814 859 9942" },
  email: { type: String, default: "mzpmintal@gmail.com" },
  instagram: String,
  facebook: String,
  youtube: String,
  logoUrl: String,
  heroHeadline: String,
  heroSub: String,
  yt1: String,
  yt2: String,
  yt3: String,
}, { timestamps: true });

const LeaderSchema = new Schema({
  name: String,
  title: String,
  photoUrl: String,
  bio: String,
  order: Number,
}, { timestamps: true });

const ServiceSchema = new Schema({
  name: String,
  day: String,
  time: String,
  details: String,
  imageUrl: String,
  visible: { type: Boolean, default: true },
  order: Number,
}, { timestamps: true });

const AnnouncementSchema = new Schema({
  title: String,
  body: String,
  startDate: Date,
  endDate: Date,
  featured: Boolean,
}, { timestamps: true });

/** ===== New models used by the new pages ===== */

// Prayer points (Prayer Capsule)
const PrayerPointSchema = new Schema({
  title: { type: String, required: true },
  body:  { type: String, required: true },
}, { timestamps: true });

// “Zion Daily”: word, prophetic, sunday school, devotional, homecare
const DailySchema = new Schema({
  wordOfDay: String,
  propheticDeclaration: String,
  sundaySchool: String,
  devotional: String,
  homecareFellowship: String,
}, { timestamps: true });

// Work Force: pastors and units
const PastorSchema = new Schema({
  name: { type: String, required: true },
  photoUrl: String,
  order: Number,
}, { timestamps: true });

const UnitSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  joinLink: String,
  order: Number,
}, { timestamps: true });

// Humor of the week + facts
const HumorSchema = new Schema({
  humor: String,
  scienceFact: String,
  healthFact: String,
}, { timestamps: true });

// Testimonies (moderated)
const TestimonySchema = new Schema({
  title: String,
  name: String,
  body: String,
  approved: { type: Boolean, default: false },
}, { timestamps: true });

// Deliverance page (Zoom)
const DeliveranceSchema = new Schema({
  zoomId: String,
  zoomPasscode: String,
  instructions: String,
}, { timestamps: true });

// About sub-ministries
const MinistryGroupSchema = new Schema({
  key: { type: String, index: true }, // e.g., "women", "beacons", "men", "heritage", "champions"
  title: String,
  photoUrl: String,
  body: String,
}, { timestamps: true });

// Media hub: youtube / photo / audio
const MediaItemSchema = new Schema({
  kind: { type: String, enum: ["youtube", "photo", "audio"], required: true },
  title: String,
  url: String,        // for youtube store the VIDEO ID only
  thumbnail: String,  // optional
}, { timestamps: true });

/** ===== Export all models (prevent recompilation in dev) ===== */
export const User           = models.User           || model("User", UserSchema);
export const SiteSettings   = models.SiteSettings   || model("SiteSettings", SiteSettingsSchema);
export const Leader         = models.Leader         || model("Leader", LeaderSchema);
export const Service        = models.Service        || model("Service", ServiceSchema);
export const Announcement   = models.Announcement   || model("Announcement", AnnouncementSchema);

export const PrayerPoint    = models.PrayerPoint    || model("PrayerPoint", PrayerPointSchema);
export const Daily          = models.Daily          || model("Daily", DailySchema);
export const Pastor         = models.Pastor         || model("Pastor", PastorSchema);
export const Unit           = models.Unit           || model("Unit", UnitSchema);
export const Humor          = models.Humor          || model("Humor", HumorSchema);
export const Testimony      = models.Testimony      || model("Testimony", TestimonySchema);
export const Deliverance    = models.Deliverance    || model("Deliverance", DeliveranceSchema);
export const MinistryGroup  = models.MinistryGroup  || model("MinistryGroup", MinistryGroupSchema);
export const MediaItem      = models.MediaItem      || model("MediaItem", MediaItemSchema);



// Entry for each day's content
const DailyEntrySchema = new Schema(
  {
    date: { type: String }, // display string or ISO date; optional for flexibility
    title: { type: String, required: true },
    subtitle: { type: String },
    text: { type: String, required: true },
  },
  { _id: true, timestamps: true }
);

// Section holds multiple entries (history). key is unique.
const DailySectionSchema = new Schema(
  {
    key: {
      type: String,
      enum: ["wordOfDay", "prophetic", "sundaySchool", "devotional", "homecare"],
      required: true,
      unique: true,
    },
    items: { type: [DailyEntrySchema], default: [] },
  },
  { timestamps: true }
);

export const DailySection =
  (models.DailySection as mongoose.Model<any>) ||
  model("DailySection", DailySectionSchema);
