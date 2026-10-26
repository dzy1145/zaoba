"""候选图标对比表：每个候选一行，含 1024 原图缩略 + 144/96/72 小尺寸圆角预览。

用法:
    python contact_sheet.py --out sheet.png --items a.png:标签 b.png:标签 ...
"""
import argparse
import os

from PIL import Image, ImageDraw, ImageFont


def load_font(size):
    for name in ("msyh.ttc", "msyhbd.ttc", "segoeui.ttf"):
        p = os.path.join(os.environ.get("WINDIR", r"C:\Windows"), "Fonts", name)
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()


def masked(im, s, radius_ratio):
    base = im.resize((s, s), Image.LANCZOS)
    mask = Image.new("L", (s, s), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * radius_ratio), fill=255)
    tile = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    tile.paste(base, (0, 0), mask)
    return tile


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--items", nargs="+", required=True, help="path:label")
    a = ap.parse_args()

    f = load_font(20)
    big, mid, small, tiny = 190, 96, 72, 56
    row_h = big + 24
    label_w = 250
    pad = 20
    widths = [big, 8, mid, 8, small, 8, tiny]
    content_w = sum(widths) + pad * 2
    W = label_w + content_w
    H = row_h * len(a.items) + pad
    sheet = Image.new("RGBA", (W, H), (250, 250, 252, 255))
    d = ImageDraw.Draw(sheet)

    for i, spec in enumerate(a.items):
        path, label = spec.rsplit(":", 1)
        im = Image.open(path).convert("RGBA")
        y = pad + i * row_h
        d.text((pad, y + 8), label, fill=(30, 30, 34, 255), font=f)
        x = label_w
        sheet.alpha_composite(masked(im, big, 0.18), (x, y))
        x += big + 8
        sheet.alpha_composite(masked(im, mid, 0.50), (x, y + (big - mid) // 2))
        x += mid + 8
        sheet.alpha_composite(masked(im, small, 0.50), (x, y + (big - small) // 2))
        x += small + 8
        sheet.alpha_composite(masked(im, tiny, 0.22), (x, y + (big - tiny) // 2))
        d.line([(0, y + row_h - 6), (W, y + row_h - 6)], fill=(228, 228, 234, 255))

    sheet.convert("RGB").save(a.out, "PNG")
    print("wrote", a.out)


if __name__ == "__main__":
    main()
