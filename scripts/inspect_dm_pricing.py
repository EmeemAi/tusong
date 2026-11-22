with open('dearmelodies_payload.txt', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Look for prices, currencies, packages, offers
print("=== PRICES & PACKAGES ===")
matches_price = re.findall(r'(\$\s?[\d\.\,]+|\b\d+[\.,]\d{2}\s?(?:USD|EUR|ARS|MXN)|(?:price|precio|cost|amount|total)[\"\':\s]+[\d\.\,]+)', text, re.I)
print(set(matches_price[:25]))

# Look for upsells (video, photos, expedite delivery, rights)
print("\n=== UPSELLS / ADDONS ===")
for line in text.split('\n'):
    for keyword in ['upsell', 'addon', 'bump', 'checkout', 'stripe', 'paypal', 'order', 'tier', 'plan', 'adelanto', 'garantía']:
        for m in re.finditer(rf'([^\"]{{0,40}}{keyword}[^\"]{{0,60}})', line, re.I):
            val = m.group(1).strip()
            if len(val) > 10:
                print(f"[{keyword}] {val}")
