#!/usr/bin/env node
/**
 * Pet Psychic Instagram DM - Quick Send (5 accounts)
 */

import { chromium } from 'playwright';

const TARGETS = [
  { username: 'phoebe.thescottishfold', petName: 'Phoebe', petType: 'cat', ownerName: 'Samantha' },
  { username: 'goldenchilidog', petName: 'Chili', petType: 'dog', ownerName: '' },
  { username: 'rukasthecat', petName: 'Rukas', petType: 'cat', ownerName: '' },
  { username: 'max_doodleofwhoville', petName: 'Max', petType: 'dog', ownerName: '' },
  { username: '_that_pug_penny', petName: 'Penny', petType: 'dog', ownerName: '' }
];

function generateDM(target) {
  const petEmojis = { 'dog': '🐕', 'cat': '🐱' };
  const emoji = petEmojis[target.petType] || '🐾';
  const greeting = target.ownerName ? `Hey ${target.ownerName}! ${emoji}` : `Hey! ${emoji}`;
  
  return `${greeting}

${target.petName} is absolutely adorable! I love your content.

I run a fun pet psychic service where I do playful "readings" for pets - kind of like a personality analysis based on their vibe and photos. I did one for ${target.petName} and got some hilarious insights!

Would love to share the reading with you (and feature ${target.petName} with your permission). No cost, just for fun!

Let me know if you're interested ${emoji}`;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🚀 Starting Instagram DM automation...\n');
  
  // Launch browser with Pet Psychic profile (Profile 1)
  const context = await chromium.launchPersistentContext(
    '/Users/alexismendez/Library/Application Support/Google/Chrome/Profile 1',
    {
      headless: false,
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      viewport: { width: 1280, height: 800 }
    }
  );
  const page = await context.newPage();
  
  // Go to Instagram
  console.log('Opening Instagram...');
  await page.goto('https://instagram.com');
  await sleep(5000);
  
  // Check if login needed
  const loginBtn = await page.$('button[type="submit"]');
  if (loginBtn) {
    console.log('❌ Please log in as @PetPsychicApp first!');
    await context.close();
    return;
  }
  
  console.log('✅ Logged in!\n');
  
  // Send DMs
  for (const target of TARGETS) {
    console.log(`\n📧 Messaging @${target.username}...`);
    
    try {
      // Go to profile
      await page.goto(`https://instagram.com/${target.username}`);
      await sleep(3000);
      
      // Click Message
      const msgBtn = await page.$('text=Message');
      if (!msgBtn) {
        console.log('   ⚠️ No message button');
        continue;
      }
      await msgBtn.click();
      await sleep(2000);
      
      // Type message
      const message = generateDM(target);
      const textarea = await page.$('textarea[placeholder*="Message"], div[contenteditable="true"]');
      if (!textarea) {
        console.log('   ⚠️ No message input');
        continue;
      }
      
      await textarea.fill(message);
      console.log('   ✏️ Message typed');
      
      // Send
      const sendBtn = await page.$('text=Send');
      if (sendBtn) {
        await sendBtn.click();
        console.log('   ✅ SENT!');
      }
      
      // Wait 3 minutes
      console.log('   ⏳ Waiting 3 minutes...');
      await sleep(180000);
      
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
    }
  }
  
  console.log('\n✅ All done!');
  await context.close();
}

main().catch(console.error);
