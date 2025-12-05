---
id: context
title: Node Context
---

# Node Context

NodeContext (`nodecontext.js`) is the shared runtime environment for all nodes. It provides services, manages the update cycle, and coordinates component execution.

## Purpose

- Manages the node update cycle
- Provides shared services (timers, events, etc.)
- Maintains global state
- Coordinates component lifecycle
- Handles module/component loading

## Creating a Context

```javascript
const NodeContext = require("./nodecontext");

const context = new NodeContext({
  platform: "browser", // or 'nodejs'
  // ... other options
});
```

## Core Services

### Node Register

Registry for all node types:

```javascript
context.nodeRegister.register(nodeDefinition);
const node = context.nodeRegister.createNode("My.Node", "id", scope);
const metadata = context.nodeRegister.getNodeMetadata("My.Node");
const hasNode = context.nodeRegister.hasNode("My.Node");
```

### Timer Scheduler

Manages timeouts and intervals:

```javascript
const timerId = context.timerScheduler.setTimeout(() => {
  console.log("Timer fired");
}, 1000);

context.timerScheduler.clearTimeout(timerId);

const intervalId = context.timerScheduler.setInterval(() => {
  console.log("Interval tick");
}, 500);

context.timerScheduler.clearInterval(intervalId);
```

### Event Emitter

Context inherits EventEmitter:

```javascript
context.on("eventName", (data) => {
  console.log("Event received:", data);
});

context.emit("eventName", { key: "value" });
```

## Update Cycle

### Dirty Flagging

Nodes flag themselves dirty when they need to update:

```javascript
context.nodeIsDirty(node);
```

### Scheduling Updates

Request an update cycle:

```javascript
context.scheduleUpdate();
```

### Update Execution

The update cycle runs dirty nodes:

```javascript
context.update();
```

This:

1. Collects all dirty nodes
2. Sorts by dependency order
3. Calls `update()` on each node
4. Handles `_updateDependencies` changes
5. Iterates until no nodes are dirty (max 10 iterations)

### After Update Callbacks

Execute code after the current update cycle:

```javascript
context.scheduleAfterUpdate(() => {
  console.log("Update cycle complete");
});
```

### Next Frame Callbacks

Execute code on the next frame:

```javascript
context.scheduleNextFrame(() => {
  console.log("Next frame");
});
```

## Global State

Share data across all nodes:

```javascript
// Set global value
context.setGlobalValue("theme", "dark");

// Get global value
const theme = context.getGlobalValue("theme");
```

Global values can be:

- Simple values (strings, numbers, booleans)
- Objects
- Arrays
- Functions

## Component Management

### Root Component

Set the root component:

```javascript
context.setRootComponent(rootComponentInstance);
```

### Component Registry

Register components for reuse:

```javascript
context.registerComponentModel(componentModel);
context.deregisterComponentModel(componentModel);
```

### Component Loading

Load external component bundles:

```javascript
const bundle = await context.fetchComponentBundle("ComponentName");
```

## Time Management

Get current time:

```javascript
const now = context.getCurrentTime();
```

This returns:

- Browser: `performance.now()`
- Node.js: High-resolution time

## Variants System

The context maintains variant state:

```javascript
context.variants = new Variants();

// Set active variants
context.variants.setActiveVariants(["mobile", "dark"]);

// Check if variant is active
if (context.variants.isActive("mobile")) {
  // Mobile variant is active
}
```

## Debug Support

### Inspector Updates

Debug inspectors can monitor node state:

```javascript
context.onDebugInspectorsUpdated([{ nodeId: "node1", portName: "value" }]);
```

### Debug Mode

Check if in debug mode:

```javascript
if (context.editorConnection) {
  // Running in editor
}
```

## Platform Abstraction

Context provides platform-specific implementations:

```javascript
if (context.platform === "browser") {
  // Browser-specific code
} else if (context.platform === "nodejs") {
  // Node.js-specific code
}
```

## Reset

Reset the entire context:

```javascript
context.reset();
```

This:

- Clears all timers
- Resets global values
- Clears event listeners
- Resets component registry

## Advanced Usage

### Custom Services

Add custom services to context:

```javascript
context.myCustomService = {
  doSomething() {
    // Custom logic
  },
};

// Access from nodes
this.context.myCustomService.doSomething();
```

### Event-Driven Updates

Use events to coordinate updates:

```javascript
context.on("dataChanged", () => {
  context.scheduleUpdate();
});

// From a node
this.context.emit("dataChanged");
```

### Performance Monitoring

Track update performance:

```javascript
const startTime = context.getCurrentTime();
context.update();
const duration = context.getCurrentTime() - startTime;
console.log(`Update took ${duration}ms`);
```

## Example: Context Lifecycle

```javascript
// Create context
const context = new NodeContext({ platform: "browser" });

// Register node types
context.nodeRegister.register(MyNodeDefinition);

// Create root scope and component
const rootScope = new NodeScope(context, null);
const rootComponent = await rootScope.createNode("App", "root");
context.setRootComponent(rootComponent);

// Run update loop
function updateLoop() {
  context.update();
  context.scheduleNextFrame(updateLoop);
}
updateLoop();

// Clean up
context.reset();
```

## Example: Coordinating Updates

```javascript
// Node A sets a value
class NodeA {
  doWork() {
    this.context.setGlobalValue("sharedData", newValue);
    this.context.scheduleUpdate();
  }
}

// Node B reacts to changes
class NodeB {
  update() {
    const data = this.context.getGlobalValue("sharedData");
    this.processData(data);
  }
}
```

## Example: Async Operations

```javascript
// Schedule async work after update
context.scheduleAfterUpdate(async () => {
  const result = await fetchData();

  // Update nodes with result
  context.setGlobalValue("fetchResult", result);
  context.scheduleUpdate();
});
```

## Context Properties

### Core Properties

- `platform` - 'browser' or 'nodejs'
- `nodeRegister` - NodeRegister instance
- `timerScheduler` - TimerScheduler instance
- `variants` - Variants instance
- `editorConnection` - Editor connection (if running in editor)

### State Properties

- `_dirtyNodes` - Set of nodes needing update
- `_afterUpdateCallbacks` - Callbacks after update cycle
- `_nextFrameCallbacks` - Callbacks for next frame
- `_globalValues` - Global state storage
- `_componentModels` - Registered component models

## Best Practices

1. **Use scheduleUpdate sparingly** - Don't call on every small change
2. **Batch updates** - Use scheduleAfterUpdate for multiple changes
3. **Clean up timers** - Always clear timers in node cleanup
4. **Avoid infinite loops** - Update cycle has 10 iteration limit
5. **Use global values carefully** - Can create hidden dependencies
6. **Handle async properly** - Use scheduleAfterUpdate for async work
7. **Reset on cleanup** - Call context.reset() when done
8. **Monitor performance** - Watch for slow update cycles
