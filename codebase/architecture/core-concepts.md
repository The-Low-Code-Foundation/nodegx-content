# Core Concepts

Understanding these fundamental concepts is essential for working with the OpenNoodl codebase.

## Nodes

**Nodes** are the basic building blocks of Noodl applications. They represent discrete units of functionality that can be connected together to create complex behaviors.

### Node Characteristics

- **Inputs**: Data or signals flowing into the node
- **Outputs**: Data or signals flowing out of the node
- **Parameters**: Configuration settings for the node
- **State**: Internal data maintained by the node

## Connections

**Connections** link outputs from one node to inputs of another, creating a flow of data and control through the application.

### Connection Types

- **Data Connections**: Transfer values between nodes
- **Signal Connections**: Trigger actions and events
- **Property Connections**: Bind UI properties to data

## Signals

**Signals** are events that trigger actions in the node graph. They represent moments in time when something happens.

### Signal Flow

```
User Click → Button Node → Logic Node → UI Update
```

## Components

**Components** are reusable collections of nodes that can be instantiated multiple times with different parameters.

### Component Benefits

- Encapsulation of functionality
- Reusability across projects
- Simplified node graphs
- Better organization

## Data Flow

Data in Noodl follows a **reactive** pattern where changes automatically propagate through connected nodes.

### Evaluation Order

1. Input changes trigger node re-evaluation
2. Node processes inputs and updates outputs
3. Connected nodes receive new values
4. Process continues through the graph

## State Management

### Local State

- Maintained within individual nodes
- Persists during the node's lifecycle
- Not shared between node instances

### Global State

- Shared across the entire application
- Accessible from any node
- Managed through special state nodes

## Runtime Environment

### Execution Context

- JavaScript engine for custom code
- Sandboxed environment for security
- Access to browser APIs and Noodl runtime

### Performance Model

- Lazy evaluation (only compute when needed)
- Efficient diff algorithms
- Optimized rendering pipeline
