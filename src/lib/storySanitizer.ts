const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  's',
  'u',
  'code',
  'blockquote',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'span',
]);

const ALLOWED_STYLES = new Set(['color', 'font-size', 'text-align']);
const COLOR_ALLOWLIST = new Set([
  '#737373',
  '#404040',
  '#3b82f6',
  '#ef4444',
  '#22c55e',
  '#eab308',
  '#ffffff',
  '#f97316',
  '#ec4899',
  '#8b5cf6',
  '#14b8a6',
  '#84cc16',
  '#f59e0b',
  '#0f172a',
  'rgb(115, 115, 115)',
  'rgb(64, 64, 64)',
  'rgb(59, 130, 246)',
  'rgb(239, 68, 68)',
  'rgb(34, 197, 94)',
  'rgb(234, 179, 8)',
  'rgb(255, 255, 255)',
  'rgb(249, 115, 22)',
  'rgb(236, 72, 153)',
  'rgb(139, 92, 246)',
  'rgb(20, 184, 166)',
  'rgb(132, 204, 22)',
  'rgb(245, 158, 11)',
  'rgb(15, 23, 42)',
]);
const FONT_SIZE_ALLOWLIST = new Set(['12px', '14px', '16px', '18px', '20px', '24px', '32px', '40px', '48px', '64px', '72px']);
const TEXT_ALIGN_ALLOWLIST = new Set(['left', 'center', 'right', 'justify']);

function sanitizeInlineStyle(styleValue: string) {
  const declarations = styleValue
    .split(';')
    .map((declaration) => declaration.trim())
    .filter(Boolean);

  const safeDeclarations: string[] = [];

  for (const declaration of declarations) {
    const [rawProperty, rawValue] = declaration.split(':');

    if (!rawProperty || !rawValue) {
      continue;
    }

    const property = rawProperty.trim().toLowerCase();
    const value = rawValue.trim().toLowerCase();

    if (!ALLOWED_STYLES.has(property)) {
      continue;
    }

    if (property === 'color' && COLOR_ALLOWLIST.has(value)) {
      safeDeclarations.push(`color: ${value}`);
    }

    if (property === 'font-size' && FONT_SIZE_ALLOWLIST.has(value)) {
      safeDeclarations.push(`font-size: ${value}`);
    }

    if (property === 'text-align' && TEXT_ALIGN_ALLOWLIST.has(value)) {
      safeDeclarations.push(`text-align: ${value}`);
    }
  }

  return safeDeclarations.join('; ');
}

export function sanitizeStoryHtml(html: string) {
  if (typeof window === 'undefined') {
    return html;
  }

  const parser = new DOMParser();
  const documentFragment = parser.parseFromString(html, 'text/html');

  const sanitizeNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      node.parentNode?.removeChild(node);
      return;
    }

    const element = node as HTMLElement;
    const tagName = element.tagName.toLowerCase();

    if (!ALLOWED_TAGS.has(tagName)) {
      const parent = element.parentNode;

      while (element.firstChild) {
        parent?.insertBefore(element.firstChild, element);
      }

      parent?.removeChild(element);
      return;
    }

    for (const attribute of Array.from(element.attributes)) {
      if (attribute.name !== 'style') {
        element.removeAttribute(attribute.name);
      }
    }

    if (element.hasAttribute('style')) {
      const safeStyle = sanitizeInlineStyle(element.getAttribute('style') || '');

      if (safeStyle) {
        element.setAttribute('style', safeStyle);
      } else {
        element.removeAttribute('style');
      }
    }

    for (const child of Array.from(element.childNodes)) {
      sanitizeNode(child);
    }
  };

  for (const child of Array.from(documentFragment.body.childNodes)) {
    sanitizeNode(child);
  }

  return documentFragment.body.innerHTML;
}
