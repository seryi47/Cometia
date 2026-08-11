#!/usr/bin/env python3
"""Envía las URLs del sitemap de Cometia a IndexNow (Bing/Yandex). Uso: python3 submit-indexnow.py [dominio]"""
import sys, json, urllib.request, urllib.error
import xml.etree.ElementTree as ET
HOST = sys.argv[1] if len(sys.argv) > 1 else "cometia.es"
KEY = "ac2fe08f7bb44606576bb8ac42aab398"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"
SITEMAP = f"https://{HOST}/sitemap-0.xml"
def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Cometia-IndexNow"})
    return urllib.request.urlopen(req, timeout=20).read()
xml = get(SITEMAP).decode()
ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
urls = [loc.text for loc in ET.fromstring(xml).findall(".//s:loc", ns)]
print(f"{len(urls)} URLs en {SITEMAP}")
if not urls: raise SystemExit("Sin URLs (¿dominio en vivo?)")
payload = {"host": HOST, "key": KEY, "keyLocation": KEY_LOCATION, "urlList": urls}
req = urllib.request.Request("https://api.indexnow.org/IndexNow", data=json.dumps(payload).encode(),
    headers={"Content-Type": "application/json; charset=utf-8"}, method="POST")
try:
    with urllib.request.urlopen(req, timeout=30) as r:
        print("IndexNow OK →", r.status, "(200/202 = aceptado)")
except urllib.error.HTTPError as e:
    print("IndexNow HTTP", e.code, "→", e.read().decode()[:300])
