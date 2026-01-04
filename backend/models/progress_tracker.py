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
        self.messages.append(message)
        for callback in self.callbacks:
            try:
                callback(message)
            except Exception as e:
                print(f"Callback error: {e}")
    
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
    global _global_tracker
    _global_tracker = None
