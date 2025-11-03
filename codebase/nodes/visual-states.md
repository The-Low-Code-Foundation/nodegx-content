---
id: visual-states
title: Visual States
---

# Visual States

Visual states allow node parameters to have different values based on the current state (e.g., hover, pressed, focused). This enables responsive UI without complex logic.

## Purpose

- Define state-specific parameter values
- Enable interactive visual feedback
- Simplify conditional styling
- Support state transitions

## Defining Visual States

### In Node Definition

```javascript
const { defineNode } = require("./nodedefinition");

const ButtonNode = defineNode({
  name: "Visual.Button",

  visualStates: ["hover", "pressed", "disabled"],

  inputs: {
    backgroundColor: {
      type: "color",
      default: "#3498db",
      allowVisualStates: true,
    },
    textColor: {
      type: "color",
      default: "#ffffff",
      allowVisualStates: true,
    },
    enabled: {
      type: "boolean",
      default: true,
      set(value) {
        this._internal.enabled = value;
        this.updateVisualState();
      },
    },
  },

  initialize() {
    this._internal = {
      currentState: "default",
      enabled: true,
      hovering: false,
      pressing: false,
    };
  },

  methods: {
    updateVisualState() {
      let state = "default";

      if (!this._internal.enabled) {
        state = "disabled";
      } else if (this._internal.pressing) {
        state = "pressed";
      } else if (this._internal.hovering) {
        state = "hover";
      }

      if (state !== this._internal.currentState) {
        this._internal.currentState = state;
        this.applyVisualState(state);
      }
    },

    applyVisualState(state) {
      // Get state-specific values
      const bgColor = this.getVisualStateValue("backgroundColor", state);
      const textColor = this.getVisualStateValue("textColor", state);

      // Apply to element
      if (this._internal.element) {
        this._internal.element.style.backgroundColor = bgColor;
        this._internal.element.style.color = textColor;
      }
    },
  },
});
```

## Visual State Properties

### State List

Define available states:

```javascript
{
  visualStates: ["hover", "pressed", "focused", "disabled", "active"];
}
```

Common states:

- `default` - Base state (always present)
- `hover` - Mouse hovering over element
- `pressed` - Mouse button down
- `focused` - Element has focus
- `disabled` - Element is disabled
- `active` - Element is in active state

### State-Aware Inputs

Mark inputs that support visual states:

```javascript
inputs: {
  backgroundColor: {
    type: 'color',
    allowVisualStates: true
  }
}
```

## Working with Visual States

### Getting State Values

Get the value for a specific state:

```javascript
const value = this.getVisualStateValue("backgroundColor", "hover");
```

If state doesn't have a specific value, falls back to default.

### Setting State Values

Set values programmatically:

```javascript
this.setVisualStateValue("backgroundColor", "hover", "#e74c3c");
```

### Current State

Check or set the current state:

```javascript
// Get current state
const state = this._internal.currentState;

// Change state
this.setVisualState("hover");
```

## State Storage

Visual state values are stored in the model:

```javascript
{
  type: 'Visual.Button',
  id: 'button1',
  parameters: {
    backgroundColor: '#3498db',
    backgroundColor_hover: '#2980b9',
    backgroundColor_pressed: '#1c6ca1'
  }
}
```

Pattern: `{paramName}_{stateName}`

## State Transitions

### Manual Transitions

```javascript
methods: {
  onMouseEnter() {
    this._internal.hovering = true;
    this.updateVisualState();
  },

  onMouseLeave() {
    this._internal.hovering = false;
    this._internal.pressing = false;
    this.updateVisualState();
  },

  onMouseDown() {
    this._internal.pressing = true;
    this.updateVisualState();
  },

  onMouseUp() {
    this._internal.pressing = false;
    this.updateVisualState();
  }
}
```

### State Priority

When multiple states are active, define priority:

```javascript
methods: {
  updateVisualState() {
    // Priority: disabled > pressed > hover > default
    if (!this._internal.enabled) {
      this.setVisualState('disabled');
    } else if (this._internal.pressing) {
      this.setVisualState('pressed');
    } else if (this._internal.hovering) {
      this.setVisualState('hover');
    } else {
      this.setVisualState('default');
    }
  }
}
```

## Example: Interactive Card

```javascript
const CardNode = defineNode({
  name: "Visual.Card",

  visualStates: ["hover", "selected"],

  inputs: {
    elevation: {
      type: "number",
      default: 2,
      allowVisualStates: true,
    },
    scale: {
      type: "number",
      default: 1.0,
      allowVisualStates: true,
    },
    opacity: {
      type: "number",
      default: 1.0,
      allowVisualStates: true,
    },
    selected: {
      type: "boolean",
      default: false,
      set(value) {
        this._internal.selected = value;
        this.updateVisualState();
      },
    },
  },

  initialize() {
    this._internal = {
      hovering: false,
      selected: false,
      element: null,
    };

    // Create element
    this._internal.element = document.createElement("div");
    this._internal.element.className = "card";

    // Add event listeners
    this._internal.element.addEventListener("mouseenter", () => {
      this._internal.hovering = true;
      this.updateVisualState();
    });

    this._internal.element.addEventListener("mouseleave", () => {
      this._internal.hovering = false;
      this.updateVisualState();
    });
  },

  methods: {
    updateVisualState() {
      let state = "default";

      if (this._internal.selected) {
        state = "selected";
      } else if (this._internal.hovering) {
        state = "hover";
      }

      this.applyVisualState(state);
    },

    applyVisualState(state) {
      const el = this._internal.element;

      const elevation = this.getVisualStateValue("elevation", state);
      const scale = this.getVisualStateValue("scale", state);
      const opacity = this.getVisualStateValue("opacity", state);

      el.style.boxShadow = `0 ${elevation}px ${
        elevation * 2
      }px rgba(0,0,0,0.2)`;
      el.style.transform = `scale(${scale})`;
      el.style.opacity = opacity;
    },
  },
});
```

## Example: Input Field States

```javascript
const InputNode = defineNode({
  name: "Visual.Input",

  visualStates: ["focused", "error", "disabled"],

  inputs: {
    borderColor: {
      type: "color",
      default: "#bdc3c7",
      allowVisualStates: true,
    },
    borderWidth: {
      type: "number",
      default: 1,
      allowVisualStates: true,
    },
    backgroundColor: {
      type: "color",
      default: "#ffffff",
      allowVisualStates: true,
    },
    hasError: {
      type: "boolean",
      set(value) {
        this._internal.hasError = value;
        this.updateVisualState();
      },
    },
    enabled: {
      type: "boolean",
      default: true,
      set(value) {
        this._internal.enabled = value;
        this.updateVisualState();
      },
    },
  },

  methods: {
    updateVisualState() {
      let state = "default";

      // Priority: disabled > error > focused
      if (!this._internal.enabled) {
        state = "disabled";
      } else if (this._internal.hasError) {
        state = "error";
      } else if (this._internal.focused) {
        state = "focused";
      }

      this.applyVisualState(state);
    },
  },
});
```

## Animated Transitions

For smooth state transitions:

```javascript
methods: {
  applyVisualState(state) {
    const el = this._internal.element;

    // Enable transitions
    el.style.transition = 'all 0.3s ease';

    // Apply state values
    const bgColor = this.getVisualStateValue('backgroundColor', state);
    el.style.backgroundColor = bgColor;
  }
}
```

## Editor Integration

### Property Panel

Visual state inputs show state selector in the editor:

```
┌─────────────────────────┐
│ Background Color        │
│ ┌─────────────────────┐ │
│ │ Default ▼           │ │
│ └─────────────────────┘ │
│ [Color Picker]          │
└─────────────────────────┘
```

### State Management

The editor manages state-specific values and provides UI for:

- Switching between states
- Setting state-specific values
- Previewing different states
- Copying values between states

## Best Practices

1. **Use semantic states** - Name states by meaning, not appearance
2. **Provide defaults** - Always have default state values
3. **Limit state count** - Too many states become confusing
4. **Document states** - Explain what each state represents
5. **Test all states** - Verify each state works correctly
6. **Consider priority** - Define clear state precedence
7. **Smooth transitions** - Use CSS transitions for better UX
8. **Clean up listeners** - Remove event listeners in \_onNodeDeleted
