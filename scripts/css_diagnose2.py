#!/usr/bin/env python3
"""Find all occurrences of key CSS markers."""

CSS_PATH = 'app/globals.css'

with open(CSS_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

search_terms = [
    'HEADSHOT SYSTEM - canonical',
    'HEADSHOT SYSTEM \xe2\x80\x94 canonical',
    'Replaces: headshot-ring-pulse',
    'END RESPONSIVENESS SURGICAL AUDIT V1.1',
    'hero-grid-child .mobile-carousel',
    'v32: transition + hero stability',
    '.hero-desktop-headshot {',
    'hero-headshot-mobile-ratio',
    'CONVICTION ENGINE V1.0',
]

for term in search_terms:
    positions = []
    start = 0
    while True:
        pos = content.find(term, start)
        if pos < 0:
            break
        positions.append(pos)
        start = pos + 1

    if positions:
        for pos in positions:
            ctx = content[max(0, pos - 10):pos + 70]
            print(repr(term[:38]), 'at', pos, ':', repr(ctx[:80]))
    else:
        print(repr(term[:38]), 'NOT FOUND')

# Show content around END RESPONSIVENESS
pos = content.find('END RESPONSIVENESS SURGICAL AUDIT V1.1')
if pos >= 0:
    print('\n--- After END RESPONSIVENESS ---')
    print(repr(content[pos:pos+500]))
