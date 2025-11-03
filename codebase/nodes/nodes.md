# Nodes — structure & patterns

This page describes the typical structure of a Noodl "node" file, what sections you can implement, and common conventions used in the runtime package (see a:\Repos\OpenNoodl\packages\noodl-runtime\src\nodes).

## Purpose

A node file exports the definition/implementation of a runtime node. A node defines inputs, outputs, settings, behavior on input changes, and lifecycle hooks. Nodes live under packages/noodl-runtime/src/nodes (and subfolders like std-library, data, user, variables).

## Typical sections

- Module export
  - The file exports a single object (or a registration call) describing the node.
- Metadata
  - id/name, label, category, description — used by editors and docs.
- Inputs / outputs definitions
  - Typed ports exposed to other nodes (name, type, default).
- Settings / properties
  - Configurable options persisted with the component instance.
- Lifecycle hooks
  - init / onAttach / onDetach — run when the node/component is created/connected/disposed.
- Runtime handlers
  - onInput or handlers for specific inputs to implement behavior.
- State & storage
  - Per-instance state that persists for the life of the component instance.
- Event / task scheduling
  - Emit events, schedule async tasks, timers, or call runtime APIs.

## Conventions and examples

A minimal JS skeleton (illustrative only):

```javascript
// minimal node skeleton
module.exports = {
  id: "my.example.node",
  label: "Example Node",
  category: "logic",
  inputs: {
    inputA: { type: "boolean", default: false },
    value: { type: "number" },
  },
  outputs: {
    outValue: { type: "number" },
  },
  settings: {
    multiplier: { type: "number", default: 1 },
  },
  init(instance) {
    // called once when node instance is created
    instance.state = { count: 0 };
  },
  onInput(instance, inputName, value) {
    // handle incoming values
    if (inputName === "value") {
      const result = value * (instance.settings.multiplier || 1);
      instance.setOutput("outValue", result);
    }
  },
  onAttach(instance) {
    // optional: when node becomes active/connected in graph
  },
  onDetach(instance) {
    // cleanup timers/async tasks
  },
};
```

Notes:

- instance provides helpers: read settings, set outputs, schedule tasks, subscribe/unsubscribe, access persistent component state.
- Use init to allocate resources and onDetach to clean them up to avoid leaks.
- Use descriptive ids and categories to keep the runtime organized (see std-library and data folders for examples).

## Advanced patterns

- Async operations: perform fetches or DB actions in handlers, update outputs when promises resolve.
- Composite components: nodes can coordinate child components via runtime APIs.
- Reusable utilities: factor repeated logic into helper modules (see std-library and variables folders).

## Testing & debugging

- Add console logs in lifecycle hooks and handlers.
- Unit test node logic by calling exported handlers with a mock instance (mock instance should implement setOutput, settings, state).
- Watch for mismatched input/output names and types — runtime will error if the sidebar/doc references non-existent ids.

## Common pitfalls

- Forgetting to clean timers/subscriptions in onDetach.
- Using globals for per-instance state (use instance.state).
- Using a documentation/sidebars id that doesn't match actual doc filenames (see your earlier sidebar error).
