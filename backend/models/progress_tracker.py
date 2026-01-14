import threading
import re
from typing import Optional, Callable, List

# SECURITY FIX: Compile regex at module level to prevent ReDoS and improve performance.
# We removed the overly permissive range that was triggering CodeQL alerts.
EMOJI_PATTERN = re.compile(
    u"["
    u"\U0001F600-\U0001F64F"  # Emoticons
    u"\U0001F300-\U0001F5FF"  # Misc Symbols and Pictographs
    u"\U0001F680-\U0001F6FF"  # Transport and Map
    u"\U0001F1E0-\U0001F1FF"  # Flags
    u"\U00002702-\U000027B0"  # Dingbats
    u"]+", flags=re.UNICODE
)

class ProgressTracker:
    def __init__(self):
        self.callbacks: List[Callable] = []
        self.messages: List[str] = []
        self._lock = threading.Lock()
    
    def add_callback(self, callback: Callable[[str], None]):
        with self._lock:
            if callback not in self.callbacks:
                self.callbacks.append(callback)
    
    def remove_callback(self, callback: Callable[[str], None]):
        with self._lock:
            if callback in self.callbacks:
                self.callbacks.remove(callback)
    
    def update(self, message: str):
        # SECURITY FIX: Limit input length to prevent Denial of Service (DoS)
        if len(message) > 500:
            message = message[:500]

        sanitized = self._sanitize_message(message)
        
        with self._lock:
            self.messages.append(sanitized)
            # Create a copy to iterate safely outside the lock
            callbacks_copy = self.callbacks.copy()
        
        for callback in callbacks_copy:
            try:
                callback(sanitized)
            except Exception as e:
                print(f"Callback error: {e}")
                # Remove failing callbacks to prevent log spam
                with self._lock:
                    if callback in self.callbacks:
                        self.callbacks.remove(callback)
    
    def _sanitize_message(self, message: str) -> str:
        # Use the pre-compiled, safe regex pattern
        message = EMOJI_PATTERN.sub('', message)
        message = message.strip().replace('\n', ' ')
        
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
        
        if message in simplifications:
            return simplifications[message]
        
        if 'Processed' in message and 'frames' in message:
            return message
        
        message = message.replace('  ', ' ')
        
        return message
    
    def clear(self):
        with self._lock:
            self.callbacks = []
            self.messages = []
    
    def get_messages(self) -> List[str]:
        with self._lock:
            return self.messages.copy()

_global_tracker = None
_tracker_lock = threading.Lock()

def get_progress_tracker() -> ProgressTracker:
    global _global_tracker
    with _tracker_lock:
        if _global_tracker is None:
            _global_tracker = ProgressTracker()
        return _global_tracker

def reset_progress_tracker():
    global _global_tracker
    with _tracker_lock:
        if _global_tracker is not None:
            with _global_tracker._lock:
                _global_tracker.messages = []