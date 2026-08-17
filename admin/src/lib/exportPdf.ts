import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const A4_PX = 794;
const A4_PX_H = 1123;

const LAYOUT_PROPS = [
  "display",
  "flexDirection",
  "flexWrap",
  "justifyContent",
  "alignItems",
  "alignContent",
  "alignSelf",
  "gap",
  "rowGap",
  "columnGap",
  "gridTemplateColumns",
  "gridTemplateRows",
  "gridColumn",
  "gridRow",
  "flex",
  "flexGrow",
  "flexShrink",
  "flexBasis",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "width",
  "height",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "fontStyle",
  "lineHeight",
  "letterSpacing",
  "textAlign",
  "textTransform",
  "textDecoration",
  "whiteSpace",
  "wordBreak",
  "verticalAlign",
  "boxSizing",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "zIndex",
  "opacity",
  "visibility",
  "overflow",
  "objectFit",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderTopStyle",
  "borderRightStyle",
  "borderBottomStyle",
  "borderLeftStyle",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomRightRadius",
  "borderBottomLeftRadius",
] as const;

let colorCanvas: CanvasRenderingContext2D | null = null;

function toRgb(color: string): string {
  if (!color || color === "transparent") return "transparent";
  if (color.startsWith("#") || color.startsWith("rgb")) return color;
  try {
    if (!colorCanvas) {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      colorCanvas = canvas.getContext("2d");
    }
    if (!colorCanvas) return color;
    colorCanvas.fillStyle = "#000000";
    colorCanvas.fillStyle = color;
    return String(colorCanvas.fillStyle || color);
  } catch {
    return color;
  }
}

function applyComputed(live: Element, clone: Element, isRoot: boolean) {
  if (!(live instanceof HTMLElement || live instanceof SVGElement)) return;
  if (!(clone instanceof HTMLElement || clone instanceof SVGElement)) return;

  const cs = window.getComputedStyle(live);
  const style = clone.style;

  style.color = toRgb(cs.color);
  const bg = cs.backgroundColor;
  style.backgroundColor =
    bg === "rgba(0, 0, 0, 0)" || bg === "transparent" ? "transparent" : toRgb(bg);
  style.borderTopColor = toRgb(cs.borderTopColor);
  style.borderRightColor = toRgb(cs.borderRightColor);
  style.borderBottomColor = toRgb(cs.borderBottomColor);
  style.borderLeftColor = toRgb(cs.borderLeftColor);
  style.textDecorationColor = toRgb(cs.textDecorationColor);

  if (clone instanceof SVGElement) {
    const fill = cs.fill;
    const stroke = cs.stroke;
    if (fill && fill !== "none") style.fill = toRgb(fill);
    if (stroke && stroke !== "none") style.stroke = toRgb(stroke);
  }

  for (const prop of LAYOUT_PROPS) {
    if (isRoot && (prop === "width" || prop === "maxWidth" || prop === "minHeight" || prop === "height")) {
      continue;
    }
    const value = cs.getPropertyValue(
      prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
    );
    if (value) style.setProperty(prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`), value);
  }

  style.boxSizing = "border-box";
  if (cs.position === "fixed") {
    style.position = "absolute";
  }
}

function flattenTree(live: Element, clone: Element, isRoot = false) {
  applyComputed(live, clone, isRoot);
  const liveKids = Array.from(live.children);
  const cloneKids = Array.from(clone.children);
  const n = Math.min(liveKids.length, cloneKids.length);
  for (let i = 0; i < n; i++) {
    flattenTree(liveKids[i], cloneKids[i], false);
  }
}

export async function exportElementToA4Pdf(element: HTMLElement, filename: string) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    foreignObjectRendering: false,
    scrollX: 0,
    scrollY: -window.scrollY,
    windowWidth: A4_PX,
    onclone: (clonedDoc) => {
      const cloneEl = clonedDoc.querySelector("[data-pdf-root]") as HTMLElement | null;
      if (!cloneEl) return;

      flattenTree(element, cloneEl, true);

      cloneEl.style.width = `${A4_PX}px`;
      cloneEl.style.maxWidth = `${A4_PX}px`;
      cloneEl.style.minHeight = `${A4_PX_H}px`;
      cloneEl.style.height = "auto";
      cloneEl.style.boxShadow = "none";
      cloneEl.style.borderRadius = "0";
      cloneEl.style.margin = "0";
      cloneEl.style.transform = "none";
      cloneEl.style.overflow = "visible";
      cloneEl.style.backgroundColor = "#ffffff";

      clonedDoc.querySelectorAll("style, link[rel='stylesheet']").forEach((node) => {
        node.parentNode?.removeChild(node);
      });
    },
  });

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const pageH = 297;
  const imgData = canvas.toDataURL("image/png");
  const imgH = (canvas.height * pageW) / canvas.width;

  if (imgH <= pageH + 0.5) {
    pdf.addImage(imgData, "PNG", 0, 0, pageW, imgH, undefined, "FAST");
  } else {
    const scale = pageH / imgH;
    const w = pageW * scale;
    const x = (pageW - w) / 2;
    pdf.addImage(imgData, "PNG", x, 0, w, pageH, undefined, "FAST");
  }

  pdf.save(filename);
}
