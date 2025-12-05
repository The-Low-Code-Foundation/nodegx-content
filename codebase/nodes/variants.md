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

## Enabling Variants in Nodes

### In Node Definition

```javascript
const { defineNode } = require("./nodedefinition");

const TextNode = defineNode({
  name: "Visual.Text",
  useVariants: true, // Enable variant support

  inputs: {
    fontSize: {
      type: "number",
      default: 16,
    },
  },
});
```

Setting `useVariants: true` enables variant support for the node's parameters.

## Variant Storage

When a node has `useVariants: true`, parameter values can be stored with variant suffixes in the model:

```javascript
{
  type: 'Visual.Text',
  id: 'text1',
  parameters: {
    fontSize: 16,           // Default value
    fontSize_mobile: 14,    // Mobile variant value
    fontSize_tablet: 18,    // Tablet variant value
    fontSize_desktop: 20    // Desktop variant value
  }
}
```

Pattern: `{paramName}_{variantName}`

## Variants System

The variants system is managed by the `Variants` class available in `NodeContext`:

```javascript
// Access variants from node context
const variants = this.context.variants;
```

## Common Variant Types

**Responsive**

- `mobile`
- `tablet`
- `desktop`

**Platform**

- `ios`
- `android`
- `web`

**Theme**

- `light`
- `dark`

**Localization**

- Language codes (e.g., `en`, `es`, `fr`)

## Node Variant Method

Nodes with variants support the `setVariant` method:

```javascript
{
  setVariant(variant) {
    // Called when variant changes
    // Node should update its parameters based on the variant
  }
}
```

## Querying Nodes by Variant

The NodeScope provides a method to find nodes with specific variants:

```javascript
const nodesWithVariant = nodeScope.getAllNodesWithVariantRecursive("mobile");
```

## Editor Integration

### Variant-Specific Parameters

The editor allows setting different values for each variant. When a parameter has variant-specific values, the editor stores them with the `{paramName}_{variantName}` pattern.

### Variant Selector

The editor provides UI for selecting and previewing different variants during development.

## Best Practices

1. **Enable selectively** - Only use `useVariants: true` for nodes that need responsive behavior
2. **Provide defaults** - Always have default values that work without variants
3. **Test all variants** - Verify behavior works correctly in each variant
4. **Use semantic names** - Name variants by purpose (e.g., 'mobile', 'tablet', not 'small', 'medium')
5. **Document variants** - Explain which variants your node supports
6. **Graceful degradation** - Handle cases where variant-specific values aren't set

## Notes

The variants system implementation details may vary. This documentation covers the basic variant support available through the `useVariants` flag and variant parameter naming convention.

For the most accurate and up-to-date information about the variants API, refer to:

- `packages/noodl-runtime/src/variants.js` - Variants class implementation
- `packages/noodl-runtime/src/nodecontext.js` - Context integration
- Example nodes in `packages/noodl-viewer-react/src/nodes` - Practical usage

## See Also

- [Node Definition](definition.md) - Base node definition
- [Node Context](context.md) - Runtime context
- [Frontend Nodes](frontend-nodes.md) - Visual node implementation
