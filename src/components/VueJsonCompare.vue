<template>
  <div :class="['vjc', themeClass]">
    <div v-if="showHeader" class="vjc__header">
      <span class="vjc__title">{{ title }}</span>
      <span class="vjc__stats">
        <span class="vjc__stat vjc__stat--added">+{{ stats.added }}</span>
        <span class="vjc__stat vjc__stat--removed">-{{ stats.removed }}</span>
        <span
          v-if="stats.added === 0 && stats.removed === 0"
          class="vjc__stat vjc__stat--equal"
        >
          {{ noChangesLabel }}
        </span>
      </span>
    </div>

    <div class="vjc__body">
      <div
        v-for="(line, idx) in diffLines"
        :key="idx"
        class="vjc__row"
        :class="`vjc__row--${line.type}`"
      >
        <template v-if="showLineNumbers">
          <div class="vjc__gutter vjc__gutter--old">
            <span v-if="line.oldLineNum !== undefined">{{ line.oldLineNum }}</span>
          </div>
          <div class="vjc__gutter vjc__gutter--new">
            <span v-if="line.newLineNum !== undefined">{{ line.newLineNum }}</span>
          </div>
        </template>
        <div class="vjc__sign">{{ signFor(line.type) }}</div>
        <div
          class="vjc__code"
          :style="{ paddingLeft: line.indent * 20 + 8 + 'px' }"
        >{{ line.content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { JsonValue, VueJsonCompareTheme } from '../types'

interface Props {
  /** Previous version of the JSON. */
  oldData: JsonValue
  /** New version of the JSON. */
  newData: JsonValue
  /** Show the header bar with stats (default: true). */
  showHeader?: boolean
  /** Show the two-column line-number gutter (default: true). */
  showLineNumbers?: boolean
  /** Theme: 'auto' follows OS, 'light' / 'dark' force a palette (default: 'auto'). */
  theme?: VueJsonCompareTheme
  /** Header title text (default: 'JSON diff'). */
  title?: string
  /** Label shown when there are no differences (default: 'No changes'). */
  noChangesLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  showLineNumbers: true,
  theme: 'auto',
  title: 'JSON diff',
  noChangesLabel: 'No changes',
})

type DiffType = 'unchanged' | 'added' | 'removed'

interface DiffLine {
  type: DiffType
  content: string
  indent: number
  oldLineNum?: number
  newLineNum?: number
}

/* ---------- helpers ---------- */

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (typeof a !== typeof b) return false
  if (a === null || b === null) return a === b
  if (typeof a !== 'object') return false
  if (Array.isArray(a) !== Array.isArray(b)) return false

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false
    }
    return true
  }

  const oa = a as Record<string, unknown>
  const ob = b as Record<string, unknown>
  const keysA = Object.keys(oa)
  const keysB = Object.keys(ob)
  if (keysA.length !== keysB.length) return false
  for (const k of keysA) {
    if (!Object.prototype.hasOwnProperty.call(ob, k)) return false
    if (!deepEqual(oa[k], ob[k])) return false
  }
  return true
}

function formatPrimitive(v: unknown): string {
  if (v === undefined) return 'undefined'
  return JSON.stringify(v)
}

function renderValue(
  val: unknown,
  keyPrefix: string,
  hasComma: boolean
): { content: string; indent: number }[] {
  const out: { content: string; indent: number }[] = []

  const walk = (v: unknown, prefix: string, indent: number, comma: boolean) => {
    if (v === null || typeof v !== 'object') {
      out.push({
        content: prefix + formatPrimitive(v) + (comma ? ',' : ''),
        indent,
      })
      return
    }

    if (Array.isArray(v)) {
      if (v.length === 0) {
        out.push({ content: prefix + '[]' + (comma ? ',' : ''), indent })
        return
      }
      out.push({ content: prefix + '[', indent })
      v.forEach((item, i) => walk(item, '', indent + 1, i < v.length - 1))
      out.push({ content: ']' + (comma ? ',' : ''), indent })
      return
    }

    const obj = v as Record<string, unknown>
    const keys = Object.keys(obj)
    if (keys.length === 0) {
      out.push({ content: prefix + '{}' + (comma ? ',' : ''), indent })
      return
    }
    out.push({ content: prefix + '{', indent })
    keys.forEach((k, i) =>
      walk(obj[k], `"${k}": `, indent + 1, i < keys.length - 1)
    )
    out.push({ content: '}' + (comma ? ',' : ''), indent })
  }

  walk(val, keyPrefix, 0, hasComma)
  return out
}

/* ---------- diff core ---------- */

function buildDiff(
  oldVal: unknown,
  newVal: unknown,
  keyPrefix: string,
  indent: number,
  hasComma: boolean,
  lines: DiffLine[]
): void {
  if (oldVal === undefined && newVal === undefined) return

  if (oldVal === undefined) {
    renderValue(newVal, keyPrefix, hasComma).forEach((l) =>
      lines.push({ type: 'added', content: l.content, indent: indent + l.indent })
    )
    return
  }

  if (newVal === undefined) {
    renderValue(oldVal, keyPrefix, hasComma).forEach((l) =>
      lines.push({
        type: 'removed',
        content: l.content,
        indent: indent + l.indent,
      })
    )
    return
  }

  if (deepEqual(oldVal, newVal)) {
    renderValue(newVal, keyPrefix, hasComma).forEach((l) =>
      lines.push({
        type: 'unchanged',
        content: l.content,
        indent: indent + l.indent,
      })
    )
    return
  }

  if (isPlainObject(oldVal) && isPlainObject(newVal)) {
    lines.push({ type: 'unchanged', content: keyPrefix + '{', indent })
    const allKeys = Array.from(
      new Set([...Object.keys(oldVal), ...Object.keys(newVal)])
    )
    allKeys.forEach((k, i) => {
      const isLast = i === allKeys.length - 1
      buildDiff(
        (oldVal as Record<string, unknown>)[k],
        (newVal as Record<string, unknown>)[k],
        `"${k}": `,
        indent + 1,
        !isLast,
        lines
      )
    })
    lines.push({
      type: 'unchanged',
      content: '}' + (hasComma ? ',' : ''),
      indent,
    })
    return
  }

  if (Array.isArray(oldVal) && Array.isArray(newVal)) {
    lines.push({ type: 'unchanged', content: keyPrefix + '[', indent })
    const maxLen = Math.max(oldVal.length, newVal.length)
    for (let i = 0; i < maxLen; i++) {
      const isLast = i === maxLen - 1
      buildDiff(oldVal[i], newVal[i], '', indent + 1, !isLast, lines)
    }
    lines.push({
      type: 'unchanged',
      content: ']' + (hasComma ? ',' : ''),
      indent,
    })
    return
  }

  renderValue(oldVal, keyPrefix, hasComma).forEach((l) =>
    lines.push({
      type: 'removed',
      content: l.content,
      indent: indent + l.indent,
    })
  )
  renderValue(newVal, keyPrefix, hasComma).forEach((l) =>
    lines.push({
      type: 'added',
      content: l.content,
      indent: indent + l.indent,
    })
  )
}

/* ---------- computed ---------- */

const diffLines = computed<DiffLine[]>(() => {
  const lines: DiffLine[] = []
  buildDiff(props.oldData, props.newData, '', 0, false, lines)

  let oldNum = 1
  let newNum = 1
  for (const line of lines) {
    if (line.type === 'removed') {
      line.oldLineNum = oldNum++
    } else if (line.type === 'added') {
      line.newLineNum = newNum++
    } else {
      line.oldLineNum = oldNum++
      line.newLineNum = newNum++
    }
  }
  return lines
})

const stats = computed(() => {
  let added = 0
  let removed = 0
  for (const l of diffLines.value) {
    if (l.type === 'added') added++
    else if (l.type === 'removed') removed++
  }
  return { added, removed }
})

const themeClass = computed(() => `vjc--theme-${props.theme}`)

function signFor(t: DiffType): string {
  if (t === 'added') return '+'
  if (t === 'removed') return '-'
  return ' '
}
</script>

<style>
/* CSS variables — one set per theme. Exposed unscoped so consumers can override. */
.vjc {
  --vjc-font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas,
    'Liberation Mono', monospace;
  --vjc-font-size: 12px;
  --vjc-line-height: 20px;

  --vjc-fg: #1f2328;
  --vjc-bg: #ffffff;
  --vjc-border: #d0d7de;
  --vjc-header-bg: #f6f8fa;
  --vjc-muted: #57606a;

  --vjc-added-bg: #e6ffec;
  --vjc-added-gutter-bg: #ccffd8;
  --vjc-added-fg: #1a7f37;

  --vjc-removed-bg: #ffebe9;
  --vjc-removed-gutter-bg: #ffd7d5;
  --vjc-removed-fg: #cf222e;
}

.vjc--theme-dark {
  --vjc-fg: #e6edf3;
  --vjc-bg: #0d1117;
  --vjc-border: #30363d;
  --vjc-header-bg: #161b22;
  --vjc-muted: #8b949e;

  --vjc-added-bg: rgba(46, 160, 67, 0.15);
  --vjc-added-gutter-bg: rgba(46, 160, 67, 0.3);
  --vjc-added-fg: #56d364;

  --vjc-removed-bg: rgba(248, 81, 73, 0.15);
  --vjc-removed-gutter-bg: rgba(248, 81, 73, 0.3);
  --vjc-removed-fg: #f85149;
}

@media (prefers-color-scheme: dark) {
  .vjc--theme-auto {
    --vjc-fg: #e6edf3;
    --vjc-bg: #0d1117;
    --vjc-border: #30363d;
    --vjc-header-bg: #161b22;
    --vjc-muted: #8b949e;

    --vjc-added-bg: rgba(46, 160, 67, 0.15);
    --vjc-added-gutter-bg: rgba(46, 160, 67, 0.3);
    --vjc-added-fg: #56d364;

    --vjc-removed-bg: rgba(248, 81, 73, 0.15);
    --vjc-removed-gutter-bg: rgba(248, 81, 73, 0.3);
    --vjc-removed-fg: #f85149;
  }
}

.vjc {
  font-family: var(--vjc-font-family);
  font-size: var(--vjc-font-size);
  line-height: var(--vjc-line-height);
  color: var(--vjc-fg);
  background: var(--vjc-bg);
  border: 1px solid var(--vjc-border);
  border-radius: 6px;
  overflow: hidden;
}

.vjc__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: var(--vjc-header-bg);
  border-bottom: 1px solid var(--vjc-border);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
    sans-serif;
  font-size: 12px;
}

.vjc__title {
  font-weight: 600;
}

.vjc__stats {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.vjc__stat {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.vjc__stat--added {
  color: var(--vjc-added-fg);
}
.vjc__stat--removed {
  color: var(--vjc-removed-fg);
}
.vjc__stat--equal {
  color: var(--vjc-muted);
  font-weight: 400;
}

.vjc__body {
  overflow-x: auto;
}

.vjc__row {
  display: grid;
  grid-template-columns: 48px 48px 24px 1fr;
  align-items: stretch;
  min-height: var(--vjc-line-height);
  white-space: nowrap;
}

/* When line numbers are hidden, collapse the gutter columns. */
.vjc__row:not(:has(.vjc__gutter)) {
  grid-template-columns: 24px 1fr;
}

.vjc__row--unchanged .vjc__gutter {
  color: var(--vjc-muted);
}

.vjc__row--added {
  background-color: var(--vjc-added-bg);
}
.vjc__row--added .vjc__gutter,
.vjc__row--added .vjc__sign {
  background-color: var(--vjc-added-gutter-bg);
  color: var(--vjc-added-fg);
}

.vjc__row--removed {
  background-color: var(--vjc-removed-bg);
}
.vjc__row--removed .vjc__gutter,
.vjc__row--removed .vjc__sign {
  background-color: var(--vjc-removed-gutter-bg);
  color: var(--vjc-removed-fg);
}

.vjc__gutter {
  padding: 0 8px;
  text-align: right;
  user-select: none;
  font-variant-numeric: tabular-nums;
  background-color: var(--vjc-header-bg);
}
.vjc__gutter--new {
  border-right: 1px solid var(--vjc-border);
}

.vjc__sign {
  text-align: center;
  user-select: none;
  font-weight: 600;
}

.vjc__code {
  white-space: pre;
  padding-right: 16px;
}
</style>
