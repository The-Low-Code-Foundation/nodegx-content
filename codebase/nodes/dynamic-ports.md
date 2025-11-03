---
id: dynamic-ports
title: Dynamic Ports
---

# Dynamic Ports

Dynamic ports allow nodes to have a variable number of inputs or outputs that are generated at runtime or based on configuration.

## Use Cases

- Numbered inputs (Input 0, Input 1, Input 2, etc.)
- Variable function arguments
- Dynamic object properties
- Conditional ports based on settings
- Generated ports from external schemas

## Numbered Inputs

The most common dynamic port pattern is numbered inputs:

```javascript
const { defineNode } = require("./nodedefinition");

const SwitchNode = defineNode({
  name: "Logic.Switch",
  displayName: "Switch",

  numberedInputs: {
    value: {
      type: "*",
      displayPrefix: "Value",
      group: "Values",
      createSetter(index) {
        return function (value) {
          this._internal.values[index] = value;
          this.updateOutput();
        };
      },
    },
  },

  inputs: {
    index: {
      type: "number",
      default: 0,
      set(value) {
        this._internal.currentIndex = value;
        this.updateOutput();
      },
    },
  },

  outputs: {
    current: {
      type: "*",
      getter() {
        const idx = this._internal.currentIndex;
        return this._internal.values[idx];
      },
    },
  },

  initialize() {
    this._internal = {
      values: {},
      currentIndex: 0,
    };
  },

  methods: {
    updateOutput() {
      this.flagOutputDirty("current");
    },
  },
});
```

## Numbered Input Properties

### Configuration

- `displayPrefix` - Prefix for port names (e.g., "Value" → "Value 0", "Value 1")
- `type` - Port type (can be '\*' for any type)
- `group` - Group name in property panel
- `defaultCount` - Default number of ports to create
- `createSetter(index)` - Function that returns setter for specific index

### Registration

Numbered inputs are automatically registered when the node is created. The system:

1. Creates ports based on model data or defaultCount
2. Calls `createSetter(index)` for each port
3. Registers the port with name pattern: `{prefix}{index}`

## Runtime Port Management

### Adding Ports

Ports can be added dynamically:

```javascript
methods: {
  addInput() {
    const index = Object.keys(this._internal.inputs).length;

    // Register new input
    this.registerInputIfNeeded(`input${index}`);

    // Initialize state
    this._internal.inputs[index] = null;
  }
}
```

### Removing Ports

```javascript
methods: {
  removeInput(index) {
    this.deregisterInput(`input${index}`);
    delete this._internal.inputs[index];
  }
}
```

## Dynamic Output Ports

Similar pattern for outputs:

```javascript
{
  numberedOutputs: {
    'result': {
      type: 'number',
      displayPrefix: 'Result',
      createGetter(index) {
        return function() {
          return this._internal.results[index];
        };
      }
    }
  }
}
```

## Metadata Registration

For editor integration, dynamic ports need metadata:

```javascript
{
  dynamicports: [
    {
      name: "value{index}",
      type: "number",
      plug: "input",
      group: "Values",
      index: 100, // Start index for sorting
    },
  ];
}
```

## Example: Function Node

A node with variable arguments:

```javascript
const FunctionNode = defineNode({
  name: "Logic.Function",

  numberedInputs: {
    arg: {
      type: "*",
      displayPrefix: "Argument",
      group: "Arguments",
      defaultCount: 2,
      createSetter(index) {
        return function (value) {
          this._internal.args[index] = value;
        };
      },
    },
  },

  inputs: {
    execute: {
      valueChangedToTrue() {
        const args = Object.values(this._internal.args);
        const result = this.executeFunction(args);
        this.setOutput("result", result);
      },
    },
    function: {
      type: "string",
      set(code) {
        try {
          this._internal.fn = new Function(...this.getArgNames(), code);
        } catch (error) {
          console.error("Function compilation error:", error);
        }
      },
    },
  },

  outputs: {
    result: { type: "*" },
  },

  initialize() {
    this._internal = {
      args: {},
      fn: null,
    };
  },

  methods: {
    getArgNames() {
      return Object.keys(this._internal.args).map((i) => `arg${i}`);
    },

    executeFunction(args) {
      if (!this._internal.fn) return undefined;
      try {
        return this._internal.fn(...args);
      } catch (error) {
        console.error("Function execution error:", error);
        return undefined;
      }
    },
  },
});
```

## Example: Object Property Ports

Generate ports from object schema:

```javascript
const ObjectNode = defineNode({
  name: "Data.Object",

  inputs: {
    schema: {
      type: "object",
      set(schema) {
        this.updatePortsFromSchema(schema);
      },
    },
  },

  outputs: {
    object: {
      type: "object",
      getter() {
        return this._internal.data;
      },
    },
  },

  initialize() {
    this._internal = {
      data: {},
      schema: null,
    };
  },

  methods: {
    updatePortsFromSchema(schema) {
      // Remove old ports
      if (this._internal.schema) {
        Object.keys(this._internal.schema).forEach((key) => {
          this.deregisterInput(key);
        });
      }

      // Add new ports
      Object.entries(schema).forEach(([key, config]) => {
        this.registerInput(key, {
          type: config.type || "string",
          set: (value) => {
            this._internal.data[key] = value;
            this.flagOutputDirty("object");
          },
        });
      });

      this._internal.schema = schema;
    },
  },
});
```

## Port Naming Conventions

### Numbered Ports

- Use zero-based indexing: `value0`, `value1`, `value2`
- Consistent prefix: all ports share same prefix
- Sequential: no gaps in numbering

### Dynamic Ports

- Descriptive names: `user.name`, `user.email`
- Avoid special characters: use alphanumeric and dots/underscores
- Consistent casing: typically camelCase

## Editor Integration

### Port Discovery

The editor discovers dynamic ports through:

1. `dynamicports` metadata array
2. Runtime port inspection
3. Model port configuration

### Port Configuration

Dynamic ports can be configured in the model:

```javascript
{
  type: 'My.Node',
  id: 'node1',
  ports: [
    { name: 'value0', type: 'number', plug: 'input' },
    { name: 'value1', type: 'number', plug: 'input' },
    { name: 'value2', type: 'number', plug: 'input' }
  ]
}
```

## Performance Considerations

1. **Limit port count** - Too many ports can slow the editor
2. **Lazy creation** - Only create ports when needed
3. **Batch registration** - Register multiple ports together
4. **Clean up unused** - Remove ports that are no longer needed

## Testing Dynamic Ports

```javascript
test("numbered inputs work correctly", () => {
  const node = createNode("Logic.Switch", "test1");

  // Set numbered inputs
  node.setInputValue("value0", "A");
  node.setInputValue("value1", "B");
  node.setInputValue("value2", "C");

  // Select index
  node.setInputValue("index", 1);

  // Check output
  expect(node.getOutputValue("current")).toBe("B");
});
```

## Best Practices

1. **Use numbered inputs for arrays** - When order matters
2. **Provide default count** - Make common cases work out of box
3. **Document port patterns** - Explain how ports are named
4. **Validate port names** - Ensure they don't conflict
5. **Handle missing ports** - Gracefully handle undefined inputs
6. **Clean up on removal** - Deregister ports properly
7. **Update metadata** - Keep dynamicports array in sync
8. **Test edge cases** - Empty arrays, single items, large counts
