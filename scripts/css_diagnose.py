#!/usr/bin/env python3
"""Diagnose byte-level content of globals.css and then safely prune dead blocks."""
import sys

CSS_PATH = 'app/globals.css'

with open(CSS_PATH, 'rb') as f:
    raw = f.read()

content = raw.decode('utf-8')

# Show markers
markers = [
    'FIX 3: Portrait',
    'FIX 4: Ultra-wide',
    'FIX 5: Container queries',
    'Carousel dot active state',
    'HEADSHOT SYSTEM',
    'CONVICTION ENGINE V1.0',
    'END RESPONSIVENESS SURGICAL',
    'HERO REFINEMENT v2026.2',
    'HERO REFINEMENT v2026.3',
    'HERO REFINEMENT v2026.4',
    'HERO FINAL PASS v2026.5',
]

for m in markers:
    pos = content.find(m)
    if pos >= 0:
        # Show context: 3 chars before
        ctx_start = max(0, pos - 6)
        print(f'{m!r:50s} at {pos:6d}: {repr(content[ctx_start:pos+len(m)+3])}')
    else:
        print(f'{m!r:50s} NOT FOUND')
