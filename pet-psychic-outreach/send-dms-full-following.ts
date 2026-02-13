#!/usr/bin/env node
/**
 * Pet Psychic Instagram DM Automation - Full Following List
 * Scrapes following list, generates copy, sends DMs
 */

import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const WORKSPACE = '/Users/alexismendez/.openclaw/workspace/pet-psychic-outreach';
const LOG_FILE = path.join(WORKSPACE, 'sent-dms.json');

// Pet type detection keywords
const PET_KEYWORDS = {
  'dog': ['dog', 'puppy', 'pup', 'golden', 'retriever', 'pug', 'doodle', 'lab', 'shepherd', 'husky', 'bulldog', 'beagle', '🐕', '🐶'],
  'cat': ['cat', 'kitten', 'kitty', 'meow', 'scottish fold', 'ragdoll', 'persian', 'maine coon', 'siamese', '🐱', '😺', '🐈'],
  'other': ['bunny', 'rabbit', 'hamster', 'guinea pig', 'parrot', 'bird', '🐰', '🦜', '🐹']
};

function detectPetType(bio, name) {
  const text = (bio + ' ' + name).toLowerCase();
  for (const [type, keywords] of Object.entries(PET_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw))) {
      return type;
    }
  }
  return 'pet';
}

function extractPetName(username, displayName, bio) {
  // Try to extract from username (e.g., "phoebe.thescottishfold" -> "Phoebe")
  const usernameParts = username.split(/[._-]/);
  if (usernameParts.length > 1 && usernameParts[0].length > 2) {
    return usernameParts[0].charAt(0).toUpperCase() + usernameParts[0].slice(1);
  }
  
  // Try display name
  if (displayName && displayName.length < 20) {
    const nameParts = displayName.split(/\s+/);
    const firstPart = nameParts[0].replace(/[^a-zA-Z]/g, '');
    if (firstPart.length > 2 && firstPart.length < 15) {
      return firstPart.charAt(0).toUpperCase() + firstPart.slice(1);
    }
  }
  
  // Default to generic
  return 'your pet';
}

function generateDM(target) {
  const petEmojis = { 'dog': '🐕', 'cat': '🐱', 'other': '🐾', 'pet': '🐾' };
  const emoji = petEmojis[target.petType] || '🐾';
  
  let greeting = `Hey! ${emoji}`;
  if (target.ownerName && target.ownerName.length < 20) {
    greeting = `Hey ${target.ownerName}! ${emoji}`;
  }
  
  return `${greeting}

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

async function loadSentLog() {
  try {
    const data = await fs.readFile(LOG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { sent: [], failed: [], lastRun: null };
  }
}

async function saveSentLog(log) {
  await fs.writeFile(LOG_FILE, JSON.stringify(log, null, 2));
}

async function getFollowingList(page) {
  console.log('📋 Fetching following list...');
  
  // Navigate to following page
  await page.goto('https://instagram.com/petpsychicapp/following');
  await sleep(5000);
  
  const accounts = [];
  let previousCount = 0;
  let noChangeCount = 0;
  
  // Scroll and collect accounts
  while (noChangeCount < 3) {
    // Get all visible account links
    const newAccounts = await page.$$eval('a[href^="/"]', links => 
      links
        .filter(l => l.href.match(/instagram\.com\/[^\/]+$/))
        .map(l => ({
          username: l.href.split('/').pop(),
          displayName: l.textContent?.trim() || ''
        }))
        .filter(acc => acc.username && acc.username !== 'petpsychicapp')
    );
    
    // Add new unique accounts
    for (const acc of newAccounts) {
      if (!accounts.find(a => a.username === acc.username)) {
        accounts.push(acc);
      }
    }
    
    if (accounts.length === previousCount) {
      noChangeCount++;
    } else {
      noChangeCount = 0;
      previousCount = accounts.length;
      console.log(`   Found ${accounts.length} accounts...`);
    }
    
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await sleep(1000);
  }
  
  console.log(`✅ Total following: ${accounts.length} accounts\n`);
  return accounts;
}

async function processAccount(page, account, log) {
  // Skip if already sent
  if (log.sent.find(s => s.username === account.username)) {
    console.log(`   ⏭️ Already sent to @${account.username}`);
    return { success: false, reason: 'already_sent' };
  }
  
  try {
    // Navigate to profile
    await page.goto(`https://instagram.com/${account.username}`);
    await sleep(3000);
    
    // Get bio and display name
    const bio = await page.$eval('h1', el => el.textContent || '').catch(() => '');
    const displayName = await page.$eval('header h2', el => el.textContent || '').catch(() => account.displayName);
    
    // Detect pet info
    const petType = detectPetType(bio, account.username);
    const petName = extractPetName(account.username, displayName, bio);
    
    // Extract owner name from display name
    let ownerName = '';
    if (displayName && displayName.includes(' ')) {
      ownerName = displayName.split(' ')[0];
    }
    
    const target = {
      username: account.username,
      petName,
      petType,
      ownerName,
      bio: bio.substring(0, 100)
    };
    
    // Generate message
    const message = generateDM(target);
    
    console.log(`   🐾 ${target.petName} (${target.petType})`);
    console.log(`   📝 ${message.split('\n')[0]}...`);
    
    // Click Message button
    const messageBtn = await page.$('text=Message');
    if (!messageBtn) {
      console.log('   ⚠️ No message button - might need to follow first');
      return { success: false, reason: 'no_message_button' };
    }
    
    await messageBtn.click();
    await sleep(2000);
    
    // Type message
    const textarea = await page.$('textarea[placeholder*="Message"], div[contenteditable="true"]');
    if (!textarea) {
      console.log('   ⚠️ Message input not found');
      return { success: false, reason: 'no_input' };
    }
    
    await textarea.fill(message);
    console.log('   ✏️ Message typed');
    
    // LIVE SEND - Actually send the message
    const sendBtn = await page.$('text=Send');
    if (sendBtn) {
      await sendBtn.click();
      console.log('   ✅ SENT!');
    } else {
      console.log('   ⚠️ Send button not found');
      return { success: false, reason: 'no_send_button' };
    }
    
    // Log as processed
    log.sent.push({
      username: account.username,
      petName,
      petType,
      message: message.substring(0, 100),
      timestamp: new Date().toISOString(),
      dryRun: false
    });
    
    return { success: true };
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    log.failed.push({
      username: account.username,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    return { success: false, reason: error.message };
  }
}

async function main() {
  console.log('🚀 Pet Psychic Instagram DM Automation - Full Following List\n');
  
  const log = await loadSentLog();
  console.log(`📊 Previous runs: ${log.sent.length} sent, ${log.failed.length} failed\n`);
  
  // Launch browser with your Chrome profile
  const userDataDir = '/Users/alexismendez/Library/Application Support/Google/Chrome';
  
  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    viewport: { width: 1280, height: 800 },
    args: ['--profile-directory=Default']
  });
  
  const page = await browser.newPage();
  
  // Check login
  console.log('Checking Instagram login...');
  await page.goto('https://instagram.com');
  await sleep(3000);
  
  const loginBtn = await page.$('button[type="submit"]');
  if (loginBtn) {
    console.log('❌ Not logged in! Please log in manually first.');
    await browser.close();
    return;
  }
  
  console.log('✅ Logged in as PetPsychicApp!\n');
  
  // Get following list
  const following = await getFollowingList(page);
  
  console.log(`🎯 Processing ${following.length} accounts...\n`);
  
  // Process each account
  for (let i = 0; i < following.length; i++) {
    const account = following[i];
    console.log(`\n[${i + 1}/${following.length}] @${account.username}`);
    
    const result = await processAccount(page, account, log);
    await saveSentLog(log);
    
    // Delay between accounts (2-4 minutes)
    if (i < following.length - 1 && result.success) {
      await randomDelay(120, 240);
    }
  }
  
  console.log('\n✅ Done!');
  console.log(`📊 Total: ${log.sent.length} processed (${log.sent.filter(s => !s.dryRun).length} actually sent)`);
  console.log(`❌ Failed: ${log.failed.length}`);
  
  await browser.close();
}

main().catch(console.error);
