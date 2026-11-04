# Heading font trials

Ledger and Aurelia are self-hosted variable WOFF2 families from Fontzz:
https://fontzz.vercel.app/#ledger and https://fontzz.vercel.app/#aurelia.
Each family directory includes its original README and SIL Open Font License.

Change `--portrait-font` in `src/portrait.css` between `Ledger` and `Aurelia`.
Only display/heading typography uses this token. Body copy and controls use Inter.
Name glyphs keep a fixed 210px design and animate with uniform scale; their widths
are observed so changing the family preserves the masthead transition.

The other typeface JSON files in this folder belong to the original 3D scene.
