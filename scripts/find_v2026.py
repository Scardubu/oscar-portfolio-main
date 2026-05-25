#!/usr/bin/env python3
import sys

css_path = '/home/scar/Documents/oscar-portfolio-main/app/globals.css'
lines = open(css_path).readlines()
print(f'Total lines: {len(lines)}')
markers = ['F1: Tablet', 'F2: Suppress', 'F3: Definitive',
           'E1: Chapter-resonant', 'E2: CTA primary', 'E5: Headshot badge',
           'Carousel dot active', 'END HERO REFINEMENT v2026',
           'badge-reveal', 'headshot-ring-chapter']
for i, l in enumerate(lines, 1):
    if any(m in l for m in markers):
        print(f'{i}: {l.rstrip()}')
