with open('dearmelodies_payload.txt', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [line for line in text.split('\n') if 'OT2_v7_ES' in line or 'quiz' in line.lower()]
print(f"Quiz lines: {len(matches)}")
for line in matches:
    # find messages or steps
    for m in re.finditer(r'\"([^\"]{5,60})\"', line):
        val = m.group(1)
        if any(k in val.lower() for k in ['paso', 'pregunta', 'ocasión', 'quién', 'estilo', 'voz', 'historia', 'nombre']):
            print("-", val)
