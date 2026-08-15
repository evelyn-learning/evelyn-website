/**
 * Seed Webinars, Interviews, and Speakers from Evelyn Learning website data
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

// Schemas
const WebinarSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  date: Date,
  time: String,
  timezone: { type: String, default: "PT" },
  duration: { type: String, default: "60 minutes" },
  featuredImage: String,
  videoUrl: String,
  youtubeId: String,
  speakers: [{
    name: String,
    title: String,
    company: String,
    image: String,
  }],
  status: { type: String, enum: ["upcoming", "past", "live"], default: "past" },
  registrationUrl: String,
  tags: [String],
}, { timestamps: true });

const InterviewSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  episode: Number,
  guest: {
    name: String,
    title: String,
    company: String,
    image: String,
    linkedIn: String,
  },
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
  twitter: String,
  website: String,
  year: Number,
  contentType: { type: String, enum: ["webinar", "interview", "both"], default: "webinar" },
  contentUrl: String,
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const Webinar = mongoose.model("Webinar", WebinarSchema);
const Interview = mongoose.model("Interview", InterviewSchema);
const Speaker = mongoose.model("Speaker", SpeakerSchema);

// Helper to create slug
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Helper to extract YouTube ID
function extractYoutubeId(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|\/embed\/|\/v\/|\/watch\?.*v=)([^&\n?#]+)/);
  return match ? match[1] : "";
}

// Webinar data
const webinars = [
  {
    title: "Integrating AI into Online Tutoring: The Next Frontier",
    date: new Date("2023-12-12T09:00:00-08:00"),
    time: "9:00 AM",
    description: "In an era where technology is reshaping education, this webinar delves into the groundbreaking integration of AI in online tutoring, exploring how artificial intelligence is transforming personalized learning experiences.",
    status: "past",
    tags: ["AI", "Online Tutoring", "EdTech"],
  },
  {
    title: "Changing Instruction Design with Newer Generation Students and Technologies",
    date: new Date("2023-09-26T09:30:00-07:00"),
    time: "9:30 AM",
    description: "Explores how instruction design shapes student learning journeys for technology-native learners, focusing on adapting teaching methodologies for Gen Z and Gen Alpha students.",
    status: "past",
    tags: ["Instructional Design", "Gen Z", "Technology"],
  },
  {
    title: "Should National Curriculum Standardization be the Way Forward?",
    date: new Date("2023-08-04T09:30:00-07:00"),
    time: "9:30 AM",
    description: "Addresses the absence of standardized national curriculum in American elementary education and explores the potential benefits and challenges of curriculum standardization.",
    status: "past",
    tags: ["Curriculum", "Standards", "Education Policy"],
  },
  {
    title: "Rethinking Education and Assessment with AI",
    date: new Date("2023-06-27T09:30:00-07:00"),
    time: "9:30 AM",
    description: "Examines how AI can assist teachers with assessment strategies, from automated grading to personalized feedback and adaptive testing.",
    status: "past",
    tags: ["AI", "Assessment", "EdTech"],
  },
  {
    title: "How to Make High School Students Career-Ready",
    date: new Date("2023-05-04T09:30:00-07:00"),
    time: "9:30 AM",
    description: "Discussion on preparing high school students for the workforce through practical skills development, career counseling, and industry partnerships.",
    status: "past",
    tags: ["Career Readiness", "High School", "Workforce"],
  },
  {
    title: "Moving on with Times: Assessing New Age Curriculum Requirements",
    date: new Date("2023-03-22T09:30:00-07:00"),
    time: "9:30 AM",
    description: "Explores the evolving needs of modern curricula and how educational institutions can adapt to meet the demands of the 21st century.",
    status: "past",
    tags: ["Curriculum", "Education Reform", "21st Century Skills"],
  },
  {
    title: "How to Make Higher Education Equitable and More Affordable?",
    date: new Date("2023-01-24T09:30:00-08:00"),
    time: "9:30 AM",
    description: "Discusses strategies for making higher education more accessible and affordable while maintaining quality and ensuring equitable outcomes for all students.",
    status: "past",
    tags: ["Higher Education", "Equity", "Affordability"],
  },
  {
    title: "Top Trends in Education in 2023: Envisaging an Ideal Education System",
    date: new Date("2022-12-06T10:00:00-08:00"),
    time: "10:00 AM",
    description: "Covers unconventional education approaches including homeschooling, online undergraduate courses, and AR/VR tools that are shaping the future of education.",
    status: "past",
    tags: ["Education Trends", "AR/VR", "Online Learning"],
  },
  {
    title: "Looking Beyond College Studies",
    date: new Date("2022-10-04T10:30:00-07:00"),
    time: "10:30 AM",
    description: "Discusses the three tiers of student education beyond core specialization subjects, emphasizing holistic development and lifelong learning.",
    status: "past",
    tags: ["Higher Education", "Lifelong Learning", "Student Development"],
  },
];

// Interview data
const interviews = [
  {
    episode: 9,
    title: "Discover the Power of Essential Soft Skills for Personal and Professional Growth",
    guest: {
      name: "Chris Mackey",
      title: "Co-founder",
      company: "Skillsline",
      linkedIn: "https://www.linkedin.com/in/ccmackey/",
    },
    youtubeUrl: "https://youtu.be/f9tl08PEgV4",
    description: "Chris Mackey, former VP at The Myers-Briggs Company, discusses the importance of soft skills and how they contribute to personal and professional success.",
    publishedAt: new Date("2023-08-15"),
    tags: ["Soft Skills", "Professional Development"],
  },
  {
    episode: 8,
    title: "Discussing PBL Core Practices, Technology Integration Issues, and Curriculum Development",
    guest: {
      name: "Lauralyn Vasquez",
      title: "Director of Operations and Educational Services",
      company: "Beyond Technology Education",
      linkedIn: "https://www.linkedin.com/in/lauralyn-vasquez/",
    },
    youtubeUrl: "https://youtu.be/OHZ3LwGm_h4",
    description: "Lauralyn Vasquez shares insights on project-based learning, technology integration challenges, and effective curriculum development strategies.",
    publishedAt: new Date("2023-07-20"),
    tags: ["PBL", "Technology Integration", "Curriculum"],
  },
  {
    episode: 7,
    title: "Making Universities More Student-Centric, and the Role of Technology in it",
    guest: {
      name: "John Thompson-Haas",
      title: "Managing Director for Client Services",
      company: "Beyond Academics",
      linkedIn: "https://www.linkedin.com/in/john-thompson-haas-096674/",
    },
    youtubeUrl: "https://youtu.be/Xqze95HfG-o",
    description: "John Thompson-Haas discusses how technology can help universities become more student-centric, drawing on 25 years of EdTech experience.",
    publishedAt: new Date("2023-06-15"),
    tags: ["Higher Education", "Student Experience", "EdTech"],
  },
  {
    episode: 6,
    title: "Discussing Student Career-Readiness, the Role of Ed-Tech Companies, and Catapult",
    guest: {
      name: "Kevin J Fleming",
      title: "Founder and CEO",
      company: "Catapult",
      linkedIn: "https://www.linkedin.com/in/kevinjflemingphd/",
    },
    youtubeUrl: "https://youtu.be/Vw3NgIA1A1w",
    description: "Kevin Fleming, former Dean of Instruction at Norco College and author of four books, discusses preparing students for successful careers.",
    publishedAt: new Date("2023-05-10"),
    tags: ["Career Readiness", "EdTech", "Student Success"],
  },
  {
    episode: 5,
    title: "Importance of SEL and Ethics in AI",
    guest: {
      name: "Marisa Zalabak",
      title: "Founder",
      company: "Open Channel Culture",
      linkedIn: "https://www.linkedin.com/in/marisazalabak/",
    },
    youtubeUrl: "https://youtu.be/LmdksGxuLXU",
    description: "Marisa Zalabak, educational psychologist and co-chair of IEEE.org committee on AI ethics education, discusses SEL and ethical considerations in AI.",
    publishedAt: new Date("2023-04-12"),
    tags: ["SEL", "AI Ethics", "Education"],
  },
  {
    episode: 4,
    title: "How Ed-Tech is Changing our Lives?",
    guest: {
      name: "Brad Waid",
      title: "Emerging Technology Leader",
      company: "",
      linkedIn: "https://www.linkedin.com/in/brad-waid-21187593/",
    },
    youtubeUrl: "https://youtu.be/qCglJG12aWo",
    description: "Brad Waid, one of the top 20 Global Futurist speakers and #14 AR influencer worldwide, discusses the transformative impact of EdTech.",
    publishedAt: new Date("2023-03-08"),
    tags: ["EdTech", "AR/VR", "Future of Education"],
  },
  {
    episode: 3,
    title: "How to Achieve Quality & Equity Education Globally?",
    guest: {
      name: "Erin Dowd",
      title: "Educator and Consultant",
      company: "",
      linkedIn: "https://www.linkedin.com/in/erin-dowd-7266b665/",
    },
    youtubeUrl: "https://youtu.be/wHsuJHY_xSY",
    description: "Erin Dowd, 2017 ASCD Emerging Leader with nearly two decades of experience, discusses strategies for achieving quality and equitable education globally.",
    publishedAt: new Date("2023-02-15"),
    tags: ["Equity", "Global Education", "Quality Education"],
  },
  {
    episode: 2,
    title: "Understanding Challenges to Effective Learning",
    guest: {
      name: "PJ Caposey",
      title: "Superintendent",
      company: "Meridian CUSD 223",
      linkedIn: "https://www.linkedin.com/in/mcusdsupe/",
    },
    youtubeUrl: "https://youtu.be/1S7C3sFNUQQ",
    description: "PJ Caposey, award-winning teacher and best-selling author of 8 books, discusses the challenges educators face in creating effective learning environments.",
    publishedAt: new Date("2022-12-20"),
    tags: ["Learning Challenges", "Education Leadership", "Teaching"],
  },
  {
    episode: 1,
    title: "AR/VR in Education",
    guest: {
      name: "Jaime Donally",
      title: "Founder",
      company: "ARVRinEDU",
      linkedIn: "https://www.linkedin.com/in/jaimedonally/",
    },
    youtubeUrl: "https://youtu.be/kgE3p23ThuY",
    description: "Jaime Donally, founder of ARVRinEDU and Global Maker Day, discusses the applications and potential of AR/VR technologies in education.",
    publishedAt: new Date("2022-11-10"),
    tags: ["AR/VR", "EdTech", "Immersive Learning"],
  },
];

// Speaker data
const speakers = [
  // 2023 Speakers
  {
    name: "Audrika Thakuria",
    title: "Leader, Delta Careers",
    company: "Crimson Education",
    bio: "Educator and EdTech visionary dedicated to using technology for global education quality improvement.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/10/656621de3c931.jpg",
    linkedIn: "https://www.linkedin.com/in/audrikathakuria/",
    year: 2023,
    contentType: "webinar",
  },
  {
    name: "Ellen Prescott, Ph.D., PMP",
    title: "Instructional Designer",
    company: "California Institute of Integral Studies",
    bio: "15+ years expertise in instructional design, creating dynamic Canvas courses for diverse learners.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/07/IMG_3636.jpg",
    linkedIn: "https://www.linkedin.com/in/ellenprescott/",
    year: 2023,
    contentType: "webinar",
  },
  {
    name: "Humberto Hernandez",
    title: "Accessibility and Universal Design Advocate",
    company: "",
    bio: "Colombo-American with 10+ years EdTech experience, certified Front-End Web Developer focused on inclusive education.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/07/Humberto-Hernandez.png",
    linkedIn: "https://www.linkedin.com/in/humbertohernandez7/",
    year: 2023,
    contentType: "webinar",
  },
  {
    name: "Corey Seemiller, Ph.D.",
    title: "Professor, Department of Leadership Studies",
    company: "Wright State University",
    bio: "Author of multiple Generation Z books with TED Talk viewed 250k+ times.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/09/64fb5ae462e6d.jpg",
    linkedIn: "https://www.linkedin.com/in/seemiller/",
    year: 2023,
    contentType: "webinar",
  },
  {
    name: "Chris Mackey",
    title: "Co-founder",
    company: "Skillsline",
    bio: "Former VP at The Myers-Briggs Company, focuses on student retention innovation and soft skills development.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/08/Cris-Mackey.png",
    linkedIn: "https://www.linkedin.com/in/ccmackey/",
    year: 2023,
    contentType: "interview",
  },
  {
    name: "Rebecca Roese",
    title: "Curriculum Management Director",
    company: "2U/edX",
    bio: "15+ years in higher education with expertise in adult learning and curriculum design.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/07/Rebecca-Roese-1.jpg",
    linkedIn: "https://www.linkedin.com/in/rebeccaroese/",
    year: 2023,
    contentType: "webinar",
  },
  {
    name: "Aditya Agarkar",
    title: "Co-founder",
    company: "Edulastic",
    bio: "30+ years software industry experience, led K-12 assessment platform to 10M+ users.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/07/Agarkar.png",
    linkedIn: "https://www.linkedin.com/in/agarkar/",
    year: 2023,
    contentType: "webinar",
  },
  {
    name: "Keith Wakeman",
    title: "CEO & Co-Founder",
    company: "SuperBetter",
    bio: "Purpose-driven innovator using gameplay psychology for youth mental health and career readiness.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/04/Keith-Wakeman-200x200-1.webp",
    linkedIn: "https://www.linkedin.com/in/keithwakeman/",
    year: 2023,
    contentType: "webinar",
  },
  {
    name: "Stuart Draper",
    title: "Founder & CEO",
    company: "Stukent.com",
    bio: "Co-author of 'Digital Marketing Essentials', 5x Inc. 5000 honoree focused on education and AI.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/04/Stuart-Draper-Profile-Pic-2023.jpg",
    linkedIn: "https://www.linkedin.com/in/draperstu/",
    year: 2023,
    contentType: "webinar",
  },
  {
    name: "Martine Holland",
    title: "Head of Assessment",
    company: "Bedrock Learning",
    bio: "Former senior assessment specialist for IELTS, published on pandemic remote learning and AI in education.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/04/Martine-Holland-300.png",
    linkedIn: "https://www.linkedin.com/in/martine-holland/",
    year: 2023,
    contentType: "webinar",
  },
  {
    name: "Lauralyn Vasquez",
    title: "Director of Operations and Educational Services",
    company: "Beyond Technology Education",
    bio: "Motivational speaker with MA in Teaching and Learning with Technology, focused on digital citizenship.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/06/Untitled-design-15-200x200-1.webp",
    linkedIn: "https://www.linkedin.com/in/lauralyn-vasquez/",
    year: 2023,
    contentType: "interview",
  },
  {
    name: "John Thompson-Haas",
    title: "Managing Director for Client Services",
    company: "Beyond Academics",
    bio: "25 years EdTech experience, led major SIS implementations across the U.S.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/04/John-BA-2-200x178-1.webp",
    linkedIn: "https://www.linkedin.com/in/john-thompson-haas-096674/",
    year: 2023,
    contentType: "interview",
  },
  {
    name: "Kevin J Fleming, Ph.D.",
    title: "Founder & CEO",
    company: "Catapult",
    bio: "Former Dean of Instruction at Norco College, authored educational bestseller on career readiness.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/04/Kevin-J-Fleming-200x200-1-200x200-1.webp",
    linkedIn: "https://www.linkedin.com/in/kevinjflemingphd/",
    year: 2023,
    contentType: "interview",
  },
  {
    name: "Marisa Zalabak",
    title: "Founder",
    company: "Open Channel Culture",
    bio: "Educational psychologist with 30+ years expertise, TEDx speaker, IEEE AI ethics co-chair.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/04/Marisa-200x200-1.webp",
    linkedIn: "https://www.linkedin.com/in/marisazalabak/",
    year: 2023,
    contentType: "interview",
  },
  // 2022 Speakers
  {
    name: "Brad Waid",
    title: "Emerging Technology Leader",
    company: "",
    bio: "Top 20 Global Futurist speaker, #14 AR influencer worldwide, expert in VR, AR, AI, and Industry 4.0.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/04/Untitled-design-11-200x200-1.webp",
    linkedIn: "https://www.linkedin.com/in/brad-waid-21187593/",
    year: 2022,
    contentType: "interview",
  },
  {
    name: "Jaime Donally",
    title: "Founder",
    company: "ARVRinEDU",
    bio: "Former math teacher turned instructional technologist, authored two books on immersive learning.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/04/Jaime-image-200x200-1.webp",
    linkedIn: "https://www.linkedin.com/in/jaimedonally/",
    year: 2022,
    contentType: "interview",
  },
  {
    name: "Annette Ethcuit",
    title: "Coach and Mentor",
    company: "",
    bio: "10 years UK Police Service, 5 years corporate analysis, personality and skills specialist.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/04/Annette-200x200-1.webp",
    linkedIn: "https://www.linkedin.com/in/annette-ethcuit-3a070b23b/",
    year: 2022,
    contentType: "webinar",
  },
  {
    name: "Alok Jain",
    title: "Co-founder & CEO",
    company: "Moonpreneur",
    bio: "Serial entrepreneur with extensive EdTech experience, empowers children as innovators.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/05/alok-headshot-200x200-1.webp",
    linkedIn: "https://www.linkedin.com/in/alokkjain/",
    year: 2022,
    contentType: "webinar",
  },
  {
    name: "Brian South",
    title: "College Readiness Coach",
    company: "",
    bio: "Mentors students in essays, interviews, college research. Author of 'Demystifying College Admission'.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/05/Untitled-design-8-200x200-1.webp",
    linkedIn: "https://www.linkedin.com/in/briankeithsouth/",
    year: 2022,
    contentType: "webinar",
  },
  {
    name: "Erin Dowd",
    title: "Educator and Education Consultant",
    company: "",
    bio: "20-year career in education, 2017 ASCD Emerging Leader, worked internationally in Netherlands, US, India, Honduras.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/05/image-2-200x200-1.webp",
    linkedIn: "https://www.linkedin.com/in/erin-dowd-7266b665/",
    year: 2022,
    contentType: "interview",
  },
  {
    name: "PJ Caposey",
    title: "Superintendent",
    company: "Meridian CUSD 223",
    bio: "Award-winning educator, best-selling author of eight books, featured in Washington Post and NPR.",
    image: "https://www.evelynlearning.com/wp-content/uploads/2023/04/Untitled-design-5-200x200-1.webp",
    linkedIn: "https://www.linkedin.com/in/mcusdsupe/",
    year: 2022,
    contentType: "interview",
  },
];

async function seedContent() {
  console.log("🚀 Starting content seeding...\n");

  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB\n");

  // Clear existing data
  await Webinar.deleteMany({});
  await Interview.deleteMany({});
  await Speaker.deleteMany({});
  console.log("🗑️  Cleared existing data\n");

  // Seed webinars
  console.log("📺 Seeding webinars...");
  for (const webinar of webinars) {
    const slug = createSlug(webinar.title);
    await Webinar.create({
      ...webinar,
      slug,
      timezone: "PT",
      duration: "60 minutes",
    });
    console.log(`   ✅ ${webinar.title.substring(0, 50)}...`);
  }
  console.log(`\n📊 Seeded ${webinars.length} webinars\n`);

  // Seed interviews
  console.log("🎤 Seeding interviews...");
  for (const interview of interviews) {
    const slug = createSlug(interview.title);
    const youtubeId = extractYoutubeId(interview.youtubeUrl);
    await Interview.create({
      ...interview,
      slug,
      youtubeId,
    });
    console.log(`   ✅ Episode ${interview.episode}: ${interview.guest.name}`);
  }
  console.log(`\n📊 Seeded ${interviews.length} interviews\n`);

  // Seed speakers
  console.log("🎙️  Seeding speakers...");
  for (const speaker of speakers) {
    const slug = createSlug(speaker.name);
    await Speaker.create({
      ...speaker,
      slug,
    });
    console.log(`   ✅ ${speaker.name}`);
  }
  console.log(`\n📊 Seeded ${speakers.length} speakers\n`);

  await mongoose.disconnect();
  console.log("✅ Content seeding completed!");
}

seedContent().catch(console.error);
