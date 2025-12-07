---
title: 'TIL: Centering a Div with Grid'
description: 'The quickest way to center anything in CSS.'
pubDate: '2025-12-06'
tags: ['css', 'til', 'snippets']
---

Just learned that you can center a div in 2 lines of CSS using Grid, and it works even if you don't know the height of the child.

```css
.parent {
  display: grid;
  place-items: center;
}
```

Much cleaner than the old flexbox `justify-content` + `align-items` combo!
