
# Ripple MDX

Ripple MDX is a Vite plugin and component system that enables you to use MDX (Markdown + JSX) syntax with Ripple components. It allows you to write interactive documentation, content, and UI using `.ripple.mdx` files, combining Markdown and Ripple seamlessly.


## Installation

1. **Clone the repository using degit:**

   ```bash
   npx degit chandani-rathi/ripple-mdx my-ripple-mdx-app
   cd my-ripple-mdx-app
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm start
   ```

3. **File usage:**
   - Create `.ripple.mdx` files in your `src/` directory.
   - Import and use them in your Ripple components:

     ```ripple
     import Hello from './Hello.ripple.mdx';
     <Hello />
     ```

## Example

`Hello.ripple.mdx`:

```mdx
import { Button } from '@/Button.ripple';
export const year = 2025

# Hello Ripple heading

<Button>{"Click Button"}</Button>
```

## How It Works

- The plugin transforms `.ripple.mdx` files into Ripple components at build time.
- You can use Markdown, JSX-like syntax, and import/export variables.
- Admonitions, directives, and interactive UI are supported.
- Use with Tailwind CSS for styling.

## Getting Started

## Getting Started

1. Install dependencies:

   ```bash
   npm install # or pnpm or yarn
   ```
2. Start the development server:

   ```bash
   npm run dev
   ```
3. Build for production:

   ```bash
   npm run build
   ```

## Code Formatting

This template includes Prettier with the Ripple plugin for consistent code formatting.

### Available Commands

- `npm run format` - Format all files
- `npm run format:check` - Check if files are formatted correctly

### Configuration

Prettier is configured in `.prettierrc` with the following settings:

- Uses tabs for indentation
- Single quotes for strings
- 100 character line width
- Includes the `prettier-plugin-ripple` for `.ripple` file formatting

### VS Code Integration

For the best development experience, install the [Prettier VS Code extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and the [Ripple VS Code extension](https://marketplace.visualstudio.com/items?itemName=ripplejs.ripple-vscode-plugin).

## Learn More

- [Ripple Documentation](https://github.com/trueadm/ripple)
- [Vite Documentation](https://vitejs.dev/)
