---
id: definition
title: Node Definition
---

# Node Definition

Node definitions describe the structure and behavior of node types. They define inputs, outputs, lifecycle hooks, and runtime methods.

## Defining a Node

Use `defineNode` from `nodedefinition.js` to create a node definition:

```javascript
const { defineNode } = require("./nodedefinition");

const MyNode = defineNode({
  name: "My Node",
  category: "Logic",

  inputs: {
    value: {
      type: "number",
      default: 0,
      displayName: "Input Value",
      set(value) {
        this._internal.value = value;
        this.flagOutputDirty("result");
      },
    },
  },

  outputs: {
    result: {
      type: "number",
      getter() {
        return this._internal.value * 2;
      },
    },
  },

  initialize() {
    this._internal.value = 0;
  },
});
```

## Metadata Properties

### Required

- `name` - Unique identifier for the node type
- `category` - Category for grouping ('Visual', 'Logic', 'Data', etc.)

### Optional

- `displayName` - Human-readable name shown in editor
- `docs` - URL to documentation
- `shortDesc` - Brief description
- `color` - Custom color theme
- `deprecated` - Mark as deprecated
- `singleton` - Only one instance allowed per component
- `allowChildren` - Node can have visual children
- `allowAsChild` - Node can be placed as a child
- `module` - Associated module name
- `version` - Node version
- `searchTags` - Additional search keywords

## Input Definition

Each input has:

```javascript
inputs: {
  inputName: {
    type: 'string' | 'number' | 'boolean' | 'signal' | {...},
    default: /* default value */,
    displayName: 'Display Name',
    group: 'Group Name',
    set(value) {
      // Handle input value change
    },
    index: 0, // Sort order
    tooltip: 'Help text',
    tab: 'Tab Name', // Property panel tab
    allowVisualStates: true, // Can be set per visual state
    exportToEditor: true, // Show in editor (default: true)
    inputPriority: 0 // Higher priority inputs are set first
  }
}
```

## Input Types

### Simple Type Format

For basic types, use a string:

```javascript
inputs: {
  text: { type: 'string', default: 'Hello' },
  count: { type: 'number', default: 0 },
  enabled: { type: 'boolean', default: true }
}
```

### Object Type Format

All types can be specified as objects for additional configuration:

```javascript
inputs: {
  name: {
    type: {
      name: 'string',
      allowEditOnly: true  // Only allow editing, not connections
    },
    default: 'Default Name'
  }
}
```

Common type object properties:

- `name` - The type name (required)
- `allowEditOnly` - Only allow manual editing, no connections
- `allowConnectionsOnly` - Only allow connections, no manual editing
- `units` - Array of available units (for numbers)
- `defaultUnit` - Default unit to use
- `enums` - Array of enum values
- `properties` - Array of properties (for proplist type)

### Primitive Types

```javascript
inputs: {
  // String
  text: { type: 'string', default: 'Hello' },

  // String with restrictions
  fixedText: {
    type: {
      name: 'string',
      allowEditOnly: true
    },
    default: 'Fixed'
  },

  // Number
  count: { type: 'number', default: 0 },

  // Boolean
  enabled: { type: 'boolean', default: true }
}
```

### Signal Type

For edge-triggered behavior:

```javascript
inputs: {
  trigger: {
    type: 'signal',
    valueChangedToTrue() {
      // Called when signal fires
      this.performAction();
    }
  },

  // Or with object format
  execute: {
    type: {
      name: 'signal',
      allowConnectionsOnly: true
    },
    valueChangedToTrue() {
      this.run();
    }
  }
}
```

**Note**: Signal inputs use `valueChangedToTrue()` instead of `set()`.

### Enum Type

For dropdown selections:

```javascript
inputs: {
  // Simple enum with strings
  size: {
    type: {
      name: 'enum',
      enums: ['small', 'medium', 'large']
    },
    default: 'medium'
  },

  // Enum with labels and values
  alignment: {
    type: {
      name: 'enum',
      enums: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' }
      ],
      allowEditOnly: true
    },
    default: 'left',
    set(value) {
      this._internal.alignment = value;
      this.updateAlignment();
    }
  }
}
```

### Visual Types

```javascript
inputs: {
  // Color
  color: {
    type: 'color',
    default: '#ffffff',
    set(value) {
      // Value is resolved from color styles automatically
      this._internal.element.style.backgroundColor = value;
    }
  },

  // Color with restrictions
  fixedColor: {
    type: {
      name: 'color',
      allowEditOnly: true
    },
    default: '#000000'
  },

  // Image
  image: {
    type: 'image',
    set(value) {
      this._internal.element.src = value;
    }
  },

  // Text Style
  textStyle: {
    type: 'textStyle',
    set(value) {
      this.applyTextStyle(value);
    }
  }
}
```

### Complex Types

```javascript
inputs: {
  // Array
  items: {
    type: 'array',
    set(value) {
      // Arrays can be passed as JSON strings and are auto-parsed
      this._internal.items = value;
    }
  },

  // Array with restrictions
  fixedArray: {
    type: {
      name: 'array',
      allowEditOnly: true
    }
  },

  // Object
  data: {
    type: 'object',
    set(value) {
      this._internal.data = value;
    }
  },

  // Object with restrictions
  config: {
    type: {
      name: 'object',
      allowConnectionsOnly: true
    }
  }
}
```

### Dimension Type

For values with units (px, %, em, etc.):

```javascript
inputs: {
  width: {
    type: {
      name: 'number',
      units: ['px', '%', 'vw', 'vh'],
      defaultUnit: 'px'
    },
    default: 100,
    set(value) {
      // value is { value: 100, unit: 'px' }
      this._internal.element.style.width = value.value + value.unit;
    },
    setUnitType(unit) {
      // Called when unit type changes
      this._internal.widthUnit = unit;
    }
  }
}
```

### Component Type

For component references:

```javascript
inputs: {
  component: {
    type: 'component',
    set(value) {
      // value is component name string
      this.loadComponent(value);
    }
  },

  // Component with restrictions
  fixedComponent: {
    type: {
      name: 'component',
      allowEditOnly: true
    }
  }
}
```

### Custom Object Types

For complex configurations:

```javascript
inputs: {
  style: {
    type: {
      name: 'proplist',
      properties: [
        { name: 'color', type: 'color' },
        { name: 'size', type: 'number' },
        { name: 'enabled', type: 'boolean' }
      ]
    },
    set(value) {
      // value is object with color, size, and enabled properties
      this.applyStyle(value);
    }
  }
}
```

### Input Setters

The `set` function is called when input value changes:

```javascript
inputs: {
  value: {
    type: 'number',
    set(value) {
      // 'this' is the node instance
      this._internal.value = value;

      // Flag outputs that depend on this input
      this.flagOutputDirty('result');

      // Or trigger immediate update
      this.sendValue('result', this.calculate());
    }
  }
}
```

### Input Properties

#### Display Properties

```javascript
{
  displayName: 'My Input', // Name shown in editor
  editorName: 'Custom', // Alternative name for specific contexts
  group: 'Configuration', // Property panel group
  index: 10, // Sort order (higher = later)
  tab: 'Advanced' // Property panel tab
}
```

#### Behavior Properties

```javascript
{
  allowVisualStates: true, // Can have different values per visual state
  exportToEditor: false, // Hide from editor
  inputPriority: 100 // Higher priority = set earlier (default: 0)
}
```

#### Documentation Properties

```javascript
{
  tooltip: 'Enter a number between 0 and 100',
  popout: {
    // Custom editor UI
    type: 'colorpicker',
    options: { showAlpha: true }
  }
}
```

## Output Definition

```javascript
outputs: {
  outputName: {
    type: 'number',
    displayName: 'Output Name',
    editorName: 'Custom Name',
    group: 'Results',
    index: 10,
    getter() {
      return this._internal.result;
    },
    onFirstConnectionAdded() {
      // Called when first connection is made to this output
      this.startMonitoring();
    },
    onLastConnectionRemoved() {
      // Called when last connection is removed
      this.stopMonitoring();
    }
  }
}
```

### Signal Outputs

```javascript
outputs: {
  done: {
    type: "signal";
    // No getter needed for signals
  }
}

// To send signal:
this.sendSignalOnOutput("done");
```

## Lifecycle Methods

```javascript
{
  initialize() {
    // Called once when node instance is created
    this._internal = {
      data: {},
      counter: 0
    };
  },

  methods: {
    customMethod() {
      // Custom methods available on node instance
      return this._internal.counter++;
    },

    anotherMethod(arg) {
      // Methods can take arguments
      this._internal.data[arg] = true;
    }
  }
}
```

## Dynamic Ports

For numbered inputs like "Input 0", "Input 1":

```javascript
{
  numberedInputs: {
    'input': {
      type: 'number',
      displayPrefix: 'Input',
      group: 'Inputs',
      defaultCount: 2, // Start with 2 inputs
      createSetter(index) {
        return function(value) {
          this._internal.inputs[index] = value;
          this.calculateSum();
        };
      }
    }
  },

  numberedOutputs: {
    'output': {
      type: 'number',
      displayPrefix: 'Output',
      createGetter(index) {
        return function() {
          return this._internal.outputs[index];
        };
      }
    }
  }
}
```

See [Dynamic Ports](dynamic-ports.md) for more details.

## Advanced Features

### Visual States Support

```javascript
{
  visualStates: ['hover', 'pressed', 'disabled'],
  inputs: {
    backgroundColor: {
      type: 'color',
      allowVisualStates: true
    }
  }
}
```

### Variants Support

```javascript
{
  useVariants: true;
}
```

### Children Support

```javascript
{
  allowChildren: true,
  allowChildrenWithCategory: ['Visual']
}
```

### Dynamic Ports Metadata

```javascript
{
  dynamicports: [
    {
      condition: "enabled",
      inputs: ["optionalInput1", "optionalInput2"],
      outputs: ["optionalOutput"],
    },
  ];
}
```

### Export Control

```javascript
inputs: {
  internalInput: {
    type: 'string',
    exportToEditor: false // Hide from editor
  }
}
```

## Complete Example

```javascript
const MyComplexNode = defineNode({
  name: "My.Complex.Node",
  displayName: "Complex Node",
  category: "Logic",
  color: "data",
  docs: "https://docs.noodl.net/nodes/my-complex-node",
  searchTags: ["advanced", "utility"],

  inputs: {
    enabled: {
      type: "boolean",
      default: true,
      displayName: "Enabled",
      group: "General",
      set(value) {
        this._internal.enabled = value;
        if (value) this.start();
        else this.stop();
      },
    },
    mode: {
      type: {
        name: "enum",
        enums: [
          { label: "Simple", value: "simple" },
          { label: "Advanced", value: "advanced" },
        ],
        allowEditOnly: true,
      },
      default: "simple",
      set(value) {
        this._internal.mode = value;
        this.updateMode();
      },
    },
    trigger: {
      type: "signal",
      valueChangedToTrue() {
        this.execute();
      },
    },
  },

  outputs: {
    result: {
      type: "string",
      displayName: "Result",
      getter() {
        return this._internal.result;
      },
    },
    done: {
      type: "signal",
    },
  },

  initialize() {
    this._internal = {
      enabled: true,
      mode: "simple",
      result: "",
    };
  },

  methods: {
    execute() {
      if (!this._internal.enabled) return;

      this._internal.result = "executed in " + this._internal.mode + " mode";
      this.flagOutputDirty("result");
      this.sendSignalOnOutput("done");
    },

    start() {
      console.log("Node started");
    },

    stop() {
      console.log("Node stopped");
    },

    updateMode() {
      // Update based on mode
    },
  },
});
```

## Registration

After defining, register the node:

```javascript
module.exports = MyNode;

// In node library initialization:
nodeRegister.register(MyNode);
```

## Best Practices

1. **Use descriptive names** - Make input/output names clear and self-documenting
2. **Provide defaults** - Always specify default values for inputs
3. **Group related inputs** - Use `group` property to organize property panel
4. **Document with tooltips** - Add helpful tooltips for complex inputs
5. **Handle undefined** - Check for undefined values in setters
6. **Use appropriate types** - Choose the right type for each input
7. **Use type objects when needed** - Use object format for `allowEditOnly`, `allowConnectionsOnly`, etc.
8. **Order logically** - Use `index` to order inputs meaningfully
9. **Clean up resources** - Use lifecycle methods to manage resources
10. **Flag outputs correctly** - Call `flagOutputDirty` when outputs change
11. **Test edge cases** - Verify behavior with various input combinations
