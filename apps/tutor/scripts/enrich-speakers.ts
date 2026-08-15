/**
 * Enrich speaker bios with more detailed information.
 * Only updates if the new bio is substantially longer than the existing one.
 *
 * Usage: npx tsx scripts/enrich-speakers.ts
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

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
  contentType: {
    type: String,
    enum: ["webinar", "interview", "both"],
    default: "webinar",
  },
  contentUrl: String,
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const Speaker = mongoose.models.Speaker || mongoose.model("Speaker", SpeakerSchema);

// Enriched bios keyed by slug
const enrichedBios: Record<string, string> = {
  "audrika-thakuria": `Audrika Thakuria is an educator and EdTech visionary with a Master of Science in International Educational Development from the University of Pennsylvania, where she earned a prestigious Merit Scholarship. She served as a UNESCO consultant and played a pivotal role in crafting EdTech policies for 46 countries, with a specific focus on equipping teachers with digital skills during the pandemic.

Currently, Audrika leads the Delta Careers division at Crimson Education, where she spearheads the use of technology to prepare high school students for the dynamic corporate world. Delta Careers partners with top companies to offer immersive, real-world projects that help students gain industry exposure, develop critical skills, and build their professional portfolios. Her dedication to integrating AI technology into cutting-edge online modules is matched by her commitment to managing a fully remote global team whose upskilling remains a top priority.`,

  "ellen-prescott-ph-d-pmp": `Ellen Prescott, Ph.D., PMP, is an Instructional Designer at the California Institute of Integral Studies (CIIS) in San Francisco, where she creates dynamic, context-rich Canvas courses that engage and inspire diverse learners. With more than 15 years of expertise in instructional design, she brings deep experience in adult learning theory, accessibility best practices, and learner-centered course development.

Her work focuses on crafting inclusive digital learning environments that meet the needs of students from a wide range of backgrounds and learning styles. Ellen holds a Ph.D. and a Project Management Professional (PMP) certification, which she applies to managing complex course development projects from design through delivery.`,

  "humberto-hernandez": `Humberto Hernandez is a Colombo-American educator and technologist with more than 10 years of experience in EdTech. A certified Front-End Web Developer, he brings a unique perspective to the intersection of technology and inclusive education, advocating for accessibility and universal design in digital learning environments.

Humberto is passionate about ensuring that educational technology serves all learners, regardless of ability or background. He hosts the AI in Education podcast and works as an instructional designer who balances innovation with inclusive, ethical, and equitable teaching practices. His work centers on removing barriers to learning through thoughtful digital design and accessible content creation.`,

  "corey-seemiller-ph-d": `Dr. Corey Seemiller is an award-winning faculty member in the Department of Leadership Studies in Education and Organizations at Wright State University. She earned her Bachelor's degree in Communication from Arizona State University, a Master's in Educational Leadership from Northern Arizona University, and a Ph.D. in Higher Education from the University of Arizona.

Dr. Seemiller has been at the forefront of research and publishing about Generation Z since the generation began entering college. She has released six books on the topic, including her latest, Generation Z Leads, which highlights strategies for developing the leadership capacities of Gen Z students. She and her research partner are among the most-cited Gen Z researchers in the world, having secured research teams from 31 countries and gathered responses from more than 21,000 participants in 81 nations — making it the largest and most comprehensive Gen Z study of its kind.

Her TED Talk has been viewed more than 250,000 times, and her work has been featured on NPR and in The New York Times, Time Magazine, and Newsweek.`,

  "chris-mackey": `Chris Mackey is the Co-founder of Skillsline, a mobile-first learning platform that teaches students the career-ready essential skills employers desire but schools rarely have the time to teach. Before founding Skillsline, Chris served as Vice President and General Manager of the Myers-Briggs Innovation Labs, where he led the development and marketing of award-winning software products.

Chris holds an MBA from Pepperdine University's Graziadio School of Business and Management and graduated from Indiana University as a Wells Scholar. At Skillsline, he focuses on modernizing essential soft-skill delivery through an engaging platform that helps students in community colleges and high schools develop the transferable, non-technical skills they need for career, academic, and life success. Skillsline has partnered with the National Association for Community College Entrepreneurship (NACCE) to expand career-readiness programming nationally.`,

  "rebecca-roese": `Rebecca Roese is a Curriculum Management Director at 2U/edX, the leading global online learning platform that provides over 45 million learners with access to world-class education in partnership with more than 230 colleges, universities, and corporations. She brings more than 15 years of experience in higher education with deep expertise in adult learning, curriculum design, and distance learning.

Prior to 2U, Rebecca served as Program Manager for CQI Curriculum at Western Governors University, where she applied program management methodologies to enhance educational programs. Her skill set spans curriculum development, instructional design, and the strategic management of online learning programs at scale.`,

  "aditya-agarkar": `Aditya Agarkar is the Co-founder and former VP of Product Development at Edulastic, a K-12 assessment platform that grew to serve more than 10 million users before being acquired by GoGuardian. With over 30 years of experience in the software industry, he was instrumental in building Edulastic from the ground up into one of the leading formative assessment tools for K-12 education.

Before Edulastic, Aditya co-founded Snapwiz and served as Director of Product Strategy at Oracle. Under his leadership, Edulastic became one of the first assessment platforms to integrate with Clever Library, and teachers using the Clever integration showed significantly higher engagement with the platform's online assessment tools. He continues to contribute to the EdTech ecosystem as an investor and advisor to educational technology ventures.`,

  "keith-wakeman": `Keith Wakeman is the CEO and Co-Founder of SuperBetter, a digital education and mental wellbeing company recognized by the World Economic Forum as one of 14 top innovators globally in youth mental health. Through its innovative Live Gamefully methodology, SuperBetter harnesses the psychology of gameplay to empower individuals and groups to build cognitive resilience and achieve their goals.

Keith began his career in the U.S. food industry, where he led brand management, innovation, and new venture development for top-tier companies including Kellogg, Keebler, and Nabisco, overseeing the launch of over a billion dollars worth of new health-focused products. He holds a marketing degree from Illinois State University and an MBA from the University of Illinois at Chicago. SuperBetter has impacted over one million people worldwide, with a published Penn research trial showing that 10 minutes of daily use was associated with a 49% reduction in depression symptoms and a 61% reduction in anxiety symptoms over just six weeks.`,

  "stuart-draper": `Stuart Draper is the Founder and CEO of Stukent, a digital courseware and simulation company that serves thousands of higher education and high school institutions globally. He co-authored the bestselling digital courseware Digital Marketing Essentials and has grown Stukent from a startup in 2013 to a team of more than 100 members.

Before founding Stukent, Stuart successfully bootstrapped GetFoundFirst.com, a digital marketing agency that was acquired in December 2015. He is a five-time Inc. 5000 honoree, with Stukent ranking as high as #264 on the list of fastest-growing private companies in America. Stuart is also the founder of CharityFast.org, demonstrating his commitment to giving back alongside building innovative educational products. His focus areas include education, AI, and providing students with hands-on digital marketing experience through industry-leading simulations.`,

  "martine-holland": `Martine Holland is the Head of Assessment at Bedrock Learning, a UK-based educational technology company that provides a vocabulary and literacy curriculum used by schools across the United Kingdom. In her role, she collaborates with Cambridge University and leading reading researchers to create effective assessment frameworks that measure student progress in literacy.

Before joining Bedrock, Martine served as a senior assessment specialist for IELTS, one of the world's most widely recognized English language proficiency tests. She has published research on pandemic-era remote learning and the role of AI in education, bringing a scholarly perspective to assessment design. Her expertise spans language assessment, educational measurement, and the thoughtful integration of technology into learning evaluation.`,

  "annette-ethcuit": `Annette Ethcuit is a coach and mentor who brings a distinctive interdisciplinary background to her work in education and personal development. She spent 10 years in the UK Police Service followed by 5 years in corporate analysis, experiences that honed her skills in understanding human behavior, communication, and organizational dynamics.

Now focused on coaching and mentoring, Annette specializes in personality assessment and skills development, helping individuals identify their strengths and unlock their potential. Her unique combination of law enforcement, corporate, and coaching experience gives her a practical, evidence-based approach to personal and professional growth.`,

  "lauralyn-vasquez": `Lauralyn Vasquez is the Director of Operations and Educational Services at Beyond Technology Education (now BeyondK12), where she leads initiatives to bring technology education and digital citizenship programs to K-12 schools and districts. She is a motivational speaker passionate about healthy digital citizenship and safety, and ensuring that everyone has the digital literacy skills they need for success.

Lauralyn holds a BA in Sociology, a Certificate in Leadership and Spiritual Direction, and a Master's in Teaching and Learning with Technology. While in college, she sold her car to purchase a computer after discovering the transformative power of technology — a moment that crystallized her belief that getting the right technology and instruction into learners' hands would be a significant game changer in their academics and lives. Beyond her EdTech work, she also serves as Secondary Chaplain and middle school Bible teacher at Rancho Christian School in Temecula, California.`,

  "john-thompson-haas": `John Thompson-Haas is the Managing Director for Client Services at Beyond Academics, where he leads consulting engagements that help innovative university presidents and their leadership teams create real institutional transformation. With more than 25 years of experience in education technology, he has led some of the largest and most complex Student Information System (SIS) implementations in the United States.

John has been dedicated to the higher education space for over 30 years, serving in roles spanning faculty, system implementer, strategist, and now consulting leader. His deep expertise in the intersection of technology infrastructure and institutional strategy makes him a sought-after voice on how universities can leverage technology to become more student-centric and operationally effective.`,

  "kevin-j-fleming-ph-d": `Dr. Kevin J. Fleming is the Founder and CEO of Catapult, where he is redefining professional development through dynamic masterclasses curated for K-16 institutions. He previously served as a college Vice President and as Dean of Instruction for Career and Technical Education at Norco College, where he supported more than 40 CTE programs and multiple state and federal grants.

Dr. Fleming holds two Bachelor's degrees from Loyola Marymount University (Psychology and Philosophy), a Master of Arts from The Ohio State University (Educational Policy and Leadership), an MBA from the University of Redlands, and a Ph.D. in Education from Claremont Graduate University. He has secured and managed over $93 million in competitive grants to increase economic and educational opportunity. He is the author of the bestseller (Re)Defining the Goal: The True Path to Career Readiness in the 21st Century, along with several other books including Maintaining Strategic Relevance and Words are Your Superpower. He has been honored with the Presidential Citation for Outstanding Achievement and Service from Loyola Marymount University.`,

  "marisa-zalabak": `Marisa Zalabak is the Founder of Open Channel Culture, a TEDx and global keynote speaker, author, educational psychologist, equity advisor, and AI ethicist. She has spent more than 30 years developing expertise in organizational culture, leadership coaching, and the ethical dimensions of emerging technology. She holds a Master's degree in Educational Psychology from Hunter College.

Marisa currently serves with IEEE.org as Co-Chair of the AI Ethics Education committee and as Chair of the Global Methodologies committee for the Planet Positive 2030 climate and technology initiative, Strong Sustainability by Design. She is a contributing author to several IEEE recommended standards for AI design and practices related to human well-being, including standards for smart cities and the use of emulated emotions in AI systems. Her two TEDx talks — "Regenerative Imagination & Climate Repair" and "Educational Fire Drills for Flourishing" — reflect her wide-ranging expertise in adaptive leadership, social-emotional-creative intelligences, AI ethics, conflict resolution, social justice, and organizational culture.`,

  "alok-jain": `Alok Jain is the Co-Founder and CEO of Moonpreneur Inc, an EdTech startup focused on tech entrepreneurship for children. A serial entrepreneur and IIT alumnus based in the Bay Area, Alok has founded four successful companies and brings extensive experience in building and scaling technology businesses.

Moonpreneur (formerly Moonshot Junior) addresses a gap in K-12 education by kindling an innovative and entrepreneurial spirit in children and using the business process to teach them vital life skills. Alok started this approach in 2020 by coaching his 13-year-old daughter to successfully launch a business, and the model has since scaled into a comprehensive platform offering programs in robotics, coding, advanced math, IoT, app development, and more. Moonpreneur has grown into one of the fastest-growing EdTech companies in Silicon Valley, empowering the next generation of innovators and entrepreneurs.`,

  "brian-south": `Brian South is a College Readiness Coach, author, and passionate advocate for student success based in Sacramento, California. He mentors students in college entrance essays, admission interviews, and college research, and provides invaluable assistance in sourcing college funding for students.

Brian is the author of Demystifying College Admission: Learn Key Strategies and Develop the Right Mindset to Get into the College of Your Choice, which became an Amazon #1 bestseller in multiple categories on its first day of pre-sale. The book covers self-development strategies, organizational skills, essay writing and interview tips, the college application process, resources for nontraditional students, funding options, and preparation for the age of artificial intelligence and distance learning. He passionately shares his training and certification in education, coaching, financial literacy, neuroscience, and sales to help students open the door to the college of their choice.`,

  "brad-waid": `Brad Waid is an award-winning Emerging Technology Leader, international keynote speaker, global influencer, and futurist from Michigan. Recognized as the #14 Global Influencer in Augmented Reality by Onalytica and one of the top 20 Global Futurist and Keynote Speakers by TAFFD, he brings 14 years of classroom experience and a deep understanding of how emerging technologies are transforming education and the workforce.

Brad specializes in AR, VR, XR, Machine Learning, Artificial Intelligence, and Industry 4.0, and has spoken internationally in England, Germany, Hong Kong, Malaysia, New Zealand, Ireland, Australia, and more. He was awarded the "20 to Watch" by the National School Board Association in 2013 and serves as COO and Director of Emerging Technologies for The Digital Citizenship Institute. His keynote topics include "Racing the Future: The Rise of AI and Other Smart Technologies," "Industry 4.0: The Future of Work, Innovation, and Technology," and "Through the Looking Glass: Navigating the Next 10 Years of Innovation."`,

  "jaime-donally": `Jaime Donally is the founder of ARVRinEDU and Global Maker Day, and an author, speaker, and independent consultant specializing in immersive learning technologies. She began her career as a math teacher before moving into instructional technology, where she discovered the transformative potential of augmented and virtual reality in the classroom.

Jaime has authored two books on immersive learning and provides staff development and training on AR/VR technology integration for schools and districts. She co-organized the first Global Maker Day in 2016 alongside seven colleagues, building an international community of educators collaborating with students around the world. Her work focuses on making immersive technology practical and accessible for everyday classroom use, helping educators move beyond the novelty factor to create meaningful learning experiences with AR and VR.`,

  "erin-dowd": `Erin Dowd is an educator, global education consultant, writer, and presenter with nearly two decades of experience in education. Named a 2017 ASCD Emerging Leader, she has worked internationally as a classroom teacher and curriculum director in the Netherlands, the United States, India, and Honduras, dedicating her career to providing equitable education for students around the world.

Erin holds a Master's degree in Global and International Education from Drexel University and is the founder of JRNEY.org, a website dedicated to amplifying the voices of teachers through global stories from the field. She presents frequently at major conferences including ISTE, ASCD Empower, and AFS on global education topics. Currently, Erin serves as a Senior Program Manager at the International Society for Technology in Education (ISTE), where she brings her expertise in global education and curriculum innovation to advance technology-driven learning.`,

  "pj-caposey": `PJ Caposey is the Superintendent of Oregon CUSD 220 and former leader of Meridian CUSD 223, where he was named Illinois' 2022 State Superintendent of the Year and a national finalist for AASA's top honor. He began his career as an award-winning teacher in the inner city of Chicago and has subsequently led significant change in every administrative post he has held.

PJ is a best-selling author of ten books on education leadership and a sought-after keynote speaker and consultant whose expertise spans leadership, school culture, equity, and continuous improvement. His districts have earned national recognition for governance, academic achievement, innovation, and performance excellence, including the 2024 Partners for Excellence Gold Distinction — the first awarded in over two decades. His commentary has appeared in The Washington Post, NPR, and CBS This Morning. Outside of his full-time leadership in public schools, PJ has shaped the field through extensive work in higher education, serving in educational leadership departments of five universities and helping design and launch Illinois' first full suite of MicroCredentials.`,
};

async function enrichSpeakers() {
  console.log("Starting speaker bio enrichment...\n");

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB\n");

  let updated = 0;
  let skipped = 0;

  for (const [slug, newBio] of Object.entries(enrichedBios)) {
    const speaker = await Speaker.findOne({ slug });

    if (!speaker) {
      console.log(`  SKIP: No speaker found with slug "${slug}"`);
      skipped++;
      continue;
    }

    const existingLength = speaker.bio?.length || 0;
    const newLength = newBio.length;

    // Only update if new bio is substantially longer (at least 50% longer)
    if (newLength <= existingLength * 1.5) {
      console.log(
        `  SKIP: "${speaker.name}" — existing bio (${existingLength} chars) is already close to new bio (${newLength} chars)`
      );
      skipped++;
      continue;
    }

    await Speaker.updateOne({ slug }, { $set: { bio: newBio } });
    console.log(
      `  UPDATED: "${speaker.name}" — ${existingLength} chars -> ${newLength} chars`
    );
    updated++;
  }

  console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

enrichSpeakers().catch(console.error);
