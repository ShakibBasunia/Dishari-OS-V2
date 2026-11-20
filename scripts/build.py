# scripts/build.py - Dishari OS Build Script in Python
import os
import re

repo_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
root_dir = os.path.join(repo_dir, "public")
routes = [
    "app", "login", "demo-user", "demo-admin", "admin", "sdg4", "data",
    "security", "architecture", "audit"
]

shell_path = os.path.join(repo_dir, "scripts", "shell.html")
with open(shell_path, "r", encoding="utf-8") as f:
    tpl = f.read()

# 1. Generate public/index.html
index_html = tpl.replace("<!--BASE-->", '<base href="./">')
with open(os.path.join(root_dir, "index.html"), "w", encoding="utf-8") as f:
    f.write(index_html)
print(f"Generated public/index.html")

# 2. Generate route folders
for r in routes:
    r_dir = os.path.join(root_dir, r)
    os.makedirs(r_dir, exist_ok=True)
    r_html = tpl.replace("<!--BASE-->", '<base href="../">')
    with open(os.path.join(r_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(r_html)
print(f"Generated {len(routes)} route folders in public/")

# 3. Generate standalone single-file bundle
html = tpl.replace("<!--BASE-->", "")
html = re.sub(r'<meta http-equiv="Content-Security-Policy"[^>]*>\n?', "", html)
html = re.sub(r'<link rel="(icon|manifest|preconnect)"[^>]*>\n?', "", html)

css_path = os.path.join(root_dir, "assets", "css", "dishari.css")
with open(css_path, "r", encoding="utf-8") as f:
    css_content = f.read()
html = html.replace(
    '<link rel="stylesheet" href="assets/css/dishari.css">',
    f"<style>{css_content}</style>"
)

html = html.replace(
    '<script src="assets/js/core/core.js"></script>',
    '<script>window.DISHARI_HASH = true;</script>\n  <script src="assets/js/core/core.js"></script>'
)

def replace_script(match):
    src = match.group(1)
    script_file = os.path.join(root_dir, src)
    if os.path.exists(script_file):
        with open(script_file, "r", encoding="utf-8") as sf:
            s_content = sf.read()
        safe_content = re.sub(r'</script', r'<\/script', s_content, flags=re.IGNORECASE)
        return f"<script>\n{safe_content}\n</script>"
    return match.group(0)

html = re.sub(r'<script src="([^"]+)"></script>', replace_script, html)

import base64

# Embed local images as base64 in standalone bundle for 100% offline self-containment
hero_webp_path = os.path.join(root_dir, "assets", "img", "hero-illustration.webp")
if os.path.exists(hero_webp_path):
    with open(hero_webp_path, "rb") as imf:
        b64_data = base64.b64encode(imf.read()).decode('utf-8')
    data_uri = f"data:image/webp;base64,{b64_data}"
    html = html.replace("assets/img/hero-illustration.webp", data_uri)
    html = html.replace("assets/img/hero-illustration.png", data_uri)

dist_dir = os.path.join(repo_dir, "dist")
os.makedirs(dist_dir, exist_ok=True)
dist_file = os.path.join(dist_dir, "dishari-os-standalone.html")
with open(dist_file, "w", encoding="utf-8") as f:
    f.write(html)
print(f"Generated dist/dishari-os-standalone.html ({round(len(html)/1024)} KB)")
