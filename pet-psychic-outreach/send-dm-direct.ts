#!/usr/bin/env node
/**
 * Pet Psychic Instagram DM - Direct URL approach
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
  
  const context = await chromium.launchPersistentContext(
    '/Users/alexismendez/Library/Application Support/Google/Chrome/Profile 1',
    {
      headless: false,
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      viewport: { width: 1280, height: 800 }
    }
  );
  
  const page = await context.newPage();
  
  for (const target of TARGETS) {
    console.log(`\n📧 Messaging @${target.username}...`);
    
    try {
      // Try direct message URL
      await page.goto(`https://instagram.com/direct/t/${target.username}`);
      await sleep(4000);
      
      // Look for message input with multiple selectors
      const selectors = [
        'div[contenteditable="true"]',
        'textarea[placeholder*="Message"]',
        'textarea',
        '[role="textbox"]',
        'div[data-lexical-editor="true"]'
      ];
      
      let msgInput = null;
      for (const selector of selectors) {
        msgInput = await page.$(selector);
        if (msgInput) {
          console.log(`   ✓ Found input: ${selector}`);
          break;
        }
      }
      
      if (!msgInput) {
        // Try going to inbox and searching
        console.log('   Trying inbox approach...');
        await page.goto('https://instagram.com/direct/inbox/');
        await sleep(3000);
        
        // Click New Message button
        const newMsgBtn = await page.$('text=New message, [aria-label="New message"], svg[aria-label="New message"]');
        if (newMsgBtn) {
          await newMsgBtn.click();
          await sleep(2000);
        }
        
        // Search for user
        const searchBox = await page.$('input[type="text"]');
        if (searchBox) {
          await searchBox.fill(target.username);
          await sleep(2000);
        }
        
        // Click on user in results
        const userChip = await page.$(`text=${target.username}`);
        if (userChip) {
          await userChip.click();
          await sleep(1000);
        }
        
        // Click Chat/Next
        const chatBtn = await page.$('text=Chat');
        if (chatBtn) {
          await chatBtn.click();
          await sleep(3000);
        }
        
        // Try finding input again
        for (const selector of selectors) {
          msgInput = await page.$(selector);
          if (msgInput) break;
        }
      }
      
      if (msgInput) {
        const message = generateDM(target);
        await msgInput.fill(message);
        console.log('   ✏️ Message typed');
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
  await context.close();
}

main().catch(console.error);
