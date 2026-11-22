import urllib.request
import re

# Fetch one of the main chunks to see pricing logic
chunk_url = 'https://otp.dearmelodies.com/_next/static/immutable/chunks/1nj4rwwwrt10d.js'
try:
    req = urllib.request.Request(chunk_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        content = resp.read().decode('utf-8', errors='ignore')
        print("Chunk len:", len(content))
        # Look for prices
        prices = re.findall(r'(?:price|amount|defaultPrice|cost)[\":\s]+([0-9\.]+)', content, re.I)
        print("Prices in chunk:", set(prices))
        # Look for currencies
        curr = re.findall(r'(?:ARS|USD|EUR|MXN|BRL|CLP|COP)', content)
        print("Currencies:", set(curr))
except Exception as e:
    print("Error fetching chunk:", e)
