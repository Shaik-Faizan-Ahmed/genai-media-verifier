def generate_report(prob, risk):
    return f"""
This media content was analyzed using AI-based forensic models.

Risk Level: {risk}
Manipulation Probability: {prob}

The analysis detected visual inconsistencies that may indicate artificial modification.
This result should be used as supporting evidence, not as final proof.
"""
