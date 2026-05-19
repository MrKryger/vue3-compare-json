import { defineComponent as $, computed as b, openBlock as f, createElementBlock as h, normalizeClass as k, createElementVNode as d, toDisplayString as l, createCommentVNode as _, Fragment as B, renderList as C, normalizeStyle as q } from "vue";
const z = {
  key: 0,
  class: "vjc__header"
}, F = { class: "vjc__title" }, H = { class: "vjc__stats" }, K = { class: "vjc__stat vjc__stat--added" }, M = { class: "vjc__stat vjc__stat--removed" }, G = {
  key: 0,
  class: "vjc__stat vjc__stat--equal"
}, I = { class: "vjc__body" }, Q = { class: "vjc__gutter vjc__gutter--old" }, R = { key: 0 }, T = { class: "vjc__gutter vjc__gutter--new" }, U = { key: 0 }, W = { class: "vjc__sign" }, S = /* @__PURE__ */ $({
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
  setup(i) {
    const g = i;
    function O(e) {
      return e !== null && typeof e == "object" && !Array.isArray(e);
    }
    function m(e, r) {
      if (e === r) return !0;
      if (typeof e != typeof r) return !1;
      if (e === null || r === null) return e === r;
      if (typeof e != "object" || Array.isArray(e) !== Array.isArray(r)) return !1;
      if (Array.isArray(e) && Array.isArray(r)) {
        if (e.length !== r.length) return !1;
        for (let t = 0; t < e.length; t++)
          if (!m(e[t], r[t])) return !1;
        return !0;
      }
      const o = e, n = r, u = Object.keys(o), s = Object.keys(n);
      if (u.length !== s.length) return !1;
      for (const t of u)
        if (!Object.prototype.hasOwnProperty.call(n, t) || !m(o[t], n[t])) return !1;
      return !0;
    }
    function w(e) {
      return e === void 0 ? "undefined" : JSON.stringify(e);
    }
    function y(e, r, o) {
      const n = [], u = (s, t, c, a) => {
        if (s === null || typeof s != "object") {
          n.push({
            content: t + w(s) + (a ? "," : ""),
            indent: c
          });
          return;
        }
        if (Array.isArray(s)) {
          if (s.length === 0) {
            n.push({ content: t + "[]" + (a ? "," : ""), indent: c });
            return;
          }
          n.push({ content: t + "[", indent: c }), s.forEach((j, L) => u(j, "", c + 1, L < s.length - 1)), n.push({ content: "]" + (a ? "," : ""), indent: c });
          return;
        }
        const v = s, N = Object.keys(v);
        if (N.length === 0) {
          n.push({ content: t + "{}" + (a ? "," : ""), indent: c });
          return;
        }
        n.push({ content: t + "{", indent: c }), N.forEach(
          (j, L) => u(v[j], `"${j}": `, c + 1, L < N.length - 1)
        ), n.push({ content: "}" + (a ? "," : ""), indent: c });
      };
      return u(e, r, 0, o), n;
    }
    function A(e, r, o, n, u, s) {
      if (!(e === void 0 && r === void 0)) {
        if (e === void 0) {
          y(r, o, u).forEach(
            (t) => s.push({ type: "added", content: t.content, indent: n + t.indent })
          );
          return;
        }
        if (r === void 0) {
          y(e, o, u).forEach(
            (t) => s.push({
              type: "removed",
              content: t.content,
              indent: n + t.indent
            })
          );
          return;
        }
        if (m(e, r)) {
          y(r, o, u).forEach(
            (t) => s.push({
              type: "unchanged",
              content: t.content,
              indent: n + t.indent
            })
          );
          return;
        }
        if (O(e) && O(r)) {
          s.push({ type: "unchanged", content: o + "{", indent: n });
          const t = Array.from(
            /* @__PURE__ */ new Set([...Object.keys(e), ...Object.keys(r)])
          );
          t.forEach((c, a) => {
            const v = a === t.length - 1;
            A(
              e[c],
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
        if (Array.isArray(e) && Array.isArray(r)) {
          s.push({ type: "unchanged", content: o + "[", indent: n });
          const t = Math.max(e.length, r.length);
          for (let c = 0; c < t; c++) {
            const a = c === t - 1;
            A(e[c], r[c], "", n + 1, !a, s);
          }
          s.push({
            type: "unchanged",
            content: "]" + (u ? "," : ""),
            indent: n
          });
          return;
        }
        y(e, o, u).forEach(
          (t) => s.push({
            type: "removed",
            content: t.content,
            indent: n + t.indent
          })
        ), y(r, o, u).forEach(
          (t) => s.push({
            type: "added",
            content: t.content,
            indent: n + t.indent
          })
        );
      }
    }
    const E = b(() => {
      const e = [];
      A(g.oldData, g.newData, "", 0, !1, e);
      let r = 1, o = 1;
      for (const n of e)
        n.type === "removed" ? n.oldLineNum = r++ : (n.type === "added" || (n.oldLineNum = r++), n.newLineNum = o++);
      return e;
    }), p = b(() => {
      let e = 0, r = 0;
      for (const o of E.value)
        o.type === "added" ? e++ : o.type === "removed" && r++;
      return { added: e, removed: r };
    }), D = b(() => `vjc--theme-${g.theme}`);
    function J(e) {
      return e === "added" ? "+" : e === "removed" ? "-" : " ";
    }
    return (e, r) => (f(), h("div", {
      class: k(["vjc", D.value])
    }, [
      i.showHeader ? (f(), h("div", z, [
        d("span", F, l(i.title), 1),
        d("span", H, [
          d("span", K, "+" + l(p.value.added), 1),
          d("span", M, "-" + l(p.value.removed), 1),
          p.value.added === 0 && p.value.removed === 0 ? (f(), h("span", G, l(i.noChangesLabel), 1)) : _("", !0)
        ])
      ])) : _("", !0),
      d("div", I, [
        (f(!0), h(B, null, C(E.value, (o, n) => (f(), h("div", {
          key: n,
          class: k(["vjc__row", `vjc__row--${o.type}`])
        }, [
          i.showLineNumbers ? (f(), h(B, { key: 0 }, [
            d("div", Q, [
              o.oldLineNum !== void 0 ? (f(), h("span", R, l(o.oldLineNum), 1)) : _("", !0)
            ]),
            d("div", T, [
              o.newLineNum !== void 0 ? (f(), h("span", U, l(o.newLineNum), 1)) : _("", !0)
            ])
          ], 64)) : _("", !0),
          d("div", W, l(J(o.type)), 1),
          d("div", {
            class: "vjc__code",
            style: q({ paddingLeft: o.indent * 20 + 8 + "px" })
          }, l(o.content), 5)
        ], 2))), 128))
      ])
    ], 2));
  }
}), Y = {
  install(i) {
    i.component("VueJsonCompare", S), i.component("vue3-compare-json", S);
  }
};
export {
  S as VueJsonCompare,
  Y as default
};
//# sourceMappingURL=index.js.map
