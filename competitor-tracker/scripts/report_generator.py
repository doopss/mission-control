#!/usr/bin/env python3
"""
Report Generator for Competitor Analysis
Generates formatted Telegram-ready reports focused on Instagram Reels
"""

import json
import os
from datetime import datetime
from pathlib import Path

PROJECT_DIR = Path(__file__).parent.parent
ANALYSIS_DIR = PROJECT_DIR / "data" / "analysis"
REPORTS_DIR = PROJECT_DIR / "data" / "reports"

def format_number(num):
    """Format large numbers for readability"""
    if num is None:
        return "N/A"
    if isinstance(num, str):
        return num
    if num >= 1_000_000:
        return f"{num/1_000_000:.1f}M"
    if num >= 1_000:
        return f"{num/1_000:.1f}K"
    return str(int(num))

def load_latest_analysis():
    """Load the most recent analysis file"""
    latest_file = ANALYSIS_DIR / "latest_analysis.json"
    
    if not latest_file.exists():
        # Try to find most recent analysis file
        files = sorted(ANALYSIS_DIR.glob("analysis_*.json"), reverse=True)
        if files:
            latest_file = files[0]
        else:
            return None
    
    with open(latest_file) as f:
        return json.load(f)

def truncate_text(text: str, max_length: int = 100) -> str:
    """Truncate text to max length with ellipsis"""
    if not text:
        return ""
    if len(text) <= max_length:
        return text
    return text[:max_length-3] + "..."

def generate_reels_section(analysis):
    """Generate the main reels section of the report"""
    lines = []
    lines.append("📸 **TOP PERFORMING REELS (TRAILING 7 DAYS)**")
    lines.append("━" * 30)
    
    top_reels = analysis.get('top_reels', [])
    
    if not top_reels:
        lines.append("\n*No reels data available yet.*")
        lines.append("*Run the scraper first or check for access issues.*")
        
        # Check for manual review accounts
        manual = analysis.get('manual_review_needed', [])
        if manual:
            lines.append(f"\n⚠️ **Accounts needing manual review:** {', '.join('@' + h for h in manual)}")
        
        return "\n".join(lines)
    
    for i, reel in enumerate(top_reels, 1):
        # Extract data
        title = reel.get('title', '') or reel.get('caption', '')
        if not title:
            title = "Untitled Reel"
        title = truncate_text(title, 80)
        
        publisher = reel.get('publisher', {})
        pub_name = publisher.get('name', publisher.get('handle', 'Unknown'))
        pub_handle = publisher.get('handle', '')
        profile_url = publisher.get('profile_url', f"https://www.instagram.com/{pub_handle}/")
        
        reel_url = reel.get('url', '')
        
        views = reel.get('views', 0)
        likes = reel.get('likes', 0)
        comments = reel.get('comments', 0)
        
        description = reel.get('description', '') or reel.get('caption', '')
        summary = truncate_text(description, 150) if description else "No description available"
        
        insight = reel.get('ai_insight', 'Analyze content strategy for opportunities')
        
        # Build reel entry
        lines.append(f"\n**{title}**")
        lines.append(f"👤 [{pub_name}]({profile_url})")
        lines.append(f"🔗 [View Reel]({reel_url})")
        lines.append("")
        lines.append("📊 Engagement:")
        lines.append(f"  👁 {format_number(views)} views | ❤️ {format_number(likes)} likes | 💬 {format_number(comments)} comments")
        lines.append("")
        lines.append(f"📝 Summary:")
        lines.append(f"{summary}")
        lines.append("")
        lines.append(f"💡 Key Insight:")
        lines.append(f"{insight}")
        lines.append("\n---")
    
    return "\n".join(lines)

def generate_account_leaderboard(analysis):
    """Generate account performance summary"""
    lines = []
    lines.append("\n\n📊 **ACCOUNT PERFORMANCE**")
    lines.append("━" * 30)
    
    summaries = analysis.get('account_summaries', [])
    
    if not summaries:
        lines.append("*No account data available.*")
        return "\n".join(lines)
    
    lines.append("\n*Ranked by total engagement this week:*\n")
    
    for i, account in enumerate(summaries[:10], 1):
        handle = account.get('handle', '')
        name = account.get('name', handle)
        total_reels = account.get('total_reels', 0)
        avg_views = account.get('avg_views', 0)
        top_15_count = account.get('reels_in_top_15', 0)
        
        emoji = "🥇" if i == 1 else "🥈" if i == 2 else "🥉" if i == 3 else f"{i}."
        
        lines.append(f"{emoji} **@{handle}**")
        lines.append(f"   {total_reels} reels | Avg: {format_number(avg_views)} views")
        if top_15_count > 0:
            lines.append(f"   🏆 {top_15_count} in Top 15")
        lines.append("")
    
    return "\n".join(lines)

def generate_insights_section(analysis):
    """Generate insights section"""
    lines = []
    
    insights = analysis.get('insights', [])
    if not insights:
        return ""
    
    lines.append("\n\n💡 **KEY INSIGHTS**")
    lines.append("━" * 30)
    
    for insight in insights:
        lines.append(f"• {insight}")
    
    return "\n".join(lines)

def generate_full_report():
    """Generate the complete competitor analysis report"""
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    
    analysis = load_latest_analysis()
    
    if not analysis:
        return "❌ No analysis data available. Please run the scraper and analyzer first."
    
    # Build report with new format
    report_date = datetime.now().strftime('%A, %B %d, %Y')
    lookback = analysis.get('lookback_days', 7)
    
    lines = []
    lines.append("🎯 **DATING NICHE COMPETITOR REPORT**")
    lines.append(f"📅 {report_date}")
    lines.append("=" * 35)
    
    # Main reels section
    reels_section = generate_reels_section(analysis)
    lines.append(reels_section)
    
    # Account leaderboard
    account_section = generate_account_leaderboard(analysis)
    lines.append(account_section)
    
    # Insights
    insights_section = generate_insights_section(analysis)
    if insights_section:
        lines.append(insights_section)
    
    # Footer
    lines.append("\n\n" + "=" * 35)
    lines.append("📊 *Generated by Competitor Tracker*")
    lines.append(f"⏰ Analysis: {analysis.get('timestamp', 'N/A')}")
    lines.append(f"📈 {analysis.get('total_reels_analyzed', 0)} reels analyzed from {analysis.get('accounts_covered', 0)} accounts")
    
    report_text = "\n".join(lines)
    
    # Save report
    timestamp = datetime.now().strftime('%Y-%m-%d_%H%M%S')
    report_file = REPORTS_DIR / f"report_{timestamp}.txt"
    with open(report_file, 'w') as f:
        f.write(report_text)
    
    # Save as latest
    latest_file = REPORTS_DIR / "latest_report.txt"
    with open(latest_file, 'w') as f:
        f.write(report_text)
    
    print(f"Report saved to: {report_file}")
    
    return report_text

def get_telegram_report():
    """Get the report formatted for Telegram delivery"""
    return generate_full_report()

if __name__ == '__main__':
    report = generate_full_report()
    print("\n" + "=" * 50)
    print(report)
