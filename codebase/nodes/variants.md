---
id: variants
title: Variants
---

# Variants

Variants allow nodes to have different parameter values based on active variants (e.g., mobile, tablet, desktop). This enables responsive design and multi-platform support.

## Purpose

- Support responsive layouts
- Enable platform-specific designs
- Manage theme variations
- Handle localization

## Variants System

The variants system is managed by the `Variants` class (`variants.js`):

```javascript
const Variants = require("./variants");

const variants = new Variants();
```

## Defining Variants

### In Project

Variants are defined at the project level:

```javascript
{
  variants: [
    { name: "mobile", condition: "screen.width < 768" },
    { name: "tablet", condition: "screen.width >= 768 && screen.width < 1024" },
    { name: "desktop", condition: "screen.width >= 1024" },
  ];
}
```

### Common Variant Types

**Responsive**

- `mobile`
- `tablet`
- `desktop`
- `ultrawide`

**Platform**

- `ios`
- `android`
- `web`
- `native`

**Theme**

- `light`
- `dark`
- `high-contrast`

**Localization**

- `en`
- `es`
- `fr`
- Language-specific variants

## Enabling Variants

### In Node Definition

```javascript
const { defineNode } = require("./nodedefinition");

const TextNode = defineNode({
  name: "Visual.Text",
  useVariants: true,

  inputs: {
    fontSize: {
      type: "number",
      default: 16,
    },
    text: {
      type: "string",
      default: "Hello",
    },
  },
});
```

Setting `useVariants: true` enables variant support for all parameters.

## Variant Values

### Storage

Variant-specific values are stored with suffix:

```javascript
{
  type: 'Visual.Text',
  id: 'text1',
  parameters: {
    fontSize: 16,           // Default
    fontSize_mobile: 14,    // Mobile variant
    fontSize_tablet: 18,    // Tablet variant
    fontSize_desktop: 20    // Desktop variant
  }
}
```

Pattern: `{paramName}_{variantName}`

### Getting Variant Values

```javascript
const value = this.getVariantValue("fontSize", "mobile");
```

Falls back to default if variant value not set.

## Active Variants

### Setting Active Variants

```javascript
context.variants.setActiveVariants(["mobile", "dark"]);
```

### Checking Active Variants

```javascript
if (context.variants.isActive("mobile")) {
  // Mobile variant is active
}

const activeVariants = context.variants.getActive();
// Returns: ['mobile', 'dark']
```

## Variant Resolution

When multiple variants are active, values are resolved in order:

1. Most specific variant (last active)
2. Less specific variants
3. Default value

```javascript
// Active: ['mobile', 'dark']
// Resolution order: dark → mobile → default

const value = this.resolveVariantValue("backgroundColor");
// Checks: backgroundColor_dark, backgroundColor_mobile, backgroundColor
```

## Node Integration

### Applying Variants

Nodes automatically apply variant values when variants change:

```javascript
setVariant(variant) {
  // Apply variant-specific parameters
  Object.keys(this.model.parameters).forEach(key => {
    const variantKey = `${key}_${variant}`;
    if (this.model.parameters.hasOwnProperty(variantKey)) {
      this.setParameter(key, this.model.parameters[variantKey]);
    }
  });
}
```

### Listening to Variant Changes

```javascript
initialize() {
  this.context.variants.on('changed', () => {
    this.updateForVariants();
  });
}

methods: {
  updateForVariants() {
    const activeVariants = this.context.variants.getActive();
    activeVariants.forEach(variant => {
      this.setVariant(variant);
    });
  }
}
```

## Example: Responsive Layout

```javascript
const ContainerNode = defineNode({
  name: "Visual.Container",
  useVariants: true,

  inputs: {
    width: {
      type: "number",
      default: 1200,
    },
    padding: {
      type: "number",
      default: 20,
    },
    columns: {
      type: "number",
      default: 12,
    },
  },

  initialize() {
    this._internal = {
      element: document.createElement("div"),
    };

    // Listen to variant changes
    this.context.variants.on("changed", () => {
      this.applyLayout();
    });

    this.applyLayout();
  },

  methods: {
    applyLayout() {
      const variants = this.context.variants.getActive();

      // Get values for active variants
      let width = this.getInputValue("width");
      let padding = this.getInputValue("padding");
      let columns = this.getInputValue("columns");

      // Override with variant-specific values
      variants.forEach((variant) => {
        const variantWidth = this.getVariantValue("width", variant);
        const variantPadding = this.getVariantValue("padding", variant);
        const variantColumns = this.getVariantValue("columns", variant);

        if (variantWidth !== undefined) width = variantWidth;
        if (variantPadding !== undefined) padding = variantPadding;
        if (variantColumns !== undefined) columns = variantColumns;
      });

      // Apply to element
      const el = this._internal.element;
      el.style.maxWidth = `${width}px`;
      el.style.padding = `${padding}px`;
      el.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    },
  },
});
```

## Example: Theme Support

```javascript
const ThemedBoxNode = defineNode({
  name: "Visual.ThemedBox",
  useVariants: true,

  inputs: {
    backgroundColor: {
      type: "color",
      default: "#ffffff",
    },
    textColor: {
      type: "color",
      default: "#000000",
    },
    borderColor: {
      type: "color",
      default: "#cccccc",
    },
  },

  initialize() {
    // Default theme
    this.parameters.backgroundColor = "#ffffff";
    this.parameters.textColor = "#000000";

    // Dark theme
    this.parameters.backgroundColor_dark = "#1a1a1a";
    this.parameters.textColor_dark = "#ffffff";

    // High contrast theme
    this.parameters.backgroundColor_highcontrast = "#000000";
    this.parameters.textColor_highcontrast = "#ffff00";

    this.applyTheme();
  },

  methods: {
    applyTheme() {
      const variants = this.context.variants.getActive();
      const themeVariant = variants.find((v) =>
        ["dark", "light", "highcontrast"].includes(v)
      );

      if (themeVariant) {
        this.setVariant(themeVariant);
      }
    },
  },
});
```

## Conditional Variants

Variants can have conditions that determine when they're active:

```javascript
{
  name: 'mobile',
  condition: 'screen.width < 768'
}
```

The system evaluates conditions and activates matching variants automatically.

## Querying Nodes by Variant

Find all nodes with a specific variant:

```javascript
const mobileNodes = nodeScope.getAllNodesWithVariantRecursive("mobile");
```

## Variant Transitions

Smoothly transition between variants:

```javascript
methods: {
  transitionToVariant(variant) {
    const el = this._internal.element;

    // Enable transitions
    el.style.transition = 'all 0.3s ease';

    // Apply variant
    this.setVariant(variant);
  }
}
```

## Editor Integration

### Variant Selector

The editor provides a variant selector:

```
┌────────────────────┐
│ Variants: ▼        │
├────────────────────┤
│ ☐ Mobile           │
│ ☐ Tablet           │
│ ☑ Desktop          │
│ ☐ Dark Theme       │
└────────────────────┘
```

### Parameter Panel

Shows variant-specific values:

```
┌─────────────────────────┐
│ Font Size              │
│ ┌─────────────────────┐ │
│ │ Default: 16         │ │
│ │ Mobile:  14         │ │
│ │ Tablet:  18         │ │
│ │ Desktop: 20         │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

## Performance Considerations

1. **Limit active variants** - Too many active variants can impact performance
2. **Cache variant values** - Don't recalculate on every frame
3. **Batch variant changes** - Change multiple variants at once
4. **Lazy evaluation** - Only resolve variants when needed

## Testing Variants

```javascript
test("node respects variant values", () => {
  const node = createNode("Visual.Text", "text1");

  // Set default and variant values
  node.setParameter("fontSize", 16);
  node.setVariantValue("fontSize", "mobile", 14);

  // Activate mobile variant
  context.variants.setActiveVariants(["mobile"]);

  // Check resolved value
  expect(node.getResolvedValue("fontSize")).toBe(14);

  // Deactivate variant
  context.variants.setActiveVariants([]);

  // Check default value
  expect(node.getResolvedValue("fontSize")).toBe(16);
});
```

## Best Practices

1. **Use semantic names** - Name variants by purpose, not specifics
2. **Provide defaults** - Always have default values
3. **Limit variant count** - Too many variants complicate management
4. **Test all variants** - Verify behavior in each variant
5. **Document conditions** - Explain when variants are active
6. **Graceful degradation** - Fall back to defaults when variant missing
7. **Consider inheritance** - Child components inherit variants
8. **Optimize performance** - Cache resolved values
