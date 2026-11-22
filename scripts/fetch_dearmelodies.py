import urllib.request
from bs4 import BeautifulSoup
import re

url = 'https://otp.dearmelodies.com/es/ot2/d119l-s13c12-es-up14/quiz'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
}
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        with open('dearmelodies.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print('Saved dearmelodies.html, len:', len(html))
except Exception as e:
    print('Error:', e)
