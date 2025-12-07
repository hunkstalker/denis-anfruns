---
title: 'Power Fx: LookUp vs Filter'
description: 'When to use which for performance.'
pubDate: '2023-08-22'
tags: ['power-apps', 'power-fx', 'til', 'performance']
---

I see this mistake a lot in code reviews: using `First(Filter(...))` when you only need one record.

*   **Filter**: Returns a *Table*. Even if it finds 1 item, it's a Table with 1 row.
*   **LookUp**: Returns a *Record*. It stops searching after finding the first match.

**Performance Tip:**
If you expect a single result (like searching by ID or unique Email), **always use LookUp**. It's faster because it doesn't have to scan the rest of the dataset once it finds a match.

```powerapps
// Bad
First(Filter(Users, Email = "me@example.com"))

// Good
LookUp(Users, Email = "me@example.com")
```
