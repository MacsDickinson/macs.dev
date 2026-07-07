export const manifest = {
  screens: {
    scr_4as5kb: { name: "Home — Constellation", route: "/", position: { "x": 160, "y": 3800 } },
    scr_4btoq4: { name: "About (overlay)", route: "/", state: { "active": "about" }, position: { "x": 1560, "y": 3800 } },
    scr_vriwrr: { name: "Speaking (overlay)", route: "/", state: { "active": "speaking" }, position: { "x": 2960, "y": 3800 } },
    scr_j72oo0: { name: "Work (overlay)", route: "/", state: { "active": "work" }, position: { "x": 4360, "y": 3800 } },
    scr_v965fu: { name: "Writing (overlay)", route: "/", state: { "active": "writing" }, position: { "x": 5760, "y": 3800 } },
    scr_wynt0n: { name: "Podcast (overlay)", route: "/", state: { "active": "podcast" }, position: { "x": 7160, "y": 3800 } },
    scr_uqxeto: { name: "Book me (overlay)", route: "/", state: { "active": "book" }, position: { "x": 8560, "y": 3800 } },
    scr_014acj: { name: "Blog — Culture Eats Strategy", route: "/blog/culture-eats-strategy", position: { "x": 160, "y": 1820 } },
    scr_r9cd7s: { name: "Blog — AI in Regulated Environments", route: "/blog/ai-in-regulated-environments", position: { "x": 1560, "y": 1820 } },
    scr_lfo8v2: { name: "Blog — Restructuring for Flow", route: "/blog/restructuring-for-flow", position: { "x": 2960, "y": 1820 } }
  },
  sections: {
    sec_5j07ye: { name: "Blog Posts", x: 0, y: 1600, width: 4320, height: 1180 },
    sec_1dbje8: { name: "Home & Overlays", x: 0, y: 3580, width: 9920, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_5j07ye", children: [
    { kind: "screen", id: "scr_014acj" },
    { kind: "screen", id: "scr_r9cd7s" },
    { kind: "screen", id: "scr_lfo8v2" }]
  },
  { kind: "section", id: "sec_1dbje8", children: [
    { kind: "screen", id: "scr_4as5kb" },
    { kind: "screen", id: "scr_4btoq4" },
    { kind: "screen", id: "scr_vriwrr" },
    { kind: "screen", id: "scr_j72oo0" },
    { kind: "screen", id: "scr_v965fu" },
    { kind: "screen", id: "scr_wynt0n" },
    { kind: "screen", id: "scr_uqxeto" }]
  }]

};