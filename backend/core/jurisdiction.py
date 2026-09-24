import re
import logging

logger = logging.getLogger(__name__)

class JurisdictionDetector:
    def __init__(self):
        # Common jurisdiction patterns
        self.patterns = {
            "USA - New York": [r"state of New York", r"laws of New York", r"New York law"],
            "USA - California": [r"state of California", r"laws of California", r"California law"],
            "United Kingdom": [r"laws of England and Wales", r"English law", r"High Court of Justice in London"],
            "India": [r"laws of India", r"courts of (Mumbai|Delhi|Bangalore)", r"Indian Penal Code"],
            "European Union": [r"European Union law", r"laws of (Germany|France|Netherlands)"]
        }

    def detect(self, text):
        """
        Attempts to identify the governing jurisdiction from the contract text.
        """
        for jurisdiction, patterns in self.patterns.items():
            for pattern in patterns:
                if re.search(pattern, text, re.I):
                    return jurisdiction
        
        return "Unknown / Global"

# Example usage
if __name__ == "__main__":
    detector = JurisdictionDetector()
    print(detector.detect("This agreement is governed by the laws of England and Wales."))
