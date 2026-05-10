import { ComponentNode } from '@/types';

// ── React JSX ──
export function toJSX(node: ComponentNode, depth = 0): string {
  const indent = '  '.repeat(depth);
  const count = node.count > 1 ? ` {/* ×${node.count} */}` : '';
  if (!node.children.length) return `${indent}<${node.name} />${count}`;
  const kids = node.children.map(c => toJSX(c, depth + 1)).join('\n');
  return `${indent}<${node.name}>${count}\n${kids}\n${indent}</${node.name}>`;
}

// ── HTML ──
function toHTMLTag(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('nav') || n.includes('navbar')) return 'nav';
  if (n.includes('header')) return 'header';
  if (n.includes('footer')) return 'footer';
  if (n.includes('hero') || n.includes('section')) return 'section';
  if (n.includes('button') || n.includes('cta') || n.includes('btn')) return 'button';
  if (n.includes('input') || n.includes('search')) return 'input';
  if (n.includes('img') || n.includes('image') || n.includes('logo')) return 'img';
  if (n.includes('list')) return 'ul';
  if (n.includes('item')) return 'li';
  if (n.includes('link')) return 'a';
  return 'div';
}

function toKebab(str: string): string {
  return str.replace(/([A-Z])/g, m => '-' + m.toLowerCase()).replace(/^-/, '');
}

export function toHTML(node: ComponentNode, depth = 0): string {
  const indent = '  '.repeat(depth);
  const tag = toHTMLTag(node.name);
  const cls = toKebab(node.name);
  const count = node.count > 1 ? ` <!-- ×${node.count} -->` : '';
  if (!node.children.length) return `${indent}<${tag} class="${cls}"></${tag}>${count}`;
  const kids = node.children.map(c => toHTML(c, depth + 1)).join('\n');
  return `${indent}<${tag} class="${cls}">${count}\n${kids}\n${indent}</${tag}>`;
}

// ── Tailwind ──
function layoutToTailwind(layout: string): string {
  const map: Record<string, string> = {
    'flex-row': 'flex flex-row items-center',
    'flex-col': 'flex flex-col',
    'grid': 'grid grid-cols-auto',
    'stack': 'flex flex-col gap-4',
    'inline': 'inline-flex items-center',
    'absolute': 'relative',
  };
  return map[layout] || 'flex flex-col';
}

export function toTailwind(node: ComponentNode, depth = 0): string {
  const indent = '  '.repeat(depth);
  const classes = layoutToTailwind(node.layout);
  const count = node.count > 1 ? ` {/* ×${node.count} */}` : '';
  if (!node.children.length) {
    return `${indent}<div className="${classes} /* ${node.name} */" />${count}`;
  }
  const kids = node.children.map(c => toTailwind(c, depth + 1)).join('\n');
  return `${indent}<div className="${classes} /* ${node.name} */">${count}\n${kids}\n${indent}</div>`;
}

// ── JSON ──
export function toJSON(node: ComponentNode): string {
  return JSON.stringify(node, null, 2);
}
