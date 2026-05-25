#!/usr/bin/env python3
import sys

CSS_PATH = 'app/globals.css'
with open(CSS_PATH, 'r', encoding='utf-8') as f:
    content = f.read()
ORIG_LEN = len(content)

def remove_between(c, start_m, end_m, label):
    s = c.find(start_m)
    e = c.find(end_m)
    if s < 0: print('SKIP ' + label + ': start not found'); return c
    if e < 0: print('SKIP ' + label + ': end not found'); return c
    if e <= s: print('SKIP ' + label + ': end before start'); return c
    print('REMOVE ' + label + ': ' + str(e-s) + ' chars')
    return c[:s] + c[e:]

# 1
OLD1 = '  .skeleton-shimmer,\n  .hero-headshot-ring,\n  .metric-pulse,'
NEW1 = '  .skeleton-shimmer,\n  .metric-pulse,'
if OLD1 in content: content = content.replace(OLD1, NEW1, 1); print('DONE 1')
else: print('SKIP 1')

# 2
OLD2 = '.hero-grid-shell {\n  align-items: center;\n}\n\n.hero-visual-dashboard .terminal-ambient-glow {'
NEW2 = '.hero-visual-dashboard .terminal-ambient-glow {'
if OLD2 in content: content = content.replace(OLD2, NEW2, 1); print('DONE 2')
else: print('SKIP 2')

# 3
OLD3 = '  }\n\n  #hero .hero-headshot-ring {\n    width: clamp(7.25rem, 28vw, 8.25rem);\n    height: clamp(7.25rem, 28vw, 8.25rem);\n  }\n\n  #hero .hero-kicker {'
NEW3 = '  }\n\n  #hero .hero-kicker {'
if OLD3 in content: content = content.replace(OLD3, NEW3, 1); print('DONE 3')
else: print('SKIP 3')

# 4a
OLD4a = '  .hero-grid-shell {\n    justify-items: center;\n  }\n\n  .cta-hero-group {'
NEW4a = '  .cta-hero-group {'
if OLD4a in content: content = content.replace(OLD4a, NEW4a, 1); print('DONE 4a')
else: print('SKIP 4a')

# 4b
OLD4b = '  .mobile-headshot-wrap {\n    width: 100%;\n  }\n\n  .mobile-headshot-wrap .hero-headshot-shell {\n    margin-inline: auto;\n  }\n}'
NEW4b = '}'
if OLD4b in content: content = content.replace(OLD4b, NEW4b, 1); print('DONE 4b')
else: print('SKIP 4b')

# 5 FIX 3 block
content = remove_between(content, '\u2500\u2500 FIX 3: Portrait tablet treatment', '\u2500\u2500 FIX 4: Ultra-wide', 'FIX 3')

# 6
OLD6 = '  /* Hero text scale \u2014 controlled boost at ultrawide */\n  .hero-grid-shell {\n    --hero-left-width: 55%;\n    --hero-right-width: 45%;\n  }\n\n  /* Glow intensity'
NEW6 = '  /* Glow intensity'
if OLD6 in content: content = content.replace(OLD6, NEW6, 1); print('DONE 6')
else: print('SKIP 6')

# 7 FIX 5 block
content = remove_between(content, '\u2500\u2500 FIX 5: Container queries for hero visual panels', '\u2500\u2500 Carousel dot active state', 'FIX 5')

# 8 HEADSHOT SYSTEM canonical block
er_pos = content.find('END RESPONSIVENESS SURGICAL AUDIT V1.1')
conv_hero = 'CONVICTION ENGINE V1.0 \u2014 HERO + NAVBAR POLISH PASS'
if er_pos >= 0:
    hs = content.find('HEADSHOT SYSTEM \u2014 canonical rules', er_pos)
    cv = content.find(conv_hero, er_pos)
    if hs >= 0 and cv > hs:
        # Find /* that starts the HEADSHOT SYSTEM block
        block_s = content.rfind('/* ===', er_pos, hs + 10)
        # Find /* that starts the CONVICTION ENGINE HERO section
        block_e = content.rfind('\n/* ', hs, cv + 20)
        if block_s >= 0 and block_e > block_s:
            print('REMOVE HEADSHOT SYSTEM: ' + str(block_e - block_s) + ' chars')
            content = content[:block_s] + content[block_e + 1:]  # +1 skips leading \n
        else:
            print('SKIP HEADSHOT SYSTEM: block delimiters not found hs=' + str(block_s) + ' block_e=' + str(block_e))
    else:
        print('SKIP HEADSHOT SYSTEM: hs=' + str(hs) + ' cv=' + str(cv))
else:
    print('SKIP HEADSHOT SYSTEM: END RESPONSIVENESS not found')

# 9 hero-grid-child .mobile-carousel rule
content = remove_between(content, '\u2500\u2500 Proof carousel: lock to 2-col inside hero left column at xl', '\u2500\u2500 Tablet (768', 'hero-grid-child .mobile-carousel')

# 10 Tablet mobile-headshot-wrap hide rule
content = remove_between(content, '\u2500\u2500 Tablet (768\u20131023px): hide mobile headshot via explicit class', '\u2500\u2500 v32: transition + hero stability pass', 'Tablet 768-1023 mobile-headshot-wrap')

# 11
OLD11 = '@media (max-width: 639px) {\n  #hero .hero-grid-shell {\n    gap: clamp(1.25rem, 6vw, 2rem);\n  }\n\n  #hero .hero-availability-label {'
NEW11 = '@media (max-width: 639px) {\n  #hero .hero-availability-label {'
if OLD11 in content: content = content.replace(OLD11, NEW11, 1); print('DONE 11')
else: print('SKIP 11')

# 12
OLD12 = '  #hero .mobile-headshot-wrap {\n    padding-block: clamp(0.75rem, 2vw, 1.25rem);\n  }\n\n  #hero .hero-kicker,'
NEW12 = '  #hero .hero-kicker,'
if OLD12 in content: content = content.replace(OLD12, NEW12, 1); print('DONE 12')
else: print('SKIP 12')

# 13
OLD13 = '@media (min-width: 640px) and (max-width: 1023px) {\n  #hero .hero-grid-shell {\n    gap: clamp(1.5rem, 3vw, 2.25rem);\n  }\n\n  #hero .hero-availability-label {'
NEW13 = '@media (min-width: 640px) and (max-width: 1023px) {\n  #hero .hero-availability-label {'
if OLD13 in content: content = content.replace(OLD13, NEW13, 1); print('DONE 13')
else: print('SKIP 13')

# 14 HERO REFINEMENT v2026.2 entire block
content = remove_between(content, '/* ==========================================================================\n   HERO REFINEMENT v2026.2', 'HERO REFINEMENT v2026.3', 'HERO REFINEMENT v2026.2')

# 15a v2026.3 headshot-image rule
content = remove_between(content, '/* 1. Better face centering on mobile', '/* 2. Common phone viewports', 'v2026.3 headshot-image')

# 15b v2026.3 container query
content = remove_between(content, '/* 2. Common phone viewports', '/* 3. Wider phones', 'v2026.3 container query')

# 15c v2026.3 wider phones dead comment
content = remove_between(content, '/* 3. Wider phones', '\u2500\u2500 Carousel dot active state', 'v2026.3 wider phones comment')

# 16 HERO FINAL PASS v2026.5 (end of file)
fp_pos = content.rfind('HERO FINAL PASS v2026.5')
if fp_pos >= 0:
    block_start = content.rfind('\n/* ', 0, fp_pos)
    if block_start >= 0:
        print('REMOVE HERO FINAL PASS v2026.5: ' + str(len(content) - block_start - 1) + ' chars')
        content = content[:block_start + 1]
        if not content.endswith('\n'): content += '\n'
    else:
        print('SKIP HERO FINAL PASS: block start not found')
else:
    print('SKIP HERO FINAL PASS: marker not found')

NEW_LEN = len(content)
print('Original: ' + str(ORIG_LEN) + ' chars, New: ' + str(NEW_LEN) + ', Removed: ' + str(ORIG_LEN - NEW_LEN))
with open(CSS_PATH, 'w', encoding='utf-8') as f:
    f.write(content)
print('Written OK')

with open(CSS_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

original_len = len(content)

# ── Block 1: FIX 3 (768-1023px tablet headshot block) ──────────────────────
# Find from the comment "FIX 3: Portrait tablet treatment" through its closing }
# followed by the FIX 4 comment
pattern_fix3 = (
    r'/\* \u2500+ FIX 3: Portrait tablet treatment[^/]*?\*/'
    r'\s*@media \(min-width: 768px\) and \(max-width: 1023px\) \{'
    r'[^{]*(?:\{[^}]*\}[^{]*)*?\}\s*\n'
)
m = re.search(pattern_fix3, content, re.DOTALL)
if m:
    print(f'FIX 3 block found at {m.start()}-{m.end()}, removing {len(m.group())} chars')
    content = content[:m.start()] + content[m.end():]
else:
    # Simpler approach: find by line markers
    fix3_start = '/* \u2500\u2500 FIX 3: Portrait tablet treatment (768\u20131023px)'
    fix4_start = '/* \u2500\u2500 FIX 4: Ultra-wide (1536\u20131920px+) treatment'
    s = content.find(fix3_start)
    e = content.find(fix4_start)
    if s >= 0 and e > s:
        print(f'FIX 3 block found at {s}-{e} by text markers, removing {e-s} chars')
        content = content[:s] + content[e:]
    else:
        print(f'FIX 3 NOT found: fix3_start={s}, fix4_start={e}')

# ── Block 2: FIX 5 + hero-visual-rail container query ──────────────────────
fix5_start = '/* \u2500\u2500 FIX 5: Container queries for hero visual panels'
carousel_start = '/* \u2500\u2500 Carousel dot active state'
s = content.find(fix5_start)
e = content.find(carousel_start)
if s >= 0 and e > s:
    print(f'FIX 5 block found at {s}-{e}, removing {e-s} chars')
    content = content[:s] + content[e:]
else:
    print(f'FIX 5 NOT found: fix5_start={s}, carousel_start={e}')

# ── Block 3: HEADSHOT SYSTEM canonical block ───────────────────────────────
hs_start = '/* ==========================================================================\n   HEADSHOT SYSTEM'
conviction_start = '/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n   CONVICTION ENGINE V1.0'
# Find the HEADSHOT SYSTEM block that's AFTER the END RESPONSIVENESS AUDIT comment
end_resp_marker = 'END RESPONSIVENESS SURGICAL AUDIT V1.1'
end_resp_pos = content.find(end_resp_marker)
if end_resp_pos >= 0:
    search_from = end_resp_pos
    hs_pos = content.find(hs_start, search_from)
    if hs_pos >= 0:
        # Find the next CONVICTION ENGINE comment after the headshot system
        conviction_pos = content.find(conviction_start, hs_pos)
        if conviction_pos > hs_pos:
            print(f'HEADSHOT SYSTEM found at {hs_pos}-{conviction_pos}, removing {conviction_pos-hs_pos} chars')
            content = content[:hs_pos] + content[conviction_pos:]
        else:
            print(f'CONVICTION ENGINE comment not found after HEADSHOT SYSTEM')
    else:
        print(f'HEADSHOT SYSTEM not found after END RESPONSIVENESS AUDIT')
else:
    print(f'END RESPONSIVENESS AUDIT marker not found')

# ── Additional small removals ───────────────────────────────────────────────

# Remove #hero .hero-grid-shell from 639px block
old1 = '@media (max-width: 639px) {\n  #hero .hero-grid-shell {\n    gap: clamp(1.25rem, 6vw, 2rem);\n  }\n\n  #hero .hero-availability-label {'
new1 = '@media (max-width: 639px) {\n  #hero .hero-availability-label {'
if old1 in content:
    print('Removing #hero .hero-grid-shell from 639px block')
    content = content.replace(old1, new1, 1)
else:
    print('SKIP: #hero .hero-grid-shell 639px not found')

# Remove #hero .mobile-headshot-wrap from 639px block
old2 = '  #hero .mobile-headshot-wrap {\n    padding-block: clamp(0.75rem, 2vw, 1.25rem);\n  }\n\n  #hero .hero-kicker,'
new2 = '  #hero .hero-kicker,'
if old2 in content:
    print('Removing #hero .mobile-headshot-wrap from 639px block')
    content = content.replace(old2, new2, 1)
else:
    print('SKIP: #hero .mobile-headshot-wrap 639px not found')

# Remove #hero .hero-grid-shell from 640-1023px block
old3 = '@media (min-width: 640px) and (max-width: 1023px) {\n  #hero .hero-grid-shell {\n    gap: clamp(1.5rem, 3vw, 2.25rem);\n  }\n\n  #hero .hero-availability-label {'
new3 = '@media (min-width: 640px) and (max-width: 1023px) {\n  #hero .hero-availability-label {'
if old3 in content:
    print('Removing #hero .hero-grid-shell from 640-1023px block')
    content = content.replace(old3, new3, 1)
else:
    print('SKIP: #hero .hero-grid-shell 640-1023px not found')

new_len = len(content)
print(f'\nOriginal: {original_len} chars, New: {new_len} chars, Removed: {original_len - new_len} chars')

with open(CSS_PATH, 'w', encoding='utf-8') as f:
    f.write(content)
print('Written successfully.')
