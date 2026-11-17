# Original artwork processing

The 78 original JPEGs were retrieved from the owner's linked Google Drive folder. Originals remain unchanged in Drive and in the separate local working `raw/` directory; they are deliberately excluded from the app source. No replacement tarot art or generated reconstruction was used.

## Reproduce the export

1. Download the inventory's exact original files into a separate directory, keeping `IMG_####.jpg` filenames.
2. Install Python dependencies in a virtual environment: `pip install Pillow numpy opencv-python-headless`.
3. Run `python scripts/process_images.py --raw-dir /path/to/originals`.
4. Run `python scripts/validate_assets.py`.

`docs/card-image-mapping.json` contains a unique legacy app ID, actual card name, original filename, source URL, SHA-256 checksum, four reviewed crop corners, and output filename for each card. Coordinates refer to the full-resolution image **after EXIF orientation is applied**, ordered top left, top right, bottom right, bottom left. A checksum mismatch stops processing rather than cropping a different photo.

## What was done

- Inspected all 78 printed titles and matched them to the 22 Majors and four sets of 14 suit cards.
- Used the printed border to remove clothing, furniture and surrounding background; reviewed perspective candidates and manually corrected unreliable crops.
- Applied perspective correction, EXIF orientation normalization, a small border margin and consistent 720 × 1200 upright output.
- Applied gentle brightness (1.02), contrast (1.015), and limited sharpening. Preserved the artwork's cream paper and original color character.
- Exported optimized JPEGs with descriptive filenames and removed EXIF metadata from app assets.
- Checked all 78 exported images in contact sheets and validated unique mappings and decoded dimensions.

## Source limits and suggested retakes

These are cleaned photos, not scans. Some originals have specular glare and uneven lighting. Those effects remain where removing them would require inventing artwork. Several photos also reach or clip the top printed border: The Tower, King of Cups, The Chariot, The Sun, Two of Cups, Strength, The Empress, Two of Coins, Two of Wands, The High Priestess, Knave of Wands and The Fool. Their available artwork was preserved; missing source pixels were not reconstructed. See per-card notes in the mapping.

For higher fidelity, retake affected cards flat under diffuse light with the camera parallel to the card, no flash, all four edges visible and a small contrasting background margin. A new photo requires new checksums/corners and visual review before replacing an app asset.

## Deck terminology and numbering

The printed cards use **Coins** and **Knave**. The guide also uses Pentacles and Page; these remain search aliases. The artwork prints **Justice VIII** and **Strength XI**, which takes precedence over the opposite ordering in the guide's introductory overview. Existing app IDs (`major-8` for Strength, `major-11` for Justice and `pentacles-*`) remain stable so saved progress survives.
