"""
Progress tracking system for real-time updates to frontend
"""
import asyncio
from typing import Optional, Callable

class ProgressTracker:
    def __init__(self):
        self.callbacks = []
        self.messages = []
    
    def add_callback(self, callback: Callable[[str], None]):
        """Add a callback function to be called on progress updates"""
        self.callbacks.append(callback)
    
    def update(self, message: str):
        """Send progress update to all callbacks"""
        # Remove emojis and sanitize for SSE
        sanitized = self._sanitize_message(message)
        self.messages.append(sanitized)
        for callback in self.callbacks:
            try:
                callback(sanitized)
            except Exception:
                pass  # Silently skip failed callbacks
    
    def _sanitize_message(self, message: str) -> str:
        """Remove emojis, clean up, and shorten messages for frontend display"""
        import re
        # Remove emojis
        emoji_pattern = re.compile("["
            u"\U0001F600-\U0001F64F"  # emoticons
            u"\U0001F300-\U0001F5FF"  # symbols & pictographs
            u"\U0001F680-\U0001F6FF"  # transport & map symbols
            u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
            u"\U00002702-\U000027B0"
            u"\U000024C2-\U0001F251"
            "]+", flags=re.UNICODE)
        message = emoji_pattern.sub('', message)
        # Remove leading/trailing newlines and extra spaces
        message = message.strip().replace('\n', ' ')
        
        # Shorten verbose messages for frontend
        simplifications = {
            'LAYER 1: Analyzing video metadata...': 'Analyzing metadata',
            'LAYER 2A: Extracting key frames from video...': 'Extracting frames',
            'Analyzing frames with AI models...': 'Analyzing frames',
            'Analyzing temporal consistency...': 'Checking temporal consistency',
            'Running 3D video model analysis...': 'Running 3D model analysis',
            'LAYER 2B: Analyzing audio stream...': 'Analyzing audio',
            'LAYER 2B: No audio detected, skipping...': 'No audio detected',
            'LAYER 2C: Analyzing physiological signals...': 'Analyzing physiological signals',
            'LAYER 2D: Checking physics consistency...': 'Checking physics consistency',
            'LAYER 3: Analyzing scene boundaries...': 'Analyzing scene boundaries',
            'LAYER 3: Analyzing compression artifacts...': 'Analyzing compression',
            'Combining all analysis results...': 'Finalizing analysis',
            'Analysis complete!': 'Complete!',
        }
        
        # Check for exact matches first
        if message in simplifications:
            return simplifications[message]
        
        # Handle frame progress messages (e.g., "Processed 10/50 frames")
        if 'Processed' in message and 'frames' in message:
            return message  # Keep these as-is, they're already short
        
        # Remove redundant prefixes
        message = message.replace('  ', ' ')  # Remove double spaces
        
        return message
    
    def clear(self):
        """Clear all callbacks and messages"""
        self.callbacks = []
        self.messages = []

# Global progress tracker
_global_tracker = None

def get_progress_tracker():
    global _global_tracker
    if _global_tracker is None:
        _global_tracker = ProgressTracker()
    return _global_tracker

def reset_progress_tracker():
    """Clear messages but keep callbacks alive for SSE"""
    global _global_tracker
    if _global_tracker is not None:
        _global_tracker.messages = []  # Clear old messages but KEEP callbacks
