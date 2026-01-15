/**
 * Update Webinar YouTube IDs
 *
 * Run: npx tsx scripts/update-webinar-youtube.ts
 *
 * Instructions:
 * 1. Go to https://www.youtube.com/@EvelynSystems/videos
 * 2. Find each webinar video and copy its video ID from the URL
 *    (e.g., from https://www.youtube.com/watch?v=ABC123xyz, the ID is "ABC123xyz")
 * 3. Update the mapping below with the correct video IDs
 * 4. Run this script to update the database
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

const WebinarSchema = new mongoose.Schema({
  title: String,
  slug: String,
  youtubeId: String,
}, { timestamps: true });

const Webinar = mongoose.model("Webinar", WebinarSchema);

// Map webinar slugs to their YouTube video IDs
// TODO: Fill in the actual YouTube IDs from https://www.youtube.com/@EvelynSystems/videos
const webinarYoutubeIds: Record<string, string> = {
  "integrating-ai-into-online-tutoring-the-next-frontier": "",
  "changing-instruction-design-with-newer-generation-students-and-technologies": "",
  "should-national-curriculum-standardization-be-the-way-forward": "",
  "rethinking-education-and-assessment-with-ai": "",
  "how-to-make-high-school-students-career-ready": "",
  "moving-on-with-times-assessing-new-age-curriculum-requirements": "",
  "how-to-make-higher-education-equitable-and-more-affordable": "",
  "top-trends-in-education-in-2023-envisaging-an-ideal-education-system": "",
  "looking-beyond-college-studies": "",
};

async function updateWebinarYoutubeIds() {
  console.log("🔗 Connecting to MongoDB...\n");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected!\n");

  // Check for empty IDs
  const emptyIds = Object.entries(webinarYoutubeIds).filter(([_, id]) => !id);
  if (emptyIds.length > 0) {
    console.log("⚠️  The following webinars still need YouTube IDs:\n");
    emptyIds.forEach(([slug]) => {
      console.log(`   - ${slug}`);
    });
    console.log("\n📝 Please update the webinarYoutubeIds mapping in this script");
    console.log("   with the video IDs from https://www.youtube.com/@EvelynSystems/videos\n");
  }

  // Update webinars that have IDs
  const updates = Object.entries(webinarYoutubeIds).filter(([_, id]) => id);

  if (updates.length > 0) {
    console.log("📺 Updating webinar YouTube IDs...\n");
    for (const [slug, youtubeId] of updates) {
      const result = await Webinar.updateOne({ slug }, { $set: { youtubeId } });
      if (result.modifiedCount > 0) {
        console.log(`   ✅ Updated: ${slug} -> ${youtubeId}`);
      } else {
        console.log(`   ⚠️  Not found: ${slug}`);
      }
    }
    console.log("\n✅ Updates complete!");
  } else {
    console.log("ℹ️  No updates to make. Add YouTube IDs to the mapping first.");
  }

  await mongoose.disconnect();
}

updateWebinarYoutubeIds().catch(console.error);
