"""把一个 1024 图标裁成安卓需要的几档尺寸，并生成一张小尺寸预览图。

用法:
    python make_icons.py --src <1024.png> --out-dir <目标目录>
"""
import argparse
import os

from PIL import Image, ImageDraw

SIZES = [1024, 192, 144, 96, 72]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True)
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--preview", default="")
    a = ap.parse_args()

    os.makedirs(a.out_dir, exist_ok=True)
    im = Image.open(a.src).convert("RGBA")
    if im.size != (1024, 1024):
        im = im.resize((1024, 1024), Image.LANCZOS)

    for s in SIZES:
        out = im.resize((s, s), Image.LANCZOS)
        path = os.path.join(a.out_dir, "%dx%d.png" % (s, s))
        out.save(path, "PNG", optimize=True)
        print("wrote", path, s)

    # 预览：不同圆角蒙版下的小尺寸观感
    if a.preview:
        cells = []
        for s in (144, 96, 72):
            base = im.resize((s, s), Image.LANCZOS)
            for radius_ratio, label in ((0.50, "circle"), (0.22, "squircle")):
                mask = Image.new("L", (s, s), 0)
                d = ImageDraw.Draw(mask)
                r = int(s * radius_ratio)
                d.rounded_rectangle([0, 0, s - 1, s - 1], radius=r, fill=255)
                tile = Image.new("RGBA", (s, s), (0, 0, 0, 0))
                tile.paste(base, (0, 0), mask)
                cells.append((tile, "%d %s" % (s, label)))
        pad = 24
        w = sum(t.width for t, _ in cells) + pad * (len(cells) + 1)
        h = max(t.height for t, _ in cells) + pad * 2 + 18
        sheet = Image.new("RGBA", (w, h), (245, 245, 247, 255))
        x = pad
        for t, label in cells:
            sheet.alpha_composite(t, (x, pad))
            ImageDraw.Draw(sheet).text((x, pad + t.height + 4), label, fill=(60, 60, 60, 255))
            x += t.width + pad
        sheet.save(a.preview, "PNG")
        print("wrote", a.preview)


if __name__ == "__main__":
    main()
