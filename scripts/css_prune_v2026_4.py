#!/usr/bin/env python3
"""Remove v2026.4 dead CSS blocks F1, F3, E1, E5."""

css_path = '/home/scar/Documents/oscar-portfolio-main/app/globals.css'
lines = open(css_path).readlines()
original_count = len(lines)

# Blocks to delete (1-indexed, inclusive). Work bottom-up.
# F1: 4575-4588, F3: 4600-4606, E1: 4607-4648, E5: 4722-4749
blocks_to_delete = [
    (4722, 4749),  # E5 — bottom first
    (4607, 4648),  # E1
    (4600, 4606),  # F3
    (4575, 4588),  # F1
]

for start, end in blocks_to_delete:
    # Convert to 0-indexed
    del lines[start-1:end]
    print(f'Deleted lines {start}-{end} ({end-start+1} lines removed)')

with open(css_path, 'w') as f:
    f.writelines(lines)

print(f'\nOriginal: {original_count} lines → Now: {len(lines)} lines ({original_count - len(lines)} removed)')
