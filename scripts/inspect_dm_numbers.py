with open('dearmelodies_payload.txt', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for line in text.split('\n'):
    for pat in [r'\b11[\.,]9\b', r'\b14[\.,]9\b', r'\b19[\.,]9\b', r'\b9[\.,]9\b', r'\b29[\.,]9\b', r'119']:
        found = re.findall(pat, line)
        if found:
            # print surrounding 100 chars
            for m in re.finditer(pat, line):
                start = max(0, m.start() - 50)
                end = min(len(line), m.end() + 50)
                print(f"[{pat}] ...{line[start:end]}...")
