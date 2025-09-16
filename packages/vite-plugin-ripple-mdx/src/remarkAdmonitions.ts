import { visit } from "unist-util-visit"

/**
 * remarkAdmonitions
 *
 * Converts blockquotes starting with [!TYPE] into `admonition` nodes.
 *
 * Supports GitHub-style callouts:
 * > [!NOTE]
 * > [!TIP]
 * > [!INFO]
 * > [!IMPORTANT]
 * > [!WARNING]
 * > [!CAUTION]
 */
export default function remarkAdmonitions() {
  const supported = ["note", "tip", "info", "important", "warning", "caution"]

  return (tree) => {
    visit(tree, "blockquote", (node, index, parent) => {
      if (!node.children?.length) return

      const firstChild = node.children[0]
      const firstGrandchild = firstChild?.children?.[0]

      if (firstChild?.type === "paragraph" && firstGrandchild?.type === "text") {
        const match = firstGrandchild.value.match(/^\[!(\w+)\]/)
        if (match) {
          const type = match[1].toLowerCase()
          if (supported.includes(type)) {
            // Convert node to custom admonition node
            node.type = "admonition"
            node.data = { admonitionType: type }

            // Remove the [!TYPE] marker from the first paragraph
            firstGrandchild.value = firstGrandchild.value.replace(/^\[!\w+\]\s*/, "")

            // If paragraph becomes empty after removal, drop it
            if (
              firstChild.children.length === 1 &&
              firstGrandchild.value.trim() === ""
            ) {
              node.children.shift()
            }
          }
        }
      }
    })
  }
}
