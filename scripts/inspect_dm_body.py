from bs4 import BeautifulSoup
import re

with open('dearmelodies.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

print("Body text snippet (first 1000 chars):")
print(soup.body.get_text(separator=' | ', strip=True)[:1000] if soup.body else "No body")

print("\nScripts found:")
for s in soup.find_all('script'):
    src = s.get('src')
    if src:
        print("External:", src[:100])
    elif s.string and len(s.string.strip()) > 30:
        print("Inline (len %d):" % len(s.string), s.string.strip()[:150].replace('\n', ' '))
