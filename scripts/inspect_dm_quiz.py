with open('dearmelodies_payload.txt', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find questions in the quiz
print("=== QUIZ QUESTIONS ===")
questions = re.findall(r'\"question[^\"]*\"[,\s:]+[\"\']([^\"\']+)[\"\']', text, re.I)
if not questions:
    questions = re.findall(r'[\"«](¿[^\"«»\n]+?\?)[\"»]', text)
for q in list(set(questions)):
    print("?", q)

# Find checkout price for this variant
print("\n=== CHECKOUT PRICE & VARIANTS ===")
for m in re.finditer(r'(?:price|amount|discount|originalPrice|total)[\"\':\s]+([\d\.\,]+)', text):
    print(m.group(0))

for m in re.finditer(r'\"([^\"]*(?:€|\$|USD|EUR|MXN|ARS)[^\"]*)\"', text):
    if any(k in m.group(1).lower() for k in ['precio', 'total', 'oferta', 'descuento', 'ahorra', 'pago']):
        print("Price text:", m.group(1))
