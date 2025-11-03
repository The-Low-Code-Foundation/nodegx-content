---
id: scope
title: Node Scope
---

# Node Scope

NodeScope (`nodescope.js`) manages all node instances within a component. It handles node creation, connections, lifecycle, and the node graph structure.

## Purpose

- Creates and destroys node instances
- Manages connections between nodes
- Maintains the node graph hierarchy
- Handles node model synchronization
- Provides node lookup and queries

## Creating a NodeScope

```javascript
const NodeScope = require("./nodescope");

const scope = new NodeScope(context, componentOwner);
```

### Parameters

- `context` - NodeContext instance
- `componentOwner` - Parent component instance (if any)

## Node Creation

### Create from Model

Creates a node from editor model data:

```javascript
const nodeInstance = await scope.createNodeFromModel(nodeModel);
```

The model contains:

- `id` - Node instance ID
- `type` - Node type name
- `parameters` - Node parameters
- `ports` - Port configurations
- `variant` - Variant settings

### Create Programmatically

Create a node by type:

```javascript
const node = await scope.createNode("My.Node.Type", "uniqueId", {
  // Extra properties
});
```

### Create Primitive Node

For built-in types:

```javascript
const node = scope.createPrimitiveNode("String", "myStringId", {
  value: "Hello",
});
```

## Node Lookup

### Get by ID

```javascript
const node = scope.getNodeWithId("nodeId");

if (scope.hasNodeWithId("nodeId")) {
  // Node exists
}
```

### Get by Type

```javascript
const nodes = scope.getNodesWithType("My.Node.Type");
```

### Recursive Queries

Search this scope and all child scopes:

```javascript
// All nodes with ID (including children)
const nodes = scope.getNodesWithIdRecursive("nodeId");

// All nodes of type
const nodes = scope.getNodesWithTypeRecursive("My.Node.Type");

// All nodes
const allNodes = scope.getAllNodesRecursive();

// All nodes with specific variant
const variantNodes = scope.getAllNodesWithVariantRecursive("mobile");
```

## Managing Connections

### Add Connection

```javascript
scope.addConnection({
  fromId: "sourceNodeId",
  fromProperty: "outputName",
  targetId: "targetNodeId",
  targetProperty: "inputName",
});
```

Connection data structure:

- `fromId` - Source node ID
- `fromProperty` - Output port name
- `targetId` - Target node ID
- `targetProperty` - Input port name

### Remove Connection

```javascript
scope.removeConnection(connectionModel);
```

## Node Parameters

Apply parameters to a node:

```javascript
scope.setNodeParameters(nodeInstance, nodeModel);
```

This applies:

- Parameter values
- Port configurations
- Visual states
- Variant settings

## Node Tree Structure

### Insert in Tree

Nodes can form a hierarchy (for visual nodes):

```javascript
scope.insertNodeInTree(nodeInstance, nodeModel);
```

This sets:

- Parent/child relationships
- Sibling order
- Tree structure

### Tree Navigation

Nodes have tree properties:

- `parent` - Parent node
- `children` - Array of child nodes
- `nodeScope` - The NodeScope managing the node

## Lifecycle Management

### Node Removal

```javascript
scope.onNodeModelRemoved(nodeModel);
```

This:

1. Removes all connections to/from the node
2. Calls node's `_onNodeDeleted`
3. Removes from scope's node registry
4. Cleans up child nodes

### Scope Cleanup

When destroying a scope:

```javascript
// Remove all nodes
scope.nodes.forEach((node) => {
  if (node._onNodeDeleted) {
    node._onNodeDeleted();
  }
});
scope.nodes = [];
```

## Internal Structure

### Node Registry

```javascript
scope.nodes = []; // All node instances in this scope
```

### Connection Tracking

Connections are stored per node:

```javascript
nodeInstance._connections = {
  inputs: {
    inputName: [{ sourceNode, sourcePort }],
  },
  outputs: {
    outputName: [{ targetNode, targetPort }],
  },
};
```

## Component Integration

### Root Component

```javascript
scope.rootComponent = componentInstance;
```

### Component Owner

```javascript
scope.componentOwner = parentComponent;
```

### Child Components

Child component instances create their own NodeScopes:

```javascript
childComponent.nodeScope = new NodeScope(context, this);
```

## Update Propagation

NodeScope doesn't directly trigger updates - that's handled by NodeContext. However, it manages the node graph structure that determines update order.

## Example: Creating a Graph

```javascript
async function createSimpleGraph(scope) {
  // Create nodes
  const stringNode = scope.createPrimitiveNode("String", "str1", {
    value: "Hello",
  });

  const logNode = await scope.createNode("Debug.Log", "log1");

  // Connect them
  scope.addConnection({
    fromId: "str1",
    fromProperty: "value",
    targetId: "log1",
    targetProperty: "message",
  });

  // Find nodes
  const allNodes = scope.getAllNodesRecursive();
  console.log(`Created ${allNodes.length} nodes`);
}
```

## Example: Component Hierarchy

```javascript
// Root scope
const rootScope = new NodeScope(context, null);

// Create parent component
const parentNode = await rootScope.createNode("Component", "parent1");
const parentScope = new NodeScope(context, parentNode);

// Create child in parent's scope
const childNode = await parentScope.createNode("Visual.Text", "text1");

// Query from root
const allNodes = rootScope.getAllNodesRecursive();
// Returns nodes from root, parent, and all descendants
```

## Dynamic Node Creation

For runtime-generated nodes:

```javascript
const { defineNode } = require("./nodedefinition");

// Define dynamic node type
const DynamicNode = defineNode({
  name: "Dynamic.Node",
  // ... definition
});

// Register it
context.nodeRegister.register(DynamicNode);

// Create instance
const instance = await scope.createNode("Dynamic.Node", "dynamic1");
```

## Error Handling

```javascript
try {
  const node = await scope.createNode("Unknown.Type", "test1");
} catch (error) {
  // "Unknown node type with name Unknown.Type"
}
```

## Best Practices

1. **Use async/await** - Node creation is asynchronous
2. **Check node existence** - Use `hasNodeWithId` before operations
3. **Clean up connections** - Remove connections before deleting nodes
4. **Use recursive queries** - When searching across component boundaries
5. **Maintain tree structure** - Call `insertNodeInTree` for visual hierarchies
6. **Handle errors** - Wrap node creation in try/catch
7. **Avoid ID collisions** - Ensure unique IDs when creating nodes
8. **Respect scope boundaries** - Child scopes for child components
