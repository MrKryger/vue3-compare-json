/**
 * Any value that can be represented as JSON.
 */
export type JsonValue = string | number | boolean | null | JsonValue[] | {
    [key: string]: JsonValue;
};
/**
 * Visualization theme.
 *  - `auto`  — follows the user's `prefers-color-scheme`.
 *  - `light` — always light.
 *  - `dark`  — always dark.
 */
export type VueJsonCompareTheme = 'auto' | 'light' | 'dark';
