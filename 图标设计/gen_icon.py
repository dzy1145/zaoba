"""早八 App 图标生成器 —— 直连本机 ComfyUI (Qwen-Image 2.1)。

用法:
    python gen_icon.py --prompt-file p1.txt --prefix v1_sunrise --mode turbo --seed 1

只依赖标准库。生成的图落在 <ComfyUI 输出目录>\ 下。
"""
import argparse
import json
import time
import urllib.parse
import urllib.request

API = "http://127.0.0.1:8188"

TURBO_SIGMAS = "1.0, 0.978453, 0.95418, 0.926626, 0.89508, 0.845148, 0.704534, 0.414568, 0"

UNET_BASE = "qwen_image_2.1_int8_convrot.safetensors"
UNET_TURBO = "qwen_image_2.1_turbo_int8_convrot.safetensors"
CLIP_NAME = "qwen3vl_8b_int8_convrot.safetensors"
VAE_NAME = "qwen_image_2.1_vae_bf16.safetensors"


def build(prompt, negative, seed, width, height, mode, steps, prefix):
    unet = UNET_TURBO if mode == "turbo" else UNET_BASE
    g = {
        "1": {"class_type": "UNETLoader",
              "inputs": {"unet_name": unet, "weight_dtype": "default"}},
        "2": {"class_type": "CLIPLoader",
              "inputs": {"clip_name": CLIP_NAME, "type": "qwen_image", "device": "default"}},
        "3": {"class_type": "VAELoader", "inputs": {"vae_name": VAE_NAME}},
        "4": {"class_type": "TextEncodeQwenImage21",
              "inputs": {"clip": ["2", 0], "prompt": prompt,
                         "negative_prompt": negative, "resolution": 1024}},
        "5": {"class_type": "EmptyLatentImage",
              "inputs": {"width": width, "height": height, "batch_size": 1}},
        "11": {"class_type": "VAEDecode", "inputs": {"samples": ["10", 0], "vae": ["3", 0]}},
        "12": {"class_type": "SaveImage",
               "inputs": {"images": ["11", 0], "filename_prefix": "zaoba_icon/" + prefix}},
    }
    if mode == "turbo":
        g["6"] = {"class_type": "CFGGuider",
                  "inputs": {"model": ["1", 0], "positive": ["4", 0],
                             "negative": ["4", 1], "cfg": 1.0}}
        g["7"] = {"class_type": "KSamplerSelect", "inputs": {"sampler_name": "euler"}}
        g["8"] = {"class_type": "ManualSigmas", "inputs": {"sigmas": TURBO_SIGMAS}}
        g["9"] = {"class_type": "RandomNoise", "inputs": {"noise_seed": seed}}
        g["10"] = {"class_type": "SamplerCustomAdvanced",
                   "inputs": {"noise": ["9", 0], "guider": ["6", 0], "sampler": ["7", 0],
                              "sigmas": ["8", 0], "latent_image": ["5", 0]}}
    else:
        g["10"] = {"class_type": "KSampler",
                   "inputs": {"model": ["1", 0], "positive": ["4", 0], "negative": ["4", 1],
                              "latent_image": ["5", 0], "seed": seed, "steps": steps,
                              "cfg": 1.0, "sampler_name": "euler", "scheduler": "simple",
                              "denoise": 1.0}}
    return g


def post(endpoint, payload):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(API + endpoint, data=data,
                                 headers={"Content-Type": "application/json"})
    return json.loads(urllib.request.urlopen(req, timeout=60).read().decode("utf-8"))


def get(endpoint):
    return json.loads(urllib.request.urlopen(API + endpoint, timeout=30).read().decode("utf-8"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prompt")
    ap.add_argument("--prompt-file")
    ap.add_argument("--negative", default="text, letters, words, numbers, watermark, signature, "
                                           "blurry, low quality, jpeg artifacts, cluttered, "
                                           "photographic background, extra objects, deformed")
    ap.add_argument("--seed", type=int, default=1)
    ap.add_argument("--steps", type=int, default=30)
    ap.add_argument("--width", type=int, default=1024)
    ap.add_argument("--height", type=int, default=1024)
    ap.add_argument("--mode", choices=["turbo", "base"], default="turbo")
    ap.add_argument("--prefix", required=True)
    a = ap.parse_args()

    prompt = a.prompt
    if a.prompt_file:
        with open(a.prompt_file, encoding="utf-8") as f:
            prompt = f.read().strip()

    graph = build(prompt, a.negative, a.seed, a.width, a.height, a.mode, a.steps, a.prefix)
    t0 = time.time()
    res = post("/prompt", {"prompt": graph, "client_id": "zaoba-icon-gen"})
    pid = res["prompt_id"]
    print("queued", pid, "mode", a.mode, "seed", a.seed, flush=True)

    while True:
        h = get("/history/" + pid)
        if pid in h:
            entry = h[pid]
            status = entry.get("status", {})
            if status.get("status_str") == "error":
                print("ERROR:", json.dumps(status, ensure_ascii=False)[:2000])
                return 1
            imgs = []
            for node in entry.get("outputs", {}).values():
                imgs += node.get("images", [])
            print("done in %.1fs" % (time.time() - t0))
            for im in imgs:
                q = urllib.parse.urlencode({"filename": im["filename"],
                                            "subfolder": im.get("subfolder", ""),
                                            "type": im.get("type", "output")})
                print("FILE", im["filename"], API + "/view?" + q)
            return 0
        time.sleep(2)


if __name__ == "__main__":
    raise SystemExit(main())
