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
const DailyEntrySchema = new Schema(
  {
    date: String,
    title: { type: String, required: true },
    subtitle: String,
    text: { type: String, required: true },
    mediaKind: { type: String, enum: ["youtube", "audio", "video", null], default: null },
    mediaUrl: String,
    mediaTitle: String,
    thumbnail: String,
  },
  { _id: true, timestamps: true }
);

const DailySchema = new Schema(
  {
    wordOfDay: { items: { type: [DailyEntrySchema], default: [] } },
    prophetic: { items: { type: [DailyEntrySchema], default: [] } },
    sundaySchool: { items: { type: [DailyEntrySchema], default: [] } },
    devotional: { items: { type: [DailyEntrySchema], default: [] } },
    homecare: { items: { type: [DailyEntrySchema], default: [] } },
  },
  { timestamps: true }
);

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
export const User: mongoose.Model<any> =
  (models.User as mongoose.Model<any>) || model<any>("User", UserSchema);
export const SiteSettings: mongoose.Model<any> =
  (models.SiteSettings as mongoose.Model<any>) || model<any>("SiteSettings", SiteSettingsSchema);
export const Leader: mongoose.Model<any> =
  (models.Leader as mongoose.Model<any>) || model<any>("Leader", LeaderSchema);
export const Service: mongoose.Model<any> =
  (models.Service as mongoose.Model<any>) || model<any>("Service", ServiceSchema);
export const Announcement: mongoose.Model<any> =
  (models.Announcement as mongoose.Model<any>) || model<any>("Announcement", AnnouncementSchema);

export const PrayerPoint: mongoose.Model<any> =
  (models.PrayerPoint as mongoose.Model<any>) || model<any>("PrayerPoint", PrayerPointSchema);
export const Daily: mongoose.Model<any> =
  (models.Daily as mongoose.Model<any>) || model<any>("Daily", DailySchema);
export const Pastor: mongoose.Model<any> =
  (models.Pastor as mongoose.Model<any>) || model<any>("Pastor", PastorSchema);
export const Unit: mongoose.Model<any> =
  (models.Unit as mongoose.Model<any>) || model<any>("Unit", UnitSchema);
export const Humor: mongoose.Model<any> =
  (models.Humor as mongoose.Model<any>) || model<any>("Humor", HumorSchema);
export const Testimony: mongoose.Model<any> =
  (models.Testimony as mongoose.Model<any>) || model<any>("Testimony", TestimonySchema);
export const Deliverance: mongoose.Model<any> =
  (models.Deliverance as mongoose.Model<any>) || model<any>("Deliverance", DeliveranceSchema);
export const MinistryGroup: mongoose.Model<any> =
  (models.MinistryGroup as mongoose.Model<any>) || model<any>("MinistryGroup", MinistryGroupSchema);
export const MediaItem: mongoose.Model<any> =
  (models.MediaItem as mongoose.Model<any>) || model<any>("MediaItem", MediaItemSchema);



// Entry for each day's content
const DailySectionEntrySchema = new Schema(
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
    items: { type: [DailySectionEntrySchema], default: [] },
  },
  { timestamps: true }
);

export const DailySection =
  (models.DailySection as mongoose.Model<any>) ||
  model("DailySection", DailySectionSchema);
