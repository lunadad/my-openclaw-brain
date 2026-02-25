#!/usr/bin/env python3
"""
museumexpress.stibee.com 최신 뉴스레터 3개를 가져와 script.js의
newsletters 배열을 자동으로 업데이트합니다.

GitHub Actions에서 매주 수요일 08:00 KST에 실행됩니다.
"""

import re
import sys
import time
import requests
from bs4 import BeautifulSoup
from datetime import datetime

BASE_URL = "https://museumexpress.stibee.com/p/{n}/"
SCRIPT_JS = "script.js"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; newsletter-updater/1.0)"}


def fetch_issue(n):
    """이슈 n을 가져와 (title, thumbnail, date, link) 딕셔너리 반환. 없으면 None."""
    url = BASE_URL.format(n=n)
    try:
        res = requests.get(url, headers=HEADERS, timeout=15)
        if res.status_code in (404, 410):
            return None
        if res.status_code != 200:
            print(f"[warn] issue {n}: HTTP {res.status_code}", file=sys.stderr)
            return None

        soup = BeautifulSoup(res.text, "html.parser")

        # 제목: og:title 우선, 없으면 <title>
        og_title = soup.find("meta", property="og:title")
        title = (og_title.get("content", "").strip() if og_title else "") or \
                (soup.find("title") or {}).get_text(strip=True) or \
                f"뉴스레터 #{n}"

        # 썸네일: og:image 우선, 없으면 첫 번째 stibee 이미지
        og_image = soup.find("meta", property="og:image")
        thumbnail = og_image.get("content", "").strip() if og_image else ""
        if not thumbnail:
            for img in soup.find_all("img"):
                src = img.get("src", "")
                if "stibee.com" in src and "115188" in src:
                    thumbnail = src
                    break

        # 날짜: og:article:published_time 또는 meta date
        date_str = ""
        for prop in ("article:published_time", "og:published_time"):
            tag = soup.find("meta", property=prop)
            if tag and tag.get("content"):
                try:
                    dt = datetime.fromisoformat(tag["content"][:10])
                    date_str = f"{dt.year}. {dt.month}. {dt.day}."
                except ValueError:
                    pass
                break

        return {
            "title": title,
            "thumbnail": thumbnail,
            "link": url,
            "date": date_str,
        }
    except Exception as e:
        print(f"[error] issue {n}: {e}", file=sys.stderr)
        return None


def get_current_latest():
    """script.js의 newsletters 링크에서 현재 최신 이슈 번호를 읽어옴."""
    try:
        with open(SCRIPT_JS, "r", encoding="utf-8") as f:
            content = f.read()
        matches = re.findall(r"museumexpress\.stibee\.com/p/(\d+)/", content)
        if matches:
            return max(int(m) for m in matches)
    except FileNotFoundError:
        pass
    return 19  # 최소 기준값


def find_latest_issue(start):
    """start+1부터 순서대로 시도해 404가 나오면 직전 번호를 반환."""
    n = start
    while True:
        result = fetch_issue(n + 1)
        if result is None:
            return n
        n += 1
        time.sleep(0.5)


def update_script_js(newsletters):
    """script.js의 newsletters 배열을 새 데이터로 교체."""
    with open(SCRIPT_JS, "r", encoding="utf-8") as f:
        content = f.read()

    items = []
    for nl in newsletters:
        safe_title = nl["title"].replace("'", "\\'")
        items.append(
            f"    {{\n"
            f"        title: '{safe_title}',\n"
            f"        date: '{nl['date']}',\n"
            f"        thumbnail: '{nl['thumbnail']}',\n"
            f"        link: '{nl['link']}'\n"
            f"    }}"
        )

    new_array = (
        "// ── Newsletter Data (매주 수요일 GitHub Actions로 자동 업데이트) ──────────────\n"
        "const newsletters = [\n"
        + ",\n".join(items)
        + "\n];"
    )

    new_content = re.sub(
        r"// ── Newsletter Data.*?const newsletters = \[.*?\];",
        new_array,
        content,
        flags=re.DOTALL,
    )

    with open(SCRIPT_JS, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"✅ script.js 업데이트 완료 ({len(newsletters)}개 뉴스레터)")
    for nl in newsletters:
        print(f"   - {nl['title']} ({nl['date']})")


def main():
    current_latest = get_current_latest()
    print(f"현재 최신 이슈: #{current_latest}")

    latest = find_latest_issue(current_latest)
    print(f"실제 최신 이슈: #{latest}")

    if latest == current_latest:
        print("새 이슈 없음. script.js 변경 없이 종료.")
        sys.exit(0)

    # 최신 3개 수집
    newsletters = []
    for n in range(latest, max(latest - 3, 0), -1):
        info = fetch_issue(n)
        if info:
            newsletters.append(info)
        time.sleep(0.5)

    if not newsletters:
        print("❌ 뉴스레터 수집 실패!", file=sys.stderr)
        sys.exit(1)

    update_script_js(newsletters)


if __name__ == "__main__":
    main()
