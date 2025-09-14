/* eslint-disable no-console */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { dbConnect } from "../src/lib/db";
import { User, SiteSettings, Leader, Service } from "../src/lib/models";

async function run() {
  await dbConnect();

  const adminEmail = "akinsipeoluwademilade@gmail.com";
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const passwordHash = await bcrypt.hash("MZBCWEBSITE", 10);
    await User.create({
      email: adminEmail,
      name: "Site Admin",
      passwordHash,
      role: "ADMIN"
    });
  }

  await SiteSettings.findOneAndUpdate(
    {},
    {
      logoUrl:
        "https://web.facebook.com/photo/?fbid=459743116191355&set=ecnf.100064670110523",
      yt1: "XICJmTCnfJ4",
      yt2: "EE6elPu3PiM",
      yt3: "VKnGhDa8gAo",
      siteName: "Mount Zion Bible Church Nigeria",
      ministryName: "Mount Zion Prayer Ministry Int'l",
      vision: "Zion, where captives become captains.",
      address: "26 Busayo Taiwo Street, Oni and Sons, Ibadan, Nigeria",
      phoneSmsOnly: "0814 859 9942",
      email: "mzpmintal@gmail.com",
      instagram: "https://www.instagram.com/mountzionbiblechurch/",
      facebook: "https://web.facebook.com/mzpmi",
      youtube:
        "https://www.youtube.com/@MountZionPrayerMinistryI-fz9ls/videos",
      heroHeadline: "Mount Zion Bible Church Nigeria",
      heroSub: "Zion, where captives become captains."
    },
    { upsert: true }
  );

  await Leader.deleteMany({});
  await Leader.insertMany([
    {
      name: "Pastor David Jesse",
      title: "General Overseer",
      photoUrl:
        "https://web.facebook.com/mzpmi/photos/pb.100064670110523.-2207520000/3642844919096155/?type=3",
      order: 1
    },
    {
      name: "Pastor Banke Jesse",
      title: "Co-Lead Pastor",
      photoUrl:
        "https://web.facebook.com/mzpmi/photos/pb.100064670110523.-2207520000/3270802779633706/?type=3",
      order: 2
    }
  ]);

  await Service.deleteMany({});
  await Service.insertMany([
    {
      name: "Deliverance & Miracle Hour",
      day: "Monday",
      time: "11:30am",
      details: "Weekly service",
      imageUrl:
        "https://web.facebook.com/photo.php?fbid=1103348768497450&set=pb.100064670110523.-2207520000&type=3",
      order: 1
    },
    {
      name: "Word Liberation Hour",
      day: "Wednesday",
      time: "5:00pm",
      details: "Teaching & Prayer",
      imageUrl: "",
      order: 2
    },
    {
      name: "Zion Breakthrough Night",
      day: "Last Friday",
      time: "(Night Vigil)",
      details: "Monthly",
      imageUrl: "",
      order: 3
    },
    {
      name: "Sunday Service",
      day: "Sunday",
      time: "Evangelism/Sunday School: 7:40–8:10am; Service from 8:15am",
      details: "Worship Service",
      imageUrl: "",
      order: 4
    }
  ]);

  console.log("✅ Seed done. Admin login: akinsipeoluwademilade@gmail.com // ChangeMe123!");
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
