export const COMPONENT_ICONS: Record<string, string> = {
  page: '📄', navbar: '🔲', nav: '🔲', header: '📌',
  hero: '🌟', footer: '📎', sidebar: '📋', modal: '⬜',
  button: '🔘', cta: '🔘', input: '📝', form: '📋',
  search: '🔍', card: '🃏', grid: '⊞', list: '📋',
  logo: '◈', icon: '◆', image: '🖼', avatar: '👤',
  heading: '𝗛', text: '📄', badge: '🏷', table: '⊞',
  tab: '📑', dropdown: '▼', toast: '💬', chip: '🏷',
  default: '◻',
};

export function getComponentIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(COMPONENT_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return COMPONENT_ICONS.default;
}
