# Tsai Chih-chung 蔡志忠 · cartoon scans

Drop scans / images of Tsai Chih-chung's Dao De Jing cartoons into this folder. The book pulls them in automatically — no code change needed.

## Filename convention

```
ch{NN}-{slug}.{ext}
```

- `NN` — zero-padded chapter number (`01`, `02`, …, `81`)
- `slug` — short kebab-case description (`water`, `empty-cup`, `no-name`, etc.)
- `ext` — `jpg` (preferred), `png`, or `webp`

## Examples

```
ch01-no-name.jpg
ch02-pairs-arise.jpg
ch08-water.jpg
ch11-empty-cup.jpg
ch17-best-leader.jpg
ch33-knowing-self.jpg
ch76-soft-vs-hard.jpg
```

## How they render

Each cartoon appears as its own panel between the chapter's *Direct* (02) panel and *Reading* (03) panel — large, full-bleed on desktop, paper background, with a credit line in the lower-left:

> 蔡志忠 · 老子說 · {chapter title}

If a referenced cartoon image is missing, the panel hides itself silently — no broken image, no console error.

## How to wire a new cartoon

In `extended.js`, add a `tsai` field to the chapter:

```js
8: {
  // ... existing fields ...
  tsai: {
    src: "tsai/ch08-water.jpg",
    caption: "Water benefits the ten thousand things and does not contend.",
    credit: "蔡志忠 · 老子說 · Tsai Chih-chung"
  }
}
```

## Source notes

Tsai Chih-chung (born 1948, Changhua, Taiwan) published his classical-philosophy cartoon series in the 1980s — *Zhuangzi Speaks* (莊子說), *The Sayings of Lao Tzu* (老子說), *Speaks Naturally*, and others. They have been translated into more than thirty languages and are the best on-ramp to Chinese philosophy ever drawn. Dr Non has been re-reading them since childhood.

These scans are used here as illustrative quotations under fair-use commentary. The cartoons remain the intellectual property of Tsai Chih-chung and his publishers (originally 時報文化, 大塊文化).
