with open('dearmelodies_payload.txt', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [line for line in text.split('\n') if any(k in line for k in ['d119l', 'up14', 's13c12', 'ot2'])]
print(f"Matches for URL path keys: {len(matches)}")
for m in matches[:10]:
    print(m[:200])
