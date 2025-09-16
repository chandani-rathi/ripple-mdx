import fs from "node:fs";
import path from "node:path";

 function scanDir(currentDir, relativeDir = ".") {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    let imports = [];
    let tree = {};

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = "./" + path.join(relativeDir, entry.name).replace(/\\/g, "/");

      if (entry.isDirectory()) {
        // Recursively scan subfolders
        const { imports: subImports, tree: subTree } = scanDir(
          fullPath,
          path.join(relativeDir, entry.name)
        );
        imports.push(...subImports);
        tree[entry.name] = subTree;
      } else if (/\.(jsx|tsx|vue|js|ts)$/.test(entry.name)) {
        const name = path.basename(entry.name, path.extname(entry.name));
        const importVar = `${name}_${imports.length}`; // avoid collisions
        imports.push(`import ${importVar} from '${relativePath}';`);
        tree[name] = importVar;
      }
    }

    return { imports, tree };
  }