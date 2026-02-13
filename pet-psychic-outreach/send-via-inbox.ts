#!/usr/bin/env node
/**
 * Pet Psychic Instagram DM - Via Direct Inbox
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
  console.log('🚀 Starting Instagram DM via Direct Inbox...\n');
  
  const browser = await chromium.launch({
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
  
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  
  // Go to Direct inbox
  console.log('Opening Instagram Direct...');
  await page.goto('https://instagram.com/direct/inbox/');
  await sleep(5000);
  
  // Check if login needed
  const loginBtn = await page.$('button[type="submit"]');
  if (loginBtn) {
    console.log('❌ Please log in as @PetPsychicApp first!');
    await browser.close();
    return;
  }
  
  console.log('✅ Logged in!\n');
  
  // Process each target
  for (const target of TARGETS) {
    console.log(`\n📧 Messaging @${target.username}...`);
    
    try {
      // Click "New message" or compose button
      const newMsgBtn = await page.$('text=New message, svg[aria-label="New message"]');
      if (newMsgBtn) {
        await newMsgBtn.click();
        await sleep(2000);
      }
      
      // Search for user
      const searchInput = await page.$('input[placeholder*="Search"], input[name="queryBox"]');
      if (searchInput) {
        await searchInput.fill(target.username);
        await sleep(2000);
      }
      
      // Click on user result
      const userResult = await page.$(`text=${target.username}`);
      if (userResult) {
        await userResult.click();
        await sleep(1000);
      }
      
      // Click Next/Chat
      const nextBtn = await page.$('text=Next, text=Chat');
      if (nextBtn) {
        await nextBtn.click();
        await sleep(2000);
      }
      
      // Type and send message
      const message = generateDM(target);
      const msgInput = await page.$('div[contenteditable="true"], textarea[placeholder*="Message"]');
      
      if (msgInput) {
        await msgInput.fill(message);
        await sleep(1000);
        
        // Press Enter to send
        await msgInput.press('Enter');
        console.log('   ✅ SENT!');
      } else {
        console.log('   ⚠️ Could not find message input');
      }
      
      // Wait before next
      console.log('   ⏳ Waiting 3 minutes...');
      await sleep(180000);
      
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
    }
  }
  
  console.log('\n✅ All done!');
  await browser.close();
}

main().catch(console.error);
