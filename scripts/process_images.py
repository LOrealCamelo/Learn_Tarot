#!/usr/bin/env python3
"""Reproduce reviewed perspective crops; never changes the source photos.
Usage: python scripts/process_images.py --raw-dir /path/to/originals
Requires Pillow, numpy and opencv-python-headless. Mapping uses EXIF-upright coordinates.
"""
import argparse,hashlib,json
from pathlib import Path
import cv2,numpy as np
from PIL import Image,ImageOps,ImageEnhance,ImageFilter
root=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--raw-dir',type=Path,required=True);parser.add_argument('--output-dir',type=Path,default=root/'assets/cards');args=parser.parse_args();args.output_dir.mkdir(parents=True,exist_ok=True)
data=json.loads((root/'docs/card-image-mapping.json').read_text())
for card in data['cards']:
 source=args.raw_dir/card['raw']
 if hashlib.sha256(source.read_bytes()).hexdigest()!=card['raw_sha256']:raise ValueError('Source checksum mismatch: '+card['raw'])
 pic=ImageOps.exif_transpose(Image.open(source)).convert('RGB');im=np.array(pic);corners=np.array(card['corners'],np.float32)
 # A half-percent margin keeps the printed border line. Clip to available pixels.
 center=corners.mean(axis=0);corners=center+(corners-center)*1.005;corners[:,0]=np.clip(corners[:,0],0,im.shape[1]-1);corners[:,1]=np.clip(corners[:,1],0,im.shape[0]-1)
 matrix=cv2.getPerspectiveTransform(corners,np.array([[0,0],[719,0],[719,1199],[0,1199]],np.float32))
 clean=Image.fromarray(cv2.warpPerspective(im,matrix,(720,1200),flags=cv2.INTER_CUBIC));clean=ImageEnhance.Brightness(clean).enhance(1.02);clean=ImageEnhance.Contrast(clean).enhance(1.015);clean=clean.filter(ImageFilter.UnsharpMask(radius=.7,percent=45,threshold=4));clean.save(args.output_dir/card['file'],quality=92,optimize=True,exif=b'')
 print(card['name'])
print('Exported',len(data['cards']),'reviewed assets; originals unchanged.')
