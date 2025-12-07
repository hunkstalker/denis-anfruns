---
title: 'Handling SharePoint Lookup Fields in Power Apps'
description: 'The difference between Id and Value in complex columns.'
pubDate: '2023-11-10'
tags: ['power-apps', 'sharepoint', 'til', 'data-types']
---

SharePoint "Lookup" columns come into Power Apps as complex objects, not simple text.

When patching or filtering, you often need to be specific:

*   **Reading**: `ThisItem.MyLookup.Value` (gives you the text).
*   **Writing (Patching)**: You need to pass the proper record format.

```powerapps
{
  MyLookup: {
    '@odata.type': "#Microsoft.Azure.Connectors.SharePoint.SPListExpandedReference",
    Id: ComboBox.Selected.Id,
    Value: ComboBox.Selected.Value
  }
}
```

If you just pass the ID, it won't work!
