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

test("footer hints fill but do not exceed the render width", () => {
  for (const { name, hints } of hintSets) {
    for (const width of [54, 20, 5, 4, 3, 2, 1]) {
      const line = renderFooterLine(width, hints, border);

      assert.equal(
        visibleWidth(line),
        width,
        `${name} rendered ${visibleWidth(line)} columns into ${width}`,
      );
    }
  }
});

test("narrow footer keeps hints right-justified after a bottom border rule", () => {
  const line = renderFooterLine(54, hintSets[0].hints, border);

  assert.match(line, /^╰─/);
  assert.match(line, /─╯$/);
});

test("footer keeps unpadded hints adjacent to the right rule", () => {
  const line = renderFooterLine(16, "shortcuts", border);

  assert.equal(visibleWidth(line), 16);
  assert.match(line, /^╰─+/);
  assert.match(line, /shortcuts─╯$/);
});
