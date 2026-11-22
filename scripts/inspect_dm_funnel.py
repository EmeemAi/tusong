with open('dearmelodies_payload.txt', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find steps
steps = re.findall(r'\"stepName\"[,\s:]+[\"\']([^\"\']+)[\"\']', text)
print("Step names:", steps)

# Find quiz choices
options = re.findall(r'\"(recipient|occasion|genre|mood|voice|tempo)\"[,\s:]+[\"\']?([^\"\'\},]+)', text, re.I)
print("Options sample:", options[:10])

# Look for price numbers in props
prices = re.findall(r'\"(?:usd|eur|price|amount|val)\":\s*([0-9\.]+)', text, re.I)
print("Prices:", set(prices))

# Search for exact checkout texts
for line in text.split('\n'):
    if 'Checkout' in line or 'quiz' in line or 'order' in line:
        for phrase in re.findall(r'\"([^\"]{10,80})\"', line):
            if any(k in phrase.lower() for k in ['descuento', 'oferta', 'usd', 'eur', 'garantía', 'pago único', 'adelanto']):
                print("Phrase:", phrase)
