---
title: 'Scope Issues with SharePointIntegration'
description: 'Why you cannot access SharePointIntegration properties inside Galleries.'
pubDate: '2023-05-14'
tags: ['power-apps', 'sharepoint', 'til', 'scope']
---

If you've ever tried to access `SharePointIntegration.Selected.ID` from inside a Gallery or a form control that has its own scope, you might have hit a wall.

The `SharePointIntegration` object is global but sometimes behaves oddly within nested data contexts.

**The Fix:**
Always store the selected item in a global variable on `OnSelect` or `OnStart`:

```powerapps
Set(varSelectedItem, SharePointIntegration.Selected);
```

Then reference `varSelectedItem` inside your galleries. It's safer and cleaner.
