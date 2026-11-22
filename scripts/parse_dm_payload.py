import json
import re

with open('dearmelodies.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find all next_f pushes
matches = re.findall(r'self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)', html)
full_payload = ""
for m in matches:
    # unescape json string
    try:
        s = json.loads('"' + m + '"')
        full_payload += s + "\n"
    except Exception as e:
        full_payload += m + "\n"

with open('dearmelodies_payload.txt', 'w', encoding='utf-8') as f:
    f.write(full_payload)

print("Full payload len:", len(full_payload))

# Search for questions, Spanish phrases, prices, checkout, etc.
lines = full_payload.split('\n')
print(f"Total lines: {len(lines)}")

# Search for Spanish text
spanish_samples = []
for line in lines:
    matches_sp = re.findall(r'[\"«]([A-ZÁÉÍÓÚÑ¿¡][^\"«»\n]{10,120})[\"»]', line)
    for sp in matches_sp:
        if any(w in sp.lower() for w in ['canción', 'música', 'quién', 'regalo', 'estilo', 'precio', 'amor', 'madre', 'padre', 'aniversario', 'cumpleaños', 'género', 'voz', 'minuto', 'dólar', 'peso', 'eur', 'usd']):
            spanish_samples.append(sp)

print("\n--- SPANISH QUIZ / PRODUCT PHRASES (sample of %d) ---" % len(spanish_samples))
for s in list(set(spanish_samples))[:30]:
    print("-", s)
