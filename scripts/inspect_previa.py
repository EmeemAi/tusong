import urllib.request
from bs4 import BeautifulSoup
import re

url = 'https://www.cantoriaexpress.com.br/previa.html'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

with open('previa.html', 'w', encoding='utf-8') as f:
    f.write(html)

soup = BeautifulSoup(html, 'html.parser')
print('PREVIA TITLE:', soup.title.string if soup.title else 'No title')
for h in soup.find_all(['h1', 'h2', 'h3']):
    print(f"{h.name}: {h.get_text(strip=True)[:80]}")

print('\n--- CHECKOUT BUTTONS / LINKS ---')
for a in soup.find_all(['a', 'button']):
    print(f"[{a.name}] {a.get_text(strip=True)[:40]} -> {a.get('href', '')[:100]}")

print('\n--- SCRIPTS in previa.html ---')
scripts = re.findall(r'<script(?:\s+[^>]*)?>([\s\S]*?)</script>', html, re.I)
for i, s in enumerate(scripts):
    if len(s.strip()) > 50:
        print(f"Script {i} len {len(s)}: {s.strip()[:300]}...\n")
