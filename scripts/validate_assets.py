#!/usr/bin/env python3
"""Validate completeness, filenames, image integrity and unique card mappings."""
from pathlib import Path
from PIL import Image
import json
root=Path(__file__).resolve().parents[1];cards=json.loads((root/'docs/card-image-mapping.json').read_text())['cards']
assert len(cards)==78
for key in ['id','name','raw','file']:
 assert len({c[key] for c in cards})==78, f'Duplicate {key}'
assert sum(c['id'].startswith('major-') for c in cards)==22
for suit in ['cups','wands','swords','pentacles']:
 assert {c['id'] for c in cards if c['id'].startswith(suit+'-')}=={f'{suit}-{i}' for i in range(14)}
for c in cards:
 assert c['title_verified'] is True
 assert len(c['corners'])==4
 with Image.open(root/'assets/cards'/c['file']) as img:
  assert img.size==(720,1200),(c['file'],img.size)
  assert not img.getexif(),f'EXIF remains: {c["file"]}'
  img.verify()
print('PASS: 78 unique cards, source mappings, verified title records, valid 720×1200 images without EXIF.')
