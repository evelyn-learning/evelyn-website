/**
 * Seed Sample Data Script
 *
 * Creates sample data for development and testing.
 *
 * Usage: npx ts-node scripts/seed-sample-data.ts
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/evelyn";

// Schemas
const BlogPostSchema = new mongoose.Schema({
  title: String,
  slug: String,
  excerpt: String,
  content: String,
  featuredImage: String,
  category: String,
  tags: [String],
  author: { type: String, default: "Evelyn Learning" },
  status: { type: String, default: "published" },
  publishedAt: Date,
  metaTitle: String,
  metaDescription: String,
  readingTime: { type: Number, default: 5 },
}, { timestamps: true });

const WebinarSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  date: Date,
  time: String,
  timezone: { type: String, default: "PST" },
  duration: { type: String, default: "60 minutes" },
  featuredImage: String,
  videoUrl: String,
  youtubeId: String,
  speakers: [{ name: String, title: String, company: String, image: String }],
  status: { type: String, default: "past" },
  registrationUrl: String,
  tags: [String],
}, { timestamps: true });

const InterviewSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  episode: Number,
  guest: { name: String, title: String, company: String, image: String, linkedIn: String },
  youtubeUrl: String,
  youtubeId: String,
  duration: String,
  publishedAt: Date,
  tags: [String],
}, { timestamps: true });

const SpeakerSchema = new mongoose.Schema({
  name: String,
  slug: String,
  title: String,
  company: String,
  bio: String,
  image: String,
  linkedIn: String,
  year: Number,
  contentType: { type: String, default: "webinar" },
  contentUrl: String,
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const BlogPost = mongoose.model("BlogPost", BlogPostSchema);
const Webinar = mongoose.model("Webinar", WebinarSchema);
const Interview = mongoose.model("Interview", InterviewSchema);
const Speaker = mongoose.model("Speaker", SpeakerSchema);

async function seedData() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // Sample Blog Posts
  const blogPosts = [
    {
      title: "The Power and Potential of Visual Learning Style",
      slug: "visual-learning-style",
      excerpt: "Explore how visual learning can transform educational outcomes and engagement.",
      content: `# The Power of Visual Learning\n\nVisual learning is one of the most effective ways to absorb and retain information. In this article, we explore the science behind visual learning and practical strategies for implementing it in your curriculum.\n\n## Why Visual Learning Works\n\nResearch shows that the human brain processes visual information 60,000 times faster than text. This makes visual learning an incredibly powerful tool for education.\n\n## Key Strategies\n\n1. **Use infographics** to present complex data\n2. **Incorporate videos** for procedural learning\n3. **Create mind maps** for conceptual understanding\n4. **Leverage color coding** for categorization`,
      category: "Learning Styles",
      tags: ["Visual Learning", "Education", "Pedagogy"],
      status: "published",
      publishedAt: new Date("2024-01-15"),
      readingTime: 5,
    },
    {
      title: "AI in Education: Transforming the Learning Experience",
      slug: "ai-in-education",
      excerpt: "Discover how artificial intelligence is revolutionizing education and creating personalized learning paths.",
      content: `# AI in Education\n\nArtificial intelligence is no longer science fiction—it's actively reshaping how we teach and learn. From personalized tutoring to automated assessment, AI offers unprecedented opportunities for educational innovation.\n\n## Key Applications\n\n- **Adaptive Learning Platforms**: Systems that adjust to individual student needs\n- **Intelligent Tutoring**: AI-powered tutors available 24/7\n- **Automated Grading**: Instant feedback on assignments\n- **Predictive Analytics**: Early identification of at-risk students`,
      category: "AI & Technology",
      tags: ["AI", "EdTech", "Innovation"],
      status: "published",
      publishedAt: new Date("2024-02-01"),
      readingTime: 7,
    },
  ];

  // Sample Webinars
  const webinars = [
    {
      title: "Integrating AI into Online Tutoring: The Next Frontier",
      slug: "ai-online-tutoring",
      description: "Join us for an insightful discussion on how AI is transforming online tutoring and what it means for educators and learners.",
      date: new Date("2023-12-12"),
      time: "10:00 AM",
      timezone: "PST",
      duration: "60 minutes",
      speakers: [
        { name: "Dr. Sarah Johnson", title: "Chief Learning Officer", company: "EdTech Solutions" },
      ],
      status: "past",
      youtubeId: "dQw4w9WgXcQ",
      tags: ["AI", "Online Tutoring", "EdTech"],
    },
  ];

  // Sample Interviews
  const interviews = [
    {
      title: "Discover the Power of Essential Soft Skills for Personal and Professional Growth",
      slug: "soft-skills-growth",
      description: "Chris Mackey shares insights on developing essential soft skills in the modern workplace and educational settings.",
      episode: 9,
      guest: {
        name: "Chris Mackey",
        title: "Leadership Coach",
        company: "Growth Mindset Institute",
        linkedIn: "https://linkedin.com/in/chrismackey",
      },
      youtubeUrl: "https://www.youtube.com/watch?v=example",
      youtubeId: "example",
      publishedAt: new Date("2023-11-15"),
      tags: ["Soft Skills", "Leadership", "Professional Development"],
    },
  ];

  // Sample Speakers
  const speakers = [
    {
      name: "Chris Mackey",
      slug: "chris-mackey",
      title: "Leadership Coach",
      company: "Growth Mindset Institute",
      bio: "Chris Mackey is a renowned leadership coach with over 15 years of experience helping organizations develop their human potential.",
      linkedIn: "https://linkedin.com/in/chrismackey",
      year: 2023,
      contentType: "interview",
      contentUrl: "/interviews",
    },
    {
      name: "Dr. Sarah Johnson",
      slug: "sarah-johnson",
      title: "Chief Learning Officer",
      company: "EdTech Solutions",
      bio: "Dr. Sarah Johnson leads innovation in learning technology, specializing in AI-powered educational solutions.",
      linkedIn: "https://linkedin.com/in/sarahjohnson",
      year: 2023,
      contentType: "webinar",
      contentUrl: "/webinars",
    },
  ];

  // Insert data
  await BlogPost.insertMany(blogPosts);
  console.log(`✅ Created ${blogPosts.length} blog posts`);

  await Webinar.insertMany(webinars);
  console.log(`✅ Created ${webinars.length} webinars`);

  await Interview.insertMany(interviews);
  console.log(`✅ Created ${interviews.length} interviews`);

  await Speaker.insertMany(speakers);
  console.log(`✅ Created ${speakers.length} speakers`);

  await mongoose.disconnect();
  console.log("\n✅ Seed data created successfully!");
}

seedData().catch(console.error);
