# Adding New Nodes

This guide explains how to create custom nodes for the OpenNoodl platform.

## Node Basics

Nodes are the fundamental building blocks of Noodl applications. Each node has:

- **Inputs**: Data flowing into the node
- **Outputs**: Data flowing out of the node
- **Parameters**: Configuration options
- **Implementation**: The actual functionality

## Creating a Simple Node

### 1. Node Definition

Create a new file in `/packages/noodl-core-nodes/src/`:

```javascript
// MyCustomNode.js
import * as Noodl from "@noodl/noodl-sdk";

const MyCustomNode = Noodl.defineNode( {
  static displayName = "My Custom Node";
  static category = "Utilities";

  static inputs = {
    value: { type: "string", displayName: "Input Value" },
    trigger: { type: "signal", displayName: "Trigger" },
  };

  static outputs = {
    result: { type: "string", displayName: "Result" },
    done: { type: "signal", displayName: "Done" },
  };

  constructor() {
    super();
    this.inputs.trigger = () => this.execute();
  }

  execute() {
    const inputValue = this.inputs.value || "";
    const result = inputValue.toUpperCase();

    this.outputs.result = result;
    this.outputs.done();
  }
})

module.exports = MyCustomNode;
```

### 2. Register the Node

Add your node to the registry in `/packages/noodl-core-nodes/src/index.js`:

```javascript
const MyCustomNode = require("./MyCustomNode");

module.exports = {
  // ...existing nodes
  MyCustomNode: MyCustomNode,
};
```

## Node Types and Categories

### Common Node Categories

- **UI**: Visual components (Button, Text, Input)
- **Logic**: Control flow (Condition, Loop, Switch)
- **Data**: Data manipulation (Object, Array, String)
- **Events**: User interactions (Click, Hover, Key)
- **Utilities**: Helper functions (Debug, Timer, Math)

### Input/Output Types

- `string`: Text data
- `number`: Numeric values
- `boolean`: True/false values
- `object`: Complex data structures
- `signal`: Event triggers
- `array`: Lists of items
- `color`: Color values
- `image`: Image references

## Advanced Node Features

### Dynamic Inputs/Outputs

```javascript
const DynamicNode = Noodl.defineNode({
  static getInputs(nodeModel) {
    const inputs = { count: { type: "number" } };

    const count = nodeModel.parameters.count || 1;
    for (let i = 0; i < count; i++) {
      inputs[`input${i}`] = { type: "string" };
    }

    return inputs;
  }

  static getOutputs(nodeModel) {
    // Similar dynamic output generation
  }
})
```

### Node Parameters

```javascript
const ConfigurableNode = Noodl.defineNode({
  static parameters = {
    mode: {
      type: "enum",
      options: ["Add", "Subtract", "Multiply"],
      default: "Add",
    },
    precision: {
      type: "number",
      default: 2,
      min: 0,
      max: 10,
    },
  };
})
```

### State Management

```javascript
const StatefulNode = Noodl.defineNode({
  constructor() {
    super();
    this.state = {
      counter: 0,
      history: [],
    };
  }

  execute() {
    this.state.counter++;
    this.state.history.push(new Date());

    this.outputs.count = this.state.counter;
  }
})
```

## UI Component Nodes

### React Component Integration

```javascript
const MyUINode = Noodl.defineNode({
  static displayName = "Custom Button";
  static category = "UI";

  static getReactComponent() {
    return function CustomButton(props) {
      return (
        <button onClick={props.onClick} style={props.style}>
          {props.label}
        </button>
      );
    };
  }

  static inputs = {
    label: { type: "string", displayName: "Label" },
    onClick: { type: "signal", displayName: "Click" },
  };
})
```

## Testing Nodes

### Unit Tests

```javascript
// MyCustomNode.test.js
const MyCustomNode = require("./MyCustomNode");

describe("MyCustomNode", () => {
  let node;

  beforeEach(() => {
    node = new MyCustomNode();
  });

  test("converts input to uppercase", () => {
    node.inputs.value = "hello world";
    node.execute();

    expect(node.outputs.result).toBe("HELLO WORLD");
  });

  test("triggers done signal", () => {
    const doneSpy = jest.fn();
    node.outputs.done = doneSpy;

    node.execute();

    expect(doneSpy).toHaveBeenCalled();
  });
});
```

## Best Practices

### Node Design

- Keep nodes focused on a single responsibility
- Use clear, descriptive names for inputs/outputs
- Provide helpful documentation and examples
- Handle edge cases gracefully

### Performance

- Avoid heavy computations in the constructor
- Cache expensive operations when possible
- Use lazy evaluation for optional features
- Minimize memory usage

### Error Handling

```javascript
execute() {
  try {
    // Node logic here
  } catch (error) {
    this.sendError('MyCustomNode', error.message)
  }
}
```

## Publishing Custom Nodes

For nodes that should be available to the community:

1. Create a separate npm package
2. Follow the naming convention: `noodl-node-*`
3. Include proper documentation and examples
4. Submit to the Noodl community registry

## Debugging Nodes

Use the built-in debugging tools:

- Console logging within node execution
- Visual debugging in the editor
- Unit tests for isolated testing
- Integration tests for workflow testing
