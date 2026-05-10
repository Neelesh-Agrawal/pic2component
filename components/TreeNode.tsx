'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { ComponentNode } from '@/types';
import { getComponentIcon } from '@/lib/componentIcons';

interface TreeNodeProps {
  node: ComponentNode;
  depth: number;
  path: string;
  collapsedMap: Record<string, boolean>;
  onToggle: (path: string) => void;
}

const LAYOUT_COLORS: Record<string, string> = {
  'flex-row': '#7C6FF7',
  'flex-col': '#34D399',
  'grid': '#FBBF24',
  'stack': '#F87171',
  'inline': '#60A5FA',
  'absolute': '#A78BFA',
};

const TreeNode = memo(function TreeNode({ node, depth, path, collapsedMap, onToggle }: TreeNodeProps) {
  const hasChildren = node.children.length > 0;
  const isCollapsed = collapsedMap[path] ?? false;
  const icon = getComponentIcon(node.name);
  const layoutColor = LAYOUT_COLORS[node.layout] || '#8888AA';

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer group relative transition-all duration-150"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={() => hasChildren && onToggle(path)}
        title={node.description}
        id={`tree-node-${path.replace(/\./g, '-')}`}
      >
        {/* Indent line */}
        {depth > 0 && (
          <div
            className="absolute left-0 top-0 bottom-0 w-px"
            style={{
              left: `${depth * 20 - 2}px`,
              background: 'var(--border-subtle)',
            }}
          />
        )}

        {/* Expand/collapse toggle */}
        <span className="w-4 h-4 flex items-center justify-center shrink-0" style={{ color: 'var(--text-muted)' }}>
          {hasChildren
            ? isCollapsed
              ? <ChevronRight size={12} />
              : <ChevronDown size={12} />
            : <span className="w-1 h-1 rounded-full inline-block" style={{ background: 'var(--border-subtle)' }} />
          }
        </span>

        {/* Icon */}
        <span className="text-base leading-none">{icon}</span>

        {/* Name */}
        <span
          className="text-sm font-medium flex-1 truncate"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jetbrains)' }}
        >
          {node.name}
        </span>

        {/* Count badge */}
        {node.count > 1 && (
          <span
            className="px-1.5 py-0.5 rounded text-xs font-bold font-mono"
            style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
          >
            ×{node.count}
          </span>
        )}

        {/* Layout badge */}
        <span
          className="px-1.5 py-0.5 rounded text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          style={{ background: `${layoutColor}1A`, color: layoutColor, border: `1px solid ${layoutColor}33` }}
        >
          {node.layout}
        </span>
      </div>

      {/* Children */}
      {hasChildren && !isCollapsed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.18 }}
        >
          {node.children.map((child, i) => (
            <TreeNode
              key={`${path}.${i}`}
              node={child}
              depth={depth + 1}
              path={`${path}.${i}`}
              collapsedMap={collapsedMap}
              onToggle={onToggle}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
});

export default TreeNode;
