import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/evelyn';
  console.log('Connecting to:', uri.replace(/:[^:@]+@/, ':****@'));
  await mongoose.connect(uri);
  
  // Check Prospect scraped data
  const prospect = await mongoose.connection.db.collection('prospects').findOne({ 
    slug: 'south-florida-homeschool-resource-center' 
  });
  
  console.log('\n=== PROSPECT SCRAPED DATA ===');
  console.log('Name:', prospect?.instituteName);
  console.log('Website:', prospect?.website);
  if (prospect?.scrapedData) {
    const sd = prospect.scrapedData;
    console.log('Business Name:', sd.businessName);
    console.log('Tagline:', sd.tagline);
    console.log('Description:', sd.description);
    console.log('Services:', sd.services);
    console.log('Programs:', sd.programs?.length, 'found');
    console.log('Team:', sd.team?.length, 'found');
    console.log('Testimonials:', sd.testimonials?.length, 'found');
    console.log('Images:', sd.images?.length, 'found');
    console.log('Logo URL:', sd.logoUrl);
    console.log('Hero Image:', sd.heroImageUrl);
    console.log('Colors:', sd.primaryColor, sd.secondaryColor, sd.accentColor);
    console.log('Stats:', JSON.stringify(sd.stats));
    console.log('Pages Scraped:', sd.pagesScraped);
    console.log('Scrape Quality:', sd.scrapeQuality);
  } else {
    console.log('NO SCRAPED DATA!');
  }
  
  // Check ShowcaseSite
  const showcase = await mongoose.connection.db.collection('showcasesites').findOne({ 
    slug: 'south-florida-homeschool-resource-center' 
  });
  
  console.log('\n=== SHOWCASE SITE DATA ===');
  if (showcase) {
    console.log('Name:', showcase.name);
    console.log('Tagline:', showcase.tagline);
    console.log('Description:', showcase.description?.substring(0, 100));
    console.log('Branding:', JSON.stringify(showcase.branding));
    console.log('Programs:', showcase.programs?.length, 'items');
    console.log('Team:', showcase.team?.length, 'members');
    console.log('Testimonials:', showcase.testimonials?.length, 'items');
    console.log('Images:', showcase.images?.length, 'items');
    console.log('Stats:', showcase.stats?.length, 'items');
    console.log('Social:', JSON.stringify(showcase.social));
    console.log('NavItems:', showcase.navItems?.length, 'items');
    
    // Show actual data
    console.log('\n--- Programs Detail ---');
    console.log(JSON.stringify(showcase.programs, null, 2));
    console.log('\n--- Team Detail ---');
    console.log(JSON.stringify(showcase.team, null, 2));
  } else {
    console.log('NO SHOWCASE SITE FOUND!');
  }
  
  await mongoose.disconnect();
}

main().catch(console.error);
