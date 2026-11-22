with open('competitor.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
scripts = re.findall(r'<script(?:\s+[^>]*)?>([\s\S]*?)</script>', text, re.I)
for i, s in enumerate(scripts):
    if len(s.strip()) > 50:
        print(f"\n================ SCRIPT {i} (len: {len(s)}) ================")
        print(s[:1500])
