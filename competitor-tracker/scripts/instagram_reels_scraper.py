#!/usr/bin/env python3
"""
Instagram Reels Scraper
Uses instaloader library for reliable Instagram data extraction.
Focuses on reels posted in the last 7 days with full engagement metrics.
"""

import json
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any

# Add venv to path
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
VENV_SITE_PACKAGES = PROJECT_DIR / ".venv" / "lib"

# Find the Python version directory
for p in VENV_SITE_PACKAGES.glob("python*/site-packages"):
    sys.path.insert(0, str(p))

try:
    import instaloader
    INSTALOADER_AVAILABLE = True
except ImportError:
    INSTALOADER_AVAILABLE = False

CONFIG_FILE = PROJECT_DIR / "config" / "accounts.json"
DATA_DIR = PROJECT_DIR / "data"
LOG_DIR = PROJECT_DIR / "logs"
TIMESTAMP = datetime.now().strftime('%Y-%m-%d_%H%M%S')
DATE_ONLY = datetime.now().strftime('%Y-%m-%d')

# Ensure directories exist
(DATA_DIR / "instagram").mkdir(parents=True, exist_ok=True)
LOG_DIR.mkdir(parents=True, exist_ok=True)

def log(message: str):
    """Log message to file and stdout"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_line = f"[{timestamp}] {message}"
    print(log_line)
    with open(LOG_DIR / f"instagram_{DATE_ONLY}.log", 'a') as f:
        f.write(log_line + '\n')

def load_config() -> Dict:
    """Load configuration from accounts.json"""
    with open(CONFIG_FILE) as f:
        return json.load(f)

def calculate_engagement_score(views: int, likes: int, comments: int) -> float:
    """Calculate engagement score using views * likes * comments formula"""
    v = max(views, 1)
    l = max(likes, 1)
    c = max(comments, 1)
    return v * l * c

def scrape_reels_with_instaloader(accounts: List[Dict], lookback_days: int = 7) -> List[Dict]:
    """
    Scrape reels using instaloader.
    Note: Instaloader works best for public profiles. For full metrics, login may be required.
    """
    if not INSTALOADER_AVAILABLE:
        log("⚠ instaloader not available. Run: cd project && source .venv/bin/activate && pip install instaloader")
        return []
    
    all_reels = []
    cutoff_date = datetime.now() - timedelta(days=lookback_days)
    
    # Create instaloader instance with rate limiting
    L = instaloader.Instaloader(
        download_pictures=False,
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        compress_json=False,
        quiet=True,
        user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    
    for account in accounts:
        handle = account['handle']
        name = account['name']
        log(f"Processing @{handle} ({name})...")
        
        try:
            # Get profile
            profile = instaloader.Profile.from_username(L.context, handle)
            
            log(f"  Profile loaded: {profile.followers} followers")
            
            # Get posts (including reels)
            reel_count = 0
            post_count = 0
            
            for post in profile.get_posts():
                post_count += 1
                
                # Limit to avoid rate limiting
                if post_count > 50:
                    break
                
                # Check date
                if post.date_utc < cutoff_date.replace(tzinfo=post.date_utc.tzinfo):
                    continue
                
                # Check if it's a video/reel (is_video property)
                if not post.is_video:
                    continue
                
                reel_count += 1
                
                views = post.video_view_count or 0
                likes = post.likes or 0
                comments = post.comments or 0
                
                # Build caption (title)
                caption = post.caption if post.caption else ""
                title = caption[:100] + "..." if len(caption) > 100 else caption
                title = title.split('\n')[0] if title else "Untitled Reel"
                
                reel = {
                    'id': post.shortcode,
                    'url': f"https://www.instagram.com/reel/{post.shortcode}/",
                    'title': title,
                    'description': caption[:500] if caption else "",
                    'caption': caption,
                    'views': views,
                    'likes': likes,
                    'comments': comments,
                    'duration': post.video_duration or 0,
                    'upload_date': post.date_utc.strftime('%Y-%m-%d'),
                    'upload_timestamp': post.date_utc.isoformat(),
                    'publisher': {
                        'handle': handle,
                        'name': name,
                        'profile_url': f"https://www.instagram.com/{handle}/",
                        'followers': profile.followers
                    },
                    'engagement_score': calculate_engagement_score(views, likes, comments),
                    'thumbnail': post.url,
                    'source': 'instaloader'
                }
                all_reels.append(reel)
                log(f"  → Found reel: {title[:40]}... ({views} views, {likes} likes)")
            
            log(f"  ✓ Collected {reel_count} reels from @{handle}")
            
        except instaloader.exceptions.ProfileNotExistsException:
            log(f"  ✗ Profile @{handle} not found")
        except instaloader.exceptions.PrivateProfileNotFollowedException:
            log(f"  ✗ Profile @{handle} is private")
        except instaloader.exceptions.LoginRequiredException:
            log(f"  ⚠ Login required for @{handle} - marking for manual review")
            # Add placeholder for manual review
            all_reels.append({
                'id': f'{handle}_placeholder',
                'url': f"https://www.instagram.com/{handle}/reels/",
                'title': 'Requires manual review (login required)',
                'description': 'Instagram requires login to access this profile.',
                'caption': '',
                'views': 0,
                'likes': 0,
                'comments': 0,
                'duration': 0,
                'upload_date': datetime.now().strftime('%Y-%m-%d'),
                'upload_timestamp': datetime.now().isoformat(),
                'publisher': {
                    'handle': handle,
                    'name': name,
                    'profile_url': f"https://www.instagram.com/{handle}/"
                },
                'engagement_score': 0,
                'thumbnail': '',
                'source': 'manual_review_needed',
                'status': 'pending_manual_review'
            })
        except instaloader.exceptions.ConnectionException as e:
            log(f"  ✗ Connection error for @{handle}: {str(e)[:50]}")
        except instaloader.exceptions.QueryReturnedBadRequestException:
            log(f"  ⚠ Rate limited or blocked for @{handle}")
            time.sleep(60)  # Wait a minute before continuing
        except Exception as e:
            log(f"  ✗ Error for @{handle}: {type(e).__name__}: {str(e)[:50]}")
        
        # Rate limiting between accounts
        time.sleep(5)
    
    return all_reels

def scrape_reels_fallback(accounts: List[Dict], lookback_days: int = 7) -> List[Dict]:
    """
    Fallback scraping using basic HTTP requests.
    Limited data available but works without authentication.
    """
    import urllib.request
    import urllib.error
    import re
    
    all_reels = []
    
    for account in accounts:
        handle = account['handle']
        name = account['name']
        log(f"Processing @{handle} ({name}) [fallback method]...")
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            }
            
            req = urllib.request.Request(
                f"https://www.instagram.com/{handle}/",
                headers=headers
            )
            
            with urllib.request.urlopen(req, timeout=15) as response:
                html = response.read().decode('utf-8')
                
                # Try to extract basic profile info
                follower_match = re.search(r'"edge_followed_by":\s*{\s*"count":\s*(\d+)', html)
                followers = int(follower_match.group(1)) if follower_match else 0
                
                # Add placeholder with whatever data we got
                all_reels.append({
                    'id': f'{handle}_profile',
                    'url': f"https://www.instagram.com/{handle}/reels/",
                    'title': f'Profile found - {followers} followers',
                    'description': 'Basic profile data extracted. View reels manually for engagement metrics.',
                    'caption': '',
                    'views': 0,
                    'likes': 0,
                    'comments': 0,
                    'duration': 0,
                    'upload_date': datetime.now().strftime('%Y-%m-%d'),
                    'upload_timestamp': datetime.now().isoformat(),
                    'publisher': {
                        'handle': handle,
                        'name': name,
                        'profile_url': f"https://www.instagram.com/{handle}/",
                        'followers': followers
                    },
                    'engagement_score': 0,
                    'thumbnail': '',
                    'source': 'web_fallback',
                    'status': 'partial_data'
                })
                
                log(f"  → Basic data extracted ({followers} followers)")
                
        except Exception as e:
            log(f"  ✗ Fallback failed for @{handle}: {str(e)[:40]}")
            all_reels.append({
                'id': f'{handle}_failed',
                'url': f"https://www.instagram.com/{handle}/reels/",
                'title': 'Data unavailable - needs manual review',
                'description': f'Could not extract data: {str(e)[:100]}',
                'caption': '',
                'views': 0,
                'likes': 0,
                'comments': 0,
                'duration': 0,
                'upload_date': datetime.now().strftime('%Y-%m-%d'),
                'upload_timestamp': datetime.now().isoformat(),
                'publisher': {
                    'handle': handle,
                    'name': name,
                    'profile_url': f"https://www.instagram.com/{handle}/"
                },
                'engagement_score': 0,
                'thumbnail': '',
                'source': 'manual_review_needed',
                'status': 'pending_manual_review'
            })
        
        time.sleep(3)
    
    return all_reels

def save_results(all_reels: List[Dict], config: Dict):
    """Save scraped reels data to JSON files"""
    
    # Save individual account data
    accounts_data = {}
    for reel in all_reels:
        handle = reel['publisher']['handle']
        if handle not in accounts_data:
            accounts_data[handle] = {
                'handle': handle,
                'name': reel['publisher']['name'],
                'profile_url': reel['publisher']['profile_url'],
                'timestamp': TIMESTAMP,
                'reels': []
            }
        accounts_data[handle]['reels'].append(reel)
    
    # Save per-account files
    for handle, data in accounts_data.items():
        output_file = DATA_DIR / "instagram" / f"{handle}_{TIMESTAMP}.json"
        with open(output_file, 'w') as f:
            json.dump(data, f, indent=2)
        log(f"Saved {len(data['reels'])} reels for @{handle}")
    
    # Filter out manual review items for stats
    valid_reels = [r for r in all_reels if r.get('source') not in ['manual_review_needed', 'web_fallback']]
    
    # Save combined data
    combined_file = DATA_DIR / "instagram" / f"all_reels_{TIMESTAMP}.json"
    lookback_days = config.get('settings', {}).get('reels_lookback_days', 7)
    combined_data = {
        'timestamp': TIMESTAMP,
        'lookback_days': lookback_days,
        'total_reels': len(valid_reels),
        'total_accounts': len(accounts_data),
        'accounts_processed': len(accounts_data),
        'reels': sorted(all_reels, key=lambda x: x.get('engagement_score', 0), reverse=True)
    }
    
    with open(combined_file, 'w') as f:
        json.dump(combined_data, f, indent=2)
    
    # Save as latest
    latest_file = DATA_DIR / "instagram" / "latest_reels.json"
    with open(latest_file, 'w') as f:
        json.dump(combined_data, f, indent=2)
    
    log(f"Total valid reels collected: {len(valid_reels)} from {len(accounts_data)} accounts")
    return combined_data

def main():
    log("=== Instagram Reels Scraper Started ===")
    
    config = load_config()
    accounts = config.get('instagram_accounts', [])
    lookback_days = config.get('settings', {}).get('reels_lookback_days', 7)
    
    log(f"Tracking {len(accounts)} accounts")
    log(f"Looking back {lookback_days} days")
    
    # Try instaloader first
    if INSTALOADER_AVAILABLE:
        log("Using instaloader for data extraction...")
        all_reels = scrape_reels_with_instaloader(accounts, lookback_days)
    else:
        log("⚠ instaloader not available, using fallback method...")
        all_reels = scrape_reels_fallback(accounts, lookback_days)
    
    # Check if we got real data
    valid_reels = [r for r in all_reels if r.get('source') not in ['manual_review_needed', 'web_fallback']]
    
    if not valid_reels and all_reels:
        log("⚠ No valid reels collected - trying fallback method...")
        # Add fallback data
        fallback_reels = scrape_reels_fallback(
            [a for a in accounts if a['handle'] not in [r['publisher']['handle'] for r in all_reels]],
            lookback_days
        )
        all_reels.extend(fallback_reels)
    
    if all_reels:
        results = save_results(all_reels, config)
        log(f"=== Scraping Complete: {results['total_reels']} valid reels from {results['accounts_processed']} accounts ===")
    else:
        log("⚠ No data collected")
        # Save empty result
        empty_result = {
            'timestamp': TIMESTAMP,
            'lookback_days': lookback_days,
            'total_reels': 0,
            'accounts_processed': 0,
            'reels': [],
            'note': 'No reels collected. Check Instagram access restrictions.'
        }
        with open(DATA_DIR / "instagram" / "latest_reels.json", 'w') as f:
            json.dump(empty_result, f, indent=2)
    
    log("=== Instagram Reels Scraper Finished ===")

if __name__ == '__main__':
    main()
