import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export type TreeNode = {
  id: string;
  label: string;
  children?: TreeNode[];
};

type TreeViewProps = {
  nodes: TreeNode[];
  onSelect?: (id: string) => void;
  selectedId?: string;
  className?: string;
};

/**
 * Figma: Tree View — arrow-right-fill expand icon + tree item children, recursive.
 */
export function TreeView({ nodes, onSelect, selectedId, className }: TreeViewProps) {
  return (
    <ul role="tree" className={cn("space-y-0.5", className)}>
      {nodes.map((node) => (
        <TreeItem key={node.id} node={node} onSelect={onSelect} selectedId={selectedId} depth={0} />
      ))}
    </ul>
  );
}

function TreeItem({
  node,
  onSelect,
  selectedId,
  depth,
}: {
  node: TreeNode;
  onSelect?: (id: string) => void;
  selectedId?: string;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = (node.children?.length ?? 0) > 0;
  const isSelected = node.id === selectedId;

  return (
    <li role="treeitem" aria-expanded={hasChildren ? expanded : undefined}>
      <button
        type="button"
        onClick={() => {
          if (hasChildren) setExpanded((e) => !e);
          onSelect?.(node.id);
        }}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md py-1.5 pr-3 text-left text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
          isSelected ? "bg-[#e8f2ff] text-primary" : "text-[#333333] hover:bg-[#f4f5fa]",
        )}
      >
        {/* Expand icon */}
        {hasChildren ? (
          <ChevronRight
            className={cn("h-4 w-4 shrink-0 text-[#5c5c5c] transition-transform", expanded && "rotate-90")}
            aria-hidden="true"
          />
        ) : (
          <span className="h-4 w-4 shrink-0" />
        )}
        <span className="truncate">{node.label}</span>
      </button>
      {hasChildren && expanded ? (
        <ul role="group">
          {node.children!.map((child) => (
            <TreeItem key={child.id} node={child} onSelect={onSelect} selectedId={selectedId} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
