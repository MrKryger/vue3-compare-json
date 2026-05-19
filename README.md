# vue3-compare-json

A small Vue 3 + TypeScript component that compares two JSON values and renders
the differences as a GitHub-style unified diff — colored row backgrounds,
two-column line-number gutter, `+`/`-` signs and a stats header.

> Read this in another language: [Русский](#русский)

## Features

- Vue 3, `<script setup lang="ts">`, no runtime dependencies beyond Vue.
- GitHub-style visual: red removals, green additions, neutral context lines.
- Handles nested objects and arrays at any depth.
- Themes: `light`, `dark`, or `auto` (follows `prefers-color-scheme`).
- Fully typed `JsonValue` exported from the package.
- Style overridable via CSS variables.

## Installation

```bash
npm install vue3-compare-json
# or
pnpm add vue3-compare-json
# or
yarn add vue3-compare-json
```

> The package requires `vue@^3.3` as a peer dependency.

## Usage

### Local registration

```vue
<script setup lang="ts">
import { VueJsonCompare, type JsonValue } from 'vue3-compare-json'
import 'vue3-compare-json/style.css'

const oldData: JsonValue = { name: 'Lex', roles: ['admin'] }
const newData: JsonValue = { name: 'Aleksey', roles: ['admin', 'owner'] }
</script>

<template>
  <VueJsonCompare :old-data="oldData" :new-data="newData" />
</template>
```

### Global registration (Vue plugin)

```ts
// main.ts
import { createApp } from 'vue'
import VueJsonComparePlugin from 'vue3-compare-json'
import 'vue3-compare-json/style.css'
import App from './App.vue'

createApp(App).use(VueJsonComparePlugin).mount('#app')
```

```vue
<template>
  <vue3-compare-json :old-data="oldData" :new-data="newData" />
</template>
```

## Props

| Prop               | Type                        | Default       | Description                                                  |
| ------------------ | --------------------------- | ------------- | ------------------------------------------------------------ |
| `oldData`          | `JsonValue`                 | —             | Previous value. Required.                                    |
| `newData`          | `JsonValue`                 | —             | New value. Required.                                         |
| `showHeader`       | `boolean`                   | `true`        | Show the header bar with `+N / -N` stats.                    |
| `showLineNumbers`  | `boolean`                   | `true`        | Show the two-column line-number gutter.                      |
| `theme`            | `'auto' \| 'light' \| 'dark'` | `'auto'`    | Force a theme, or follow the user's OS preference.           |
| `title`            | `string`                    | `'JSON diff'` | Header title text.                                           |
| `noChangesLabel`   | `string`                    | `'No changes'`| Label shown when `oldData` and `newData` are deeply equal.   |

## Theming

Every color is exposed as a CSS variable on the `.vjc` root, so you can override
them without touching component CSS:

```css
.vjc {
  --vjc-added-bg: #d1fadf;
  --vjc-added-fg: #027a48;
  --vjc-removed-bg: #fee4e2;
  --vjc-removed-fg: #b42318;
  --vjc-font-size: 13px;
}
```

Full list of variables: `--vjc-font-family`, `--vjc-font-size`,
`--vjc-line-height`, `--vjc-fg`, `--vjc-bg`, `--vjc-border`, `--vjc-header-bg`,
`--vjc-muted`, `--vjc-added-bg`, `--vjc-added-gutter-bg`, `--vjc-added-fg`,
`--vjc-removed-bg`, `--vjc-removed-gutter-bg`, `--vjc-removed-fg`.

## How the diff is computed

- Equal subtrees (by deep equality) are rendered as context lines.
- For objects, the union of keys is walked; keys missing on one side are
  rendered as full add / remove blocks.
- For arrays, items are compared by index. Insertions in the middle therefore
  cascade as a series of modifications — this is a deliberate trade-off to keep
  the algorithm simple and predictable. Open an issue if you need LCS-based
  alignment.
- Primitive mismatches are shown as a remove line followed by an add line.

## Development

```bash
git clone https://github.com/your-username/vue3-compare-json.git
cd vue3-compare-json
npm install
npm run dev       # starts the playground at /playground/index.html
npm run build     # type-checks and builds the library into dist/
npm run typecheck # type-check only
```

The playground lives under `playground/` and uses the source directly, so any
edit to `src/components/VueJsonCompare.vue` is reflected immediately.

## Project structure

```
vue3-compare-json/
├── src/
│   ├── components/
│   │   └── VueJsonCompare.vue   # the component
│   ├── types.ts                 # JsonValue, VueJsonCompareTheme
│   └── index.ts                 # entry point + Vue plugin install
├── playground/                  # local dev demo (not published)
├── dist/                        # build output (generated, not committed)
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── env.d.ts
├── README.md
├── LICENSE
└── CHANGELOG.md
```

## License

[MIT](./LICENSE)

---

## Русский

Небольшой компонент на Vue 3 + TypeScript, который сравнивает два JSON-значения
и показывает разницу в виде unified-diff в стиле GitHub: подкрашенные строки,
колонки с номерами, знаки `+` / `-` и статистика в шапке.

### Установка

```bash
npm install vue3-compare-json
```

### Использование

```vue
<script setup lang="ts">
import { VueJsonCompare, type JsonValue } from 'vue3-compare-json'
import 'vue3-compare-json/style.css'

const oldData: JsonValue = { name: 'Lex' }
const newData: JsonValue = { name: 'Aleksey' }
</script>

<template>
  <VueJsonCompare :old-data="oldData" :new-data="newData" />
</template>
```

Полный список пропсов и переменных стиля — в английской части выше.
