#!/usr/bin/env node
/**
 * Pet Psychic Instagram DM Automation
 * Standalone script using Playwright
 */

import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const TARGETS = [
  { username: 'phoebe.thescottishfold', petName: 'Phoebe', petType: 'Scottish Fold', ownerName: 'Samantha' },
  { username: 'goldenchilidog', petName: 'Chili', petType: 'Golden Retriever', ownerName: '' },
  { username: 'rukasthecat', petName: 'Rukas', petType: 'Cat', ownerName: '' },
  { username: 'max_doodleofwhoville', petName: 'Max', petType: 'Doodle', ownerName: '' },
  { username: '_that_pug_penny', petName: 'Penny', petType: 'Pug', ownerName: '' }
];

function generateDM(target) {
  const name = target.ownerName || target.username.split('_')[0];
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  
  const petEmojis = {
    'Scottish Fold': '🐱',
    'Golden Retriever': '🐕',
    'Cat': '😺',
    'Doodle': '🐩',
    'Pug': '🐶'
  };
  
  const emoji = petEmojis[target.petType] || '🐾';
  
  return `Hey ${capitalizedName}! ${emoji}

${target.petName} is absolutely adorable! I love your content.

I run a fun pet psychic service where I do playful "readings" for pets - kind of like a personality analysis based on their vibe and photos. I did one for ${target.petName} and got some hilarious insights!

Would love to share the reading with you (and feature ${target.petName} with your permission). No cost, just for fun!

Let me know if you're interested ${emoji}`;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function randomDelay(minSec, maxSec) {
  const delay = Math.floor(Math.random() * (maxSec - minSec + 1) + minSec) * 1000;
  console.log(`⏳ Waiting ${delay/1000}s...`);
  await sleep(delay);
}

async function main() {
  console.log('🚀 Pet Psychic Instagram DM Automation\n');
  console.log('Make sure you are logged into Instagram as @PetPsychicApp in Chrome!\n');
  
  // Launch browser with your Chrome profile (where PetPsychicApp is logged in)
  const userDataDir = '/Users/alexismendez/Library/Application Support/Google/Chrome';
  
  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    viewport: { width: 1280, height: 800 },
    args: ['--profile-directory=Default']
  });
  
  const page = await context.newPage();
  
  // First check if we're logged in
  console.log('Checking Instagram login status...');
  await page.goto('https://instagram.com');
  await sleep(3000);
  
  // Check if login button exists (means not logged in)
  const loginButton = await page.$('button[type="submit"]');
  if (loginButton) {
    console.log('❌ Not logged in! Please log in manually first.');
    await browser.close();
    return;
  }
  
  console.log('✅ Logged in as PetPsychicApp!\n');
  
  // Process each target
  for (let i = 0; i < TARGETS.length; i++) {
    const target = TARGETS[i];
    console.log(`\n[${i + 1}/${TARGETS.length}] Processing @${target.username}...`);
    
    try {
      // Navigate to profile
      await page.goto(`https://instagram.com/${target.username}`);
      await sleep(3000);
      
      // Click Message button
      const messageButton = await page.$('text=Message');
      if (!messageButton) {
        console.log('   ⚠️ No Message button found - might be private/follow required');
        continue;
      }
      
      await messageButton.click();
      await sleep(2000);
      
      // Type message
      const message = generateDM(target);
      const textarea = await page.$('textarea[placeholder*="Message"]');
      if (!textarea) {
        console.log('   ⚠️ Message input not found');
        continue;
      }
      
      await textarea.fill(message);
      console.log('   📝 Message typed');
      console.log(`   ${message.split('\n')[0]}...`);
      
      // Ask for confirmation (for testing)
      console.log('   ⚠️ Dry run mode - not sending (remove this check to actually send)');
      
      // Uncomment below to actually send:
      // const sendButton = await page.$('text=Send');
      // await sendButton?.click();
      // console.log('   ✅ Message sent!');
      
      // Wait before next
      if (i < TARGETS.length - 1) {
        await randomDelay(120, 180); // 2-3 minutes
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n✅ Automation complete!');
  await browser.close();
}

main().catch(console.error);
