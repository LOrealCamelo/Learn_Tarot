#!/usr/bin/env python3
"""Regenerate the offline asset list/version whenever runtime files change."""
from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parents[1]
files=['index.html','styles.css','tattoo.css','app.js','deck-content.js','curriculum.js','design-nav.js','offline.js','manifest.webmanifest']+[p.relative_to(root).as_posix() for p in sorted((root/'assets').rglob('*')) if p.is_file()]
files += [p.relative_to(root).as_posix() for p in sorted((root/'rider').rglob('*')) if p.is_file()]
version=hashlib.sha256(b''.join((root/f).read_bytes() for f in files)).hexdigest()[:16]
template=(root/'scripts/service-worker-template.js').read_text()
(root/'service-worker.js').write_text(template.replace('__VERSION__',version).replace('__ASSETS__',json.dumps(files,indent=2)))
print('Offline bundle:',len(files),'files,',round(sum((root/f).stat().st_size for f in files)/1024**2,1),'MiB, version',version)
