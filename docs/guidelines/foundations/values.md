# Values

This page lists the concrete values behind Notable's foundations. Each category links back to its guideline, which explains when and why to use these values. Use the names here, not raw numbers, when designing.

Pixel values assume a root size of 16 px.

## Colors

### Neutral palette

| Name     | Hex       |
| -------- | --------- |
| Gray 50  | `#fafafa` |
| Gray 100 | `#f5f5f5` |
| Gray 200 | `#e5e5e5` |
| Gray 300 | `#d4d4d4` |
| Gray 400 | `#a3a3a3` |
| Gray 500 | `#737373` |
| Gray 600 | `#525252` |
| Gray 700 | `#404040` |
| Gray 800 | `#262626` |
| Gray 900 | `#171717` |
| Gray 950 | `#0a0a0a` |
| White    | `#ffffff` |
| Black    | `#000000` |

### Roles

| Role               | Light          | Dark           |
| ------------------ | -------------- | -------------- |
| Primary            | `#171717`      | `#f5f5f5`      |
| On primary         | `#ffffff`      | `#171717`      |
| Primary hover      | `#262626`      | `#e5e5e5`      |
| Primary active     | `#404040`      | `#d4d4d4`      |
| Secondary          | `#e5e5e5`      | `#404040`      |
| On secondary       | `#171717`      | `#f5f5f5`      |
| Secondary hover    | `#f5f5f5`      | `#525252`      |
| Secondary active   | `#d4d4d4`      | `#737373`      |
| Danger             | `#b91c1c`      | `#f87171`      |
| Danger subtle      | `#fef2f2`      | `#450a0a`      |
| Danger border      | `#fecaca`      | `#7f1d1d`      |
| Success            | `#166534`      | `#86efac`      |
| Success subtle     | `#f0fdf4`      | `#052e16`      |
| Success border     | `#bbf7d0`      | `#166534`      |
| Warning            | `#854d0e`      | `#fde68a`      |
| Warning subtle     | `#fffbeb`      | `#422006`      |
| Warning border     | `#fde68a`      | `#854d0e`      |
| Information        | `#1e40af`      | `#93c5fd`      |
| Information subtle | `#eff6ff`      | `#172554`      |
| Information border | `#bfdbfe`      | `#1e40af`      |
| Background         | `#ffffff`      | `#000000`      |
| Surface            | `#ffffff`      | `#171717`      |
| Raised surface     | `#ffffff`      | `#262626`      |
| Floating surface   | `#ffffff`      | `#171717`      |
| Sunken surface     | `#fafafa`      | `#0a0a0a`      |
| Surface hover      | `#f5f5f5`      | `#262626`      |
| Surface active     | `#e5e5e5`      | `#404040`      |
| Highlight          | `#f5f5f5`      | `#262626`      |
| Overlay            | Black, 50%     | Black, 70%     |
| Text               | `#171717`      | `#f5f5f5`      |
| Text muted         | `#525252`      | `#a3a3a3`      |
| Text subtle        | `#737373`      | `#737373`      |
| Text disabled      | `#a3a3a3`      | `#525252`      |
| Text inverse       | `#ffffff`      | `#171717`      |
| Border             | `#e5e5e5`      | `#262626`      |
| Border strong      | `#d4d4d4`      | `#404040`      |
| Border subtle      | `#f5f5f5`      | `#171717`      |
| Border disabled    | `#e5e5e5`      | `#262626`      |
| Focus              | `#171717`      | `#f5f5f5`      |
| Focus ring         | `#171717`, 20% | `#ffffff`, 25% |
| Disabled           | `#f5f5f5`      | `#262626`      |
| On disabled        | `#a3a3a3`      | `#737373`      |
| Shadow             | Black, 5%      | Black, 20%     |
| Strong shadow      | Black, 10%     | Black, 40%     |

## Spacing

| Step | Size  |
| ---- | ----- |
| 0    | 0 px  |
| 1    | 4 px  |
| 2    | 8 px  |
| 3    | 12 px |
| 4    | 16 px |
| 5    | 20 px |
| 6    | 24 px |
| 8    | 32 px |
| 10   | 40 px |
| 12   | 48 px |
| 16   | 64 px |

## Radius

| Step | Size    |
| ---- | ------- |
| XS   | 4 px    |
| SM   | 8 px    |
| MD   | 12 px   |
| LG   | 16 px   |
| XL   | 24 px   |
| 2XL  | 32 px   |
| Full | 9999 px |

## Borders

| Token                | Width |
| -------------------- | ----- |
| Default border width | 2 px  |

## Shadows

| Step   | Layers                                                                                       |
| ------ | -------------------------------------------------------------------------------------------- |
| Small  | Offset 0, 1 px; blur 2 px; shadow color                                                      |
| Medium | Offset 0, 1 px; blur 3 px; strong shadow color, plus offset 0, 1 px; blur 2 px; shadow color |
| Large  | Offset 0, 2 px; blur 8 px; strong shadow color                                               |

## Blur

| Step    | Radius |
| ------- | ------ |
| None    | 0 px   |
| Subtle  | 4 px   |
| Medium  | 8 px   |
| Strong  | 16 px  |
| Intense | 24 px  |

## Motion

### Durations

| Token   | Duration |
| ------- | -------- |
| Fast    | 140 ms   |
| Base    | 160 ms   |
| Medium  | 200 ms   |
| Slow    | 800 ms   |
| Enter   | 360 ms   |
| Exit    | 240 ms   |
| Minimum | 120 ms   |
| Delay   | 350 ms   |

### Easing

| Token                 | Curve                            |
| --------------------- | -------------------------------- |
| Standard              | `ease`                           |
| Spring                | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| Emphasized decelerate | `cubic-bezier(0.32, 0.72, 0, 1)` |
| Emphasized accelerate | `cubic-bezier(0.5, 0, 0.75, 0)`  |

## Typography

### Typeface

| Token  | Value                             |
| ------ | --------------------------------- |
| Family | Geist, with a sans-serif fallback |

### Sizes

| Step | Size  |
| ---- | ----- |
| XS   | 12 px |
| SM   | 14 px |
| MD   | 16 px |
| LG   | 18 px |
| XL   | 20 px |
| 2XL  | 24 px |
| 3XL  | 32 px |

### Weights

| Token    | Weight |
| -------- | ------ |
| Regular  | 400    |
| Medium   | 500    |
| Semibold | 600    |
| Bold     | 700    |

### Line heights

| Token   | Value |
| ------- | ----- |
| Tight   | 1.2   |
| Normal  | 1.5   |
| Relaxed | 1.7   |
