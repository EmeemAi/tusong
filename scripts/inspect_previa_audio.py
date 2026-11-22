with open('previa.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
scripts = re.findall(r'<script(?:\s+[^>]*)?>([\s\S]*?)</script>', text, re.I)
s3 = scripts[3]

for line in s3.split('\n'):
    if any(k in line.lower() for k in ['audio', 'mp3', 'player', 'play', 'watermark', 'marca', 'demo', 'corte', 'sec', 'segundo', 'hotmart', 'checkout', 'durat']):
        print(line[:120])
