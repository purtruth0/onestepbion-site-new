(function () {
  const HQ_ADDRESS_KO =
    "광주광역시 북구 첨단과기로 123(오룡동) 창업진흥센터 A동(S8) 216-2호";

  function ensureTip() {
    let tip = document.getElementById("cursor-tip");
    if (tip) return tip;

    tip = document.createElement("div");
    tip.id = "cursor-tip";
    tip.style.position = "fixed";
    tip.style.left = "0px";
    tip.style.top = "0px";
    tip.style.transform = "translate(12px, 12px)";
    tip.style.padding = "8px 10px";
    tip.style.borderRadius = "10px";
    tip.style.fontSize = "12px";
    tip.style.lineHeight = "1.3";
    tip.style.whiteSpace = "pre-line";
    tip.style.background = "rgba(0,0,0,0.65)";
    tip.style.color = "white";
    tip.style.pointerEvents = "none";
    tip.style.zIndex = "9999";
    tip.style.opacity = "0";
    tip.style.transition = "opacity 150ms ease";
    document.body.appendChild(tip);

    if (!window.__cursorTipMoveBound) {
      window.__cursorTipMoveBound = true;
      window.addEventListener("mousemove", (e) => {
        const t = document.getElementById("cursor-tip");
        if (!t || t.style.opacity === "0") return;
        t.style.left = e.clientX + "px";
        t.style.top = e.clientY + "px";
      });
    }
    return tip;
  }

  function init(root) {
    const btn = root.querySelector("#btn-directions");
    const panel = root.querySelector("#directions-panel");
    const linkEl = root.querySelector("#naver-map-link");
    const mapImg = root.querySelector("#map-img");

    // 네이버지도 링크
    if (linkEl) {
      linkEl.href = "https://map.naver.com/p/search/" + encodeURIComponent(HQ_ADDRESS_KO);
    }

    const tip = ensureTip();
    let tipTimer = null;
    const showTip = (text, ms = 3000) => {
      tip.textContent = text;
      tip.style.opacity = "1";
      if (tipTimer) clearTimeout(tipTimer);
      tipTimer = setTimeout(() => hideTip(), ms);
    };
    const hideTip = () => (tip.style.opacity = "0");

    // 토글
    if (btn && panel && !btn.dataset.bound) {
      btn.dataset.bound = "1";
      btn.addEventListener("click", () => {
        const isOpen = !panel.classList.contains("hidden");
        if (isOpen) {
          panel.classList.add("hidden");
          btn.setAttribute("aria-expanded", "false");
          hideTip();
        } else {
          panel.classList.remove("hidden");
          btn.setAttribute("aria-expanded", "true");
          showTip("지도 이미지를 클릭한 후,\n마우스 휠을 위로 올리면 확대됩니다.", 3000);
        }
      });
    }

    // 줌
    if (mapImg && mapImg.dataset.zoomBound !== "1") {
      mapImg.dataset.zoomBound = "1";
      mapImg.draggable = false;

      let armed = false;
      let scale = 1;
      const MIN = 1, MAX = 3, STEP = 0.12;

      const apply = () => {
        mapImg.style.transform = `scale(${scale})`;
        mapImg.style.transformOrigin = "center center";
        mapImg.style.transition = "transform 80ms linear";
        mapImg.style.cursor = armed ? "zoom-in" : "default";
      };

      mapImg.addEventListener("click", () => {
        armed = true;
        apply();
        showTip("휠 위로: 확대\n휠 아래로: 축소", 2000);
      });

      mapImg.addEventListener("wheel", (e) => {
        if (!armed) return;
        e.preventDefault();
        // ✅ 휠 UP(음수)=확대, DOWN(양수)=축소
        scale = (e.deltaY < 0) ? (scale + STEP) : (scale - STEP);
        scale = Math.max(MIN, Math.min(MAX, scale));
        apply();
      }, { passive: false });

      apply();
    }
  }

  // 전역으로 노출
  window.FooterDirections = { init };
})();
