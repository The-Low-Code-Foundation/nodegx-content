---
id: instance
title: Node Instance
---

# Node Instance

Node instances are runtime objects created from node definitions. They manage state, handle input changes, and produce outputs.

## Base Class

All nodes inherit from `node.js` which provides core functionality:

```javascript
const Node = require("./node");

class MyNode extends Node {
  constructor(context, id) {
    super(context, id);
    // Custom initialization
  }
}
```

## Instance Properties

### Core Properties

- `id` - Unique instance identifier
- `name` - Node type name
- `context` - Reference to NodeContext
- `nodeScope` - Parent NodeScope
- `model` - Graph model data (if from editor)

### Internal State

- `_internal` - Private state storage
- `_inputValues` - Current input values
- `_inputs` - Input definitions
- `_outputs` - Output definitions
- `_dirty` - Needs update flag
- `_deleted` - Marked for deletion

## Managing Inputs

### Reading Input Values

```javascript
const value = this.getInputValue("myInput");
```

### Setting Input Values

```javascript
this.setInputValue("myInput", 42);
```

### Queuing Input Changes

```javascript
this.queueInput("myInput", newValue);
```

### Checking Connections

```javascript
if (this.isInputConnected("myInput")) {
  // Input has a connection
}
```

## Managing Outputs

### Sending Output Values

```javascript
this.sendValue("myOutput", result);
```

### Flagging Output Dirty

```javascript
this.flagOutputDirty("myOutput"); // Re-sends current value
```

### Sending Signals

```javascript
this.sendSignalOnOutput("done");
```

### Flag All Outputs

```javascript
this.flagAllOutputsDirty();
```

## Update Cycle

### Dirty Flagging

Nodes update when flagged dirty:

```javascript
this.flagDirty(); // Schedule update
```

### Update Method

Override to implement custom update logic:

```javascript
update() {
  super.update();
  // Custom update logic runs after inputs are set
}
```

### Scheduled Callbacks

Execute code after inputs update:

```javascript
this.scheduleAfterInputsHaveUpdated(() => {
  // Runs after all queued inputs are processed
});
```

## State Management

### Private State

```javascript
initialize() {
  this._internal = {
    counter: 0,
    data: {},
    timer: null
  };
}
```

### Cleaning Up

```javascript
_onNodeDeleted() {
  // Clean up resources
  if (this._internal.timer) {
    clearInterval(this._internal.timer);
  }
  super._onNodeDeleted();
}
```

## Working with Context

### Scheduling Updates

```javascript
this.context.scheduleUpdate(); // Request frame update
```

### Next Frame Callback

```javascript
this.context.scheduleNextFrame(() => {
  // Runs on next frame
});
```

### After Update Callback

```javascript
this.context.scheduleAfterUpdate(() => {
  // Runs after current update cycle
});
```

### Timers

```javascript
const timerId = this.context.timerScheduler.setTimeout(() => {
  // Timer callback
}, 1000);

// Clean up
this.context.timerScheduler.clearTimeout(timerId);
```

### Global Values

```javascript
this.context.setGlobalValue("myKey", value);
const value = this.context.getGlobalValue("myKey");
```

## Delete Listeners

Register cleanup callbacks:

```javascript
initialize() {
  this.addDeleteListener(() => {
    // Cleanup when node is deleted
  });
}
```

## Node Model Integration

When connected to editor:

```javascript
setNodeModel(nodeModel) {
  super.setNodeModel(nodeModel);

  // Listen to parameter changes
  // Handled automatically by base class
}

_onNodeModelParameterUpdated(event) {
  // Called when parameter changes in editor
  super._onNodeModelParameterUpdated(event);
  // Custom handling
}
```

## Visual States

For nodes supporting visual states:

```javascript
_getVisualStates() {
  return ['hover', 'pressed'];
}
```

## Variants

Setting variants:

```javascript
setVariant(variant) {
  // Apply variant parameters
  // Usually handled by NodeScope
}
```

## Example: Counter Node

```javascript
const CounterNode = defineNode({
  name: "Counter",
  category: "Logic",

  inputs: {
    increment: {
      valueChangedToTrue() {
        this._internal.count++;
        this.flagOutputDirty("count");
      },
    },
    reset: {
      valueChangedToTrue() {
        this._internal.count = 0;
        this.flagOutputDirty("count");
      },
    },
  },

  outputs: {
    count: {
      type: "number",
      getter() {
        return this._internal.count;
      },
    },
  },

  initialize() {
    this._internal = {
      count: 0,
    };
  },
});
```

## Best Practices

1. **Use `_internal` for state** - Keep state in `_internal` object
2. **Clean up resources** - Use `_onNodeDeleted` or delete listeners
3. **Avoid globals** - Use context services instead
4. **Queue inputs during updates** - Use `queueInput` to avoid race conditions
5. **Flag outputs dirty** - Call `flagOutputDirty` when output changes
6. **Check connections** - Use `isInputConnected` before optional logic
7. **Schedule properly** - Use appropriate scheduling methods
8. **Handle undefined** - Check for undefined inputs/outputs
