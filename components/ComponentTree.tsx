'use client';

import { useState, useCallback } from 'react';
import { ComponentNode } from '@/types';
import TreeNode from './TreeNode';

interface ComponentTreeProps {
  root: ComponentNode;
}

function collectPaths(node: ComponentNode, path: string, acc: string[] = []): string[] {
  acc.push(path);
  node.children.forEach((child, i) => collectPaths(child, `${path}.${i}`, acc));
  return acc;
}

export default function ComponentTree({ root }: ComponentTreeProps) {
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});

  const toggle = useCallback((path: string) => {
    setCollapsedMap(prev => ({ ...prev, [path]: !prev[path] }));
  }, []);

  const expandAll = () => {
    const paths = collectPaths(root, 'root');
    const expanded: Record<string, boolean> = {};
    paths.forEach(p => (expanded[p] = false));
    setCollapsedMap(expanded);
  };

  const collapseAll = () => {
    const paths = collectPaths(root, 'root');
    const collapsed: Record<string, boolean> = {};
    paths.forEach(p => (collapsed[p] = true));
    setCollapsedMap(collapsed);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex items-center gap-2 mb-3 pb-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <button
          id="tree-expand-all"
          onClick={expandAll}
          className="text-xs px-2.5 py-1 rounded-md transition-colors duration-150"
          style={{ color: 'var(--text-muted)', background: 'var(--bg-surface-2)' }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)')}
        >
          Expand all
        </button>
        <button
          id="tree-collapse-all"
          onClick={collapseAll}
          className="text-xs px-2.5 py-1 rounded-md transition-colors duration-150"
          style={{ color: 'var(--text-muted)', background: 'var(--bg-surface-2)' }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)')}
        >
          Collapse all
        </button>
        <span className="ml-auto text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {collectPaths(root, 'root').length} nodes
        </span>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto pr-1">
        <TreeNode
          node={root}
          depth={0}
          path="root"
          collapsedMap={collapsedMap}
          onToggle={toggle}
        />
      </div>
    </div>
  );
}
