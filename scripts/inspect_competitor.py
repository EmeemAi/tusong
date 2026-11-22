import re
from bs4 import BeautifulSoup

with open('competitor.html', 'r', encoding='utf-8') as f:
    text = f.read()

soup = BeautifulSoup(text, 'html.parser')
print('TITLE:', soup.title.string if soup.title else 'No title')

# Find headings
for h in soup.find_all(['h1', 'h2', 'h3']):
    print(f"{h.name}: {h.get_text(strip=True)[:80]}")

# Find all buttons / CTA
print('\n--- BUTTONS / LINKS ---')
for a in soup.find_all(['a', 'button']):
    text_content = a.get_text(strip=True)
    href = a.get('href', '')
    if text_content or 'http' in href:
        print(f"[{a.name}] {text_content} -> {href[:100]}")

# Look for forms or interactive steps
forms = soup.find_all('form')
print(f"\n--- FORMS FOUND: {len(forms)} ---")
for f_tag in forms:
    print('Action:', f_tag.get('action'))
    for inp in f_tag.find_all(['input', 'textarea', 'select']):
        print('  Input:', inp.get('name'), inp.get('type'), inp.get('placeholder'))

# Look for embedded scripts or logic
print('\n--- SCRIPTS ---')
scripts = soup.find_all('script')
for s in scripts:
    src = s.get('src')
    if src:
        print('Script src:', src)
    elif s.string and ('checkout' in s.string or 'precio' in s.string or '17' in s.string or 'api' in s.string.lower()):
        print('Inline script sample:', s.string[:200])
