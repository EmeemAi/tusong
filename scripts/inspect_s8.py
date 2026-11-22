with open('competitor.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
scripts = re.findall(r'<script(?:\s+[^>]*)?>([\s\S]*?)</script>', text, re.I)
s8 = scripts[8]
print("=== SCRIPT 8 FULL ===")
print(s8)
