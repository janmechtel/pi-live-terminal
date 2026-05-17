import assert from "node:assert/strict";
import { test } from "node:test";
import { visibleWidth } from "@earendil-works/pi-tui";
import { renderFooterLine } from "../pi-live-terminal.ts";

const border = (s: string) => s;
const style = (s: string) => `\x1b[38;2;166;176;160m${s}\x1b[39m`;

const hintSets = [
  {
    name: "widget footer",
    hints: [
      style(" ctrl+shift+f ") + style("focus"),
      style(" ctrl+shift+x ") + style("kill"),
      style(" ctrl+shift+v ") + style("detach"),
    ].join(style(" · ")),
  },
  {
    name: "focus modal footer",
    hints: [
      style(" ctrl+shift+f ") + style("close focus"),
      style("scroll wheel scrolls output"),
      style("input is sent to tmux"),
    ].join(style(" · ")),
  },
];

test("footer hints fit the render width", () => {
  for (const { name, hints } of hintSets) {
    for (const width of [54, 20]) {
      const line = renderFooterLine(width, hints, border);

      assert.equal(
        visibleWidth(line) <= width,
        true,
        `${name} rendered ${visibleWidth(line)} columns into ${width}`,
      );
    }
  }
});
