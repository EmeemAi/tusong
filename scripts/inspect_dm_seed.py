with open('dearmelodies_payload.txt', 'r', encoding='utf-8') as f:
    text = f.read()

import re
pos = text.find('OT2_d119l_c12_ES')
if pos != -1:
    print(text[max(0, pos-200):min(len(text), pos+600)])
