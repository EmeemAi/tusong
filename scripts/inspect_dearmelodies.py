from bs4 import BeautifulSoup
import re
import json

with open('dearmelodies.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

print('=== TITLE ===')
print(soup.title.string if soup.title else 'No title')

# Check Framework / Tech
print('\n=== TECH STACK INDICATORS ===')
if 'next' in html.lower():
    print('- Mentions Next.js')
if 'nuxt' in html.lower():
    print('- Mentions Nuxt')
if 'react' in html.lower():
    print('- Mentions React')
if 'vue' in html.lower():
    print('- Mentions Vue')
if 'stripe' in html.lower():
    print('- Mentions Stripe')
if 'shopify' in html.lower():
    print('- Mentions Shopify')

# Look for JSON configs or __NEXT_DATA__
next_data = soup.find('script', id='__NEXT_DATA__')
if next_data:
    print('- Found __NEXT_DATA__!')
    try:
        data = json.loads(next_data.string)
        print('Next.js page:', data.get('page'))
        print('Next.js buildId:', data.get('buildId'))
        props = data.get('props', {})
        print('Props keys:', list(props.keys()))
        pageProps = props.get('pageProps', {})
        print('pageProps keys:', list(pageProps.keys()))
        with open('next_props.json', 'w', encoding='utf-8') as pf:
            json.dump(pageProps, pf, indent=2, ensure_ascii=False)
        print('Saved next_props.json')
    except Exception as e:
        print('Error parsing next data:', e)

# Extract headings and steps
print('\n=== HEADINGS ===')
for h in soup.find_all(['h1', 'h2', 'h3'])[:15]:
    print(f"[{h.name}] {h.get_text(strip=True)[:100]}")

# Look for quiz questions or steps
print('\n=== QUIZ STEPS / QUESTIONS ===')
for q in soup.find_all(class_=re.compile(r'question|step|quiz|title', re.I))[:10]:
    t = q.get_text(strip=True)
    if len(t) > 5 and len(t) < 100:
        print('Step/Q:', t)
