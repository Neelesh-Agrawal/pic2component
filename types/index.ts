export interface ComponentNode {
  name: string;           // PascalCase semantic name
  layout: 'flex-row' | 'flex-col' | 'grid' | 'stack' | 'inline' | 'absolute';
  count: number;          // 1 = unique, >1 = repeated pattern
  description?: string;  // brief AI description of this component
  children: ComponentNode[];
}

export interface DesignTokens {
  colors: { name: string; hex: string; usage: string }[];
  fontSizes: string[];
  spacing: string[];
  borderRadius: string[];
  shadows: string[];
}

export interface AnalysisResult {
  tree: ComponentNode;
  tokens: DesignTokens;
  explanation: string;       // why this structure was chosen
  componentCount: number;
  repeatedPatterns: string[];
}
