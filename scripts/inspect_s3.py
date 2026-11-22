with open('competitor.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
scripts = re.findall(r'<script(?:\s+[^>]*)?>([\s\S]*?)</script>', text, re.I)
s3 = scripts[3]
# Find fetch or submit or n8n or webhook in s3
print("=== SCRIPT 3 FULL / RELEVANT PARTS ===")
for line in s3.split('\n'):
    if any(k in line.lower() for k in ['fetch', 'post', 'webhook', 'n8n', 'submit', 'demo', 'url', 'api', 'window.location', 'hotmart']):
        print(line)
