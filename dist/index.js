import { defineComponent as J, computed as b, openBlock as i, createElementBlock as f, normalizeClass as k, createElementVNode as d, toDisplayString as h, createCommentVNode as _, Fragment as B, renderList as $, normalizeStyle as C } from "vue";
const q = {
  key: 0,
  class: "vjc__header"
}, z = { class: "vjc__title" }, F = { class: "vjc__stats" }, H = { class: "vjc__stat vjc__stat--added" }, K = { class: "vjc__stat vjc__stat--removed" }, M = {
  key: 0,
  class: "vjc__stat vjc__stat--equal"
}, G = { class: "vjc__body" }, I = { class: "vjc__gutter vjc__gutter--old" }, Q = { key: 0 }, R = { class: "vjc__gutter vjc__gutter--new" }, T = { key: 0 }, U = { class: "vjc__sign" }, W = /* @__PURE__ */ J({
  __name: "VueJsonCompare",
  props: {
    oldData: { type: [String, Number, Boolean, null, Array, Object] },
    newData: { type: [String, Number, Boolean, null, Array, Object] },
    showHeader: { type: Boolean, default: !0 },
    showLineNumbers: { type: Boolean, default: !0 },
    theme: { default: "auto" },
    title: { default: "JSON diff" },
    noChangesLabel: { default: "No changes" }
  },
  setup(l) {
    const j = l;
    function O(t) {
      return t !== null && typeof t == "object" && !Array.isArray(t);
    }
    function m(t, r) {
      if (t === r) return !0;
      if (typeof t != typeof r) return !1;
      if (t === null || r === null) return t === r;
      if (typeof t != "object" || Array.isArray(t) !== Array.isArray(r)) return !1;
      if (Array.isArray(t) && Array.isArray(r)) {
        if (t.length !== r.length) return !1;
        for (let e = 0; e < t.length; e++)
          if (!m(t[e], r[e])) return !1;
        return !0;
      }
      const o = t, n = r, u = Object.keys(o), s = Object.keys(n);
      if (u.length !== s.length) return !1;
      for (const e of u)
        if (!Object.prototype.hasOwnProperty.call(n, e) || !m(o[e], n[e])) return !1;
      return !0;
    }
    function S(t) {
      return t === void 0 ? "undefined" : JSON.stringify(t);
    }
    function y(t, r, o) {
      const n = [], u = (s, e, c, a) => {
        if (s === null || typeof s != "object") {
          n.push({
            content: e + S(s) + (a ? "," : ""),
            indent: c
          });
          return;
        }
        if (Array.isArray(s)) {
          if (s.length === 0) {
            n.push({ content: e + "[]" + (a ? "," : ""), indent: c });
            return;
          }
          n.push({ content: e + "[", indent: c }), s.forEach((g, L) => u(g, "", c + 1, L < s.length - 1)), n.push({ content: "]" + (a ? "," : ""), indent: c });
          return;
        }
        const v = s, N = Object.keys(v);
        if (N.length === 0) {
          n.push({ content: e + "{}" + (a ? "," : ""), indent: c });
          return;
        }
        n.push({ content: e + "{", indent: c }), N.forEach(
          (g, L) => u(v[g], `"${g}": `, c + 1, L < N.length - 1)
        ), n.push({ content: "}" + (a ? "," : ""), indent: c });
      };
      return u(t, r, 0, o), n;
    }
    function A(t, r, o, n, u, s) {
      if (!(t === void 0 && r === void 0)) {
        if (t === void 0) {
          y(r, o, u).forEach(
            (e) => s.push({ type: "added", content: e.content, indent: n + e.indent })
          );
          return;
        }
        if (r === void 0) {
          y(t, o, u).forEach(
            (e) => s.push({
              type: "removed",
              content: e.content,
              indent: n + e.indent
            })
          );
          return;
        }
        if (m(t, r)) {
          y(r, o, u).forEach(
            (e) => s.push({
              type: "unchanged",
              content: e.content,
              indent: n + e.indent
            })
          );
          return;
        }
        if (O(t) && O(r)) {
          s.push({ type: "unchanged", content: o + "{", indent: n });
          const e = Array.from(
            /* @__PURE__ */ new Set([...Object.keys(t), ...Object.keys(r)])
          );
          e.forEach((c, a) => {
            const v = a === e.length - 1;
            A(
              t[c],
              r[c],
              `"${c}": `,
              n + 1,
              !v,
              s
            );
          }), s.push({
            type: "unchanged",
            content: "}" + (u ? "," : ""),
            indent: n
          });
          return;
        }
        if (Array.isArray(t) && Array.isArray(r)) {
          s.push({ type: "unchanged", content: o + "[", indent: n });
          const e = Math.max(t.length, r.length);
          for (let c = 0; c < e; c++) {
            const a = c === e - 1;
            A(t[c], r[c], "", n + 1, !a, s);
          }
          s.push({
            type: "unchanged",
            content: "]" + (u ? "," : ""),
            indent: n
          });
          return;
        }
        y(t, o, u).forEach(
          (e) => s.push({
            type: "removed",
            content: e.content,
            indent: n + e.indent
          })
        ), y(r, o, u).forEach(
          (e) => s.push({
            type: "added",
            content: e.content,
            indent: n + e.indent
          })
        );
      }
    }
    const E = b(() => {
      const t = [];
      A(j.oldData, j.newData, "", 0, !1, t);
      let r = 1, o = 1;
      for (const n of t)
        n.type === "removed" ? n.oldLineNum = r++ : (n.type === "added" || (n.oldLineNum = r++), n.newLineNum = o++);
      return t;
    }), p = b(() => {
      let t = 0, r = 0;
      for (const o of E.value)
        o.type === "added" ? t++ : o.type === "removed" && r++;
      return { added: t, removed: r };
    }), w = b(() => `vjc--theme-${j.theme}`);
    function D(t) {
      return t === "added" ? "+" : t === "removed" ? "-" : " ";
    }
    return (t, r) => (i(), f("div", {
      class: k(["vjc", w.value])
    }, [
      l.showHeader ? (i(), f("div", q, [
        d("span", z, h(l.title), 1),
        d("span", F, [
          d("span", H, "+" + h(p.value.added), 1),
          d("span", K, "-" + h(p.value.removed), 1),
          p.value.added === 0 && p.value.removed === 0 ? (i(), f("span", M, h(l.noChangesLabel), 1)) : _("", !0)
        ])
      ])) : _("", !0),
      d("div", G, [
        (i(!0), f(B, null, $(E.value, (o, n) => (i(), f("div", {
          key: n,
          class: k(["vjc__row", `vjc__row--${o.type}`])
        }, [
          l.showLineNumbers ? (i(), f(B, { key: 0 }, [
            d("div", I, [
              o.oldLineNum !== void 0 ? (i(), f("span", Q, h(o.oldLineNum), 1)) : _("", !0)
            ]),
            d("div", R, [
              o.newLineNum !== void 0 ? (i(), f("span", T, h(o.newLineNum), 1)) : _("", !0)
            ])
          ], 64)) : _("", !0),
          d("div", U, h(D(o.type)), 1),
          d("div", {
            class: "vjc__code",
            style: C({ paddingLeft: o.indent * 20 + 8 + "px" })
          }, h(o.content), 5)
        ], 2))), 128))
      ])
    ], 2));
  }
}), Y = {
  install(l) {
    l.component("VueJsonCompare", W);
  }
};
export {
  W as VueJsonCompare,
  Y as default
};
//# sourceMappingURL=index.js.map
