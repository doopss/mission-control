#!/usr/bin/env python3
"""
Instagram Reels Analyzer
Identifies top performing reels based on engagement score (views * likes * comments)
"""

import json
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any

PROJECT_DIR = Path(__file__).parent.parent
DATA_DIR = PROJECT_DIR / "data"
OUTPUT_DIR = PROJECT_DIR / "data" / "analysis"

def load_latest_reels_data() -> Dict:
    """Load the most recent reels data"""
    latest_file = DATA_DIR / "instagram" / "latest_reels.json"
    
    if not latest_file.exists():
        # Try to find most recent combined reels file
        instagram_dir = DATA_DIR / "instagram"
        if instagram_dir.exists():
            files = sorted(instagram_dir.glob("all_reels_*.json"), reverse=True)
            if files:
                latest_file = files[0]
    
    if latest_file.exists():
        with open(latest_file) as f:
            return json.load(f)
    
    return {'reels': [], 'total_reels': 0}

def calculate_engagement_score(views: int, likes: int, comments: int) -> float:
    """Calculate engagement score using views * likes * comments formula"""
    v = max(views, 1)
    l = max(likes, 1)
    c = max(comments, 1)
    return v * l * c

def analyze_reels(reels_data: Dict) -> Dict:
    """
    Analyze reels data and identify top performers.
    Sorts by engagement score (views * likes * comments)
    """
    reels = reels_data.get('reels', [])
    
    analysis = {
        'timestamp': datetime.now().isoformat(),
        'report_date': datetime.now().strftime('%Y-%m-%d'),
        'lookback_days': reels_data.get('lookback_days', 7),
        'total_reels_analyzed': len(reels),
        'accounts_covered': len(set(r.get('publisher', {}).get('handle', '') for r in reels)),
        'top_reels': [],
        'account_summaries': [],
        'insights': []
    }
    
    if not reels:
        analysis['note'] = 'No reels data available. Run the scraper first or check for access issues.'
        return analysis
    
    # Filter out manual review placeholders and sort by engagement
    valid_reels = [r for r in reels if r.get('source') != 'manual_review_needed']
    manual_review_accounts = [r.get('publisher', {}).get('handle', '') for r in reels if r.get('source') == 'manual_review_needed']
    
    # Recalculate engagement scores if needed
    for reel in valid_reels:
        if 'engagement_score' not in reel or reel['engagement_score'] == 0:
            reel['engagement_score'] = calculate_engagement_score(
                reel.get('views', 0),
                reel.get('likes', 0),
                reel.get('comments', 0)
            )
    
    # Sort by engagement score (descending)
    sorted_reels = sorted(valid_reels, key=lambda x: x.get('engagement_score', 0), reverse=True)
    
    # Get top 15 reels
    top_reels = sorted_reels[:15]
    
    # Enrich with additional analysis
    for reel in top_reels:
        views = reel.get('views', 0)
        likes = reel.get('likes', 0)
        comments = reel.get('comments', 0)
        
        # Calculate engagement rate (if we had follower counts)
        # For now, use a simple likes+comments / views ratio
        if views > 0:
            reel['engagement_rate'] = round((likes + comments) / views * 100, 2)
        else:
            reel['engagement_rate'] = 0
        
        # Generate a brief summary/insight
        reel['ai_insight'] = generate_insight(reel)
    
    analysis['top_reels'] = top_reels
    
    # Account summaries
    account_stats = {}
    for reel in valid_reels:
        handle = reel.get('publisher', {}).get('handle', 'unknown')
        if handle not in account_stats:
            account_stats[handle] = {
                'handle': handle,
                'name': reel.get('publisher', {}).get('name', handle),
                'profile_url': reel.get('publisher', {}).get('profile_url', ''),
                'total_reels': 0,
                'total_views': 0,
                'total_likes': 0,
                'total_comments': 0,
                'reels_in_top_15': 0
            }
        
        stats = account_stats[handle]
        stats['total_reels'] += 1
        stats['total_views'] += reel.get('views', 0)
        stats['total_likes'] += reel.get('likes', 0)
        stats['total_comments'] += reel.get('comments', 0)
    
    # Count reels in top 15 per account
    for reel in top_reels:
        handle = reel.get('publisher', {}).get('handle', '')
        if handle in account_stats:
            account_stats[handle]['reels_in_top_15'] += 1
    
    # Calculate averages and sort by total engagement
    for handle, stats in account_stats.items():
        if stats['total_reels'] > 0:
            stats['avg_views'] = stats['total_views'] // stats['total_reels']
            stats['avg_likes'] = stats['total_likes'] // stats['total_reels']
            stats['avg_comments'] = stats['total_comments'] // stats['total_reels']
            stats['total_engagement_score'] = calculate_engagement_score(
                stats['total_views'], stats['total_likes'], stats['total_comments']
            )
    
    analysis['account_summaries'] = sorted(
        list(account_stats.values()),
        key=lambda x: x.get('total_engagement_score', 0),
        reverse=True
    )
    
    # Add manual review accounts note
    if manual_review_accounts:
        analysis['manual_review_needed'] = list(set(manual_review_accounts))
        analysis['insights'].append(f"{len(analysis['manual_review_needed'])} account(s) need manual review due to access restrictions.")
    
    # Generate overall insights
    if top_reels:
        top_account = top_reels[0].get('publisher', {}).get('handle', '')
        analysis['insights'].append(f"Top performing reel is from @{top_account}")
        
        # Find account with most reels in top 15
        account_counts = {}
        for reel in top_reels:
            h = reel.get('publisher', {}).get('handle', '')
            account_counts[h] = account_counts.get(h, 0) + 1
        
        if account_counts:
            most_consistent = max(account_counts.items(), key=lambda x: x[1])
            if most_consistent[1] > 1:
                analysis['insights'].append(f"@{most_consistent[0]} dominates with {most_consistent[1]} reels in top 15")
    
    return analysis

def generate_insight(reel: Dict) -> str:
    """Generate a strategic insight for a reel based on its metrics"""
    views = reel.get('views', 0)
    likes = reel.get('likes', 0)
    comments = reel.get('comments', 0)
    caption = reel.get('caption', '') or reel.get('title', '')
    
    insights = []
    
    # High views analysis
    if views > 100000:
        insights.append("Viral reach indicates strong hook")
    elif views > 50000:
        insights.append("Strong distribution suggests trending topic/format")
    
    # High engagement rate
    if views > 0:
        engagement_rate = (likes + comments) / views
        if engagement_rate > 0.1:
            insights.append("Exceptional engagement rate - highly relatable content")
        elif engagement_rate > 0.05:
            insights.append("Above-average engagement - resonates with audience")
    
    # High comments relative to likes (indicates discussion-worthy)
    if likes > 0 and comments > likes * 0.1:
        insights.append("High comment ratio - sparks conversation/debate")
    
    # Caption analysis (basic)
    if caption:
        caption_lower = caption.lower()
        if any(word in caption_lower for word in ['how to', 'secret', 'mistake', 'tips', 'advice']):
            insights.append("Educational/advice format performs well in this niche")
        if any(word in caption_lower for word in ['story', 'happened', 'when i', 'true']):
            insights.append("Storytelling approach drives engagement")
        if '?' in caption:
            insights.append("Question-based hook encourages interaction")
    
    if not insights:
        if views > likes * 10:
            insights.append("High views but lower engagement - optimize for retention")
        else:
            insights.append("Solid performer in the dating niche")
    
    return " | ".join(insights[:2])  # Limit to 2 insights

def generate_analysis_report():
    """Main analysis function - generates analysis report"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    timestamp = datetime.now().strftime('%Y-%m-%d_%H%M%S')
    
    # Load reels data
    reels_data = load_latest_reels_data()
    
    # Analyze
    analysis = analyze_reels(reels_data)
    
    # Save analysis
    output_file = OUTPUT_DIR / f"analysis_{timestamp}.json"
    with open(output_file, 'w') as f:
        json.dump(analysis, f, indent=2)
    
    # Also save as 'latest'
    latest_file = OUTPUT_DIR / "latest_analysis.json"
    with open(latest_file, 'w') as f:
        json.dump(analysis, f, indent=2)
    
    print(f"Analysis saved to: {output_file}")
    print(f"Latest analysis: {latest_file}")
    
    return analysis

if __name__ == '__main__':
    report = generate_analysis_report()
    print(f"\n=== Analysis Summary ===")
    print(f"Total reels analyzed: {report['total_reels_analyzed']}")
    print(f"Accounts covered: {report['accounts_covered']}")
    print(f"Top reels identified: {len(report['top_reels'])}")
    
    if report.get('insights'):
        print(f"\nInsights:")
        for insight in report['insights']:
            print(f"  • {insight}")
