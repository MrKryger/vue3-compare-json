import { JsonValue, VueJsonCompareTheme } from '../types';

interface Props {
    /** Previous version of the JSON. */
    oldData: JsonValue;
    /** New version of the JSON. */
    newData: JsonValue;
    /** Show the header bar with stats (default: true). */
    showHeader?: boolean;
    /** Show the two-column line-number gutter (default: true). */
    showLineNumbers?: boolean;
    /** Theme: 'auto' follows OS, 'light' / 'dark' force a palette (default: 'auto'). */
    theme?: VueJsonCompareTheme;
    /** Header title text (default: 'JSON diff'). */
    title?: string;
    /** Label shown when there are no differences (default: 'No changes'). */
    noChangesLabel?: string;
}
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<Props>, {
    showHeader: boolean;
    showLineNumbers: boolean;
    theme: string;
    title: string;
    noChangesLabel: string;
}>>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToRuntimeProps<Props>, {
    showHeader: boolean;
    showLineNumbers: boolean;
    theme: string;
    title: string;
    noChangesLabel: string;
}>>> & Readonly<{}>, {
    showHeader: boolean;
    showLineNumbers: boolean;
    theme: VueJsonCompareTheme;
    title: string;
    noChangesLabel: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToRuntimeProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? __VLS_Prettify<P[K] & {
        default: D[K];
    }> : P[K];
};
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
