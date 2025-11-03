# Data Flow

This document explains how data flows through the OpenNoodl system, from user interactions to UI updates.

## Overview

Noodl uses a **reactive data flow** model where changes automatically propagate through connected nodes, similar to spreadsheet formulas or reactive programming frameworks.

## Signal Propagation

### Basic Flow

```
Input Change → Node Evaluation → Output Update → Connected Nodes
```

### Example Flow

```
Text Input → String Node → Text Display
    ↓            ↓           ↓
 "hello"    toUpperCase   "HELLO"
```

## Evaluation System

### Lazy Evaluation

- Nodes only execute when their inputs change
- Outputs are cached until inputs change
- Prevents unnecessary computations

### Dependency Tracking

```javascript
// When NodeA.output connects to NodeB.input
NodeA.addDependent(NodeB);
NodeB.addDependency(NodeA);

// When NodeA.output changes
NodeA.notifyDependents(); // Triggers NodeB.evaluate()
```

### Evaluation Order

1. **Topological Sort**: Determine execution order
2. **Batch Updates**: Group related changes
3. **Execute Nodes**: Run in dependency order
4. **Update UI**: Render changes to screen

## Event System

### Event Types

- **User Events**: Click, hover, input, etc.
- **System Events**: Load, resize, timer, etc.
- **Custom Events**: Application-specific signals

### Event Handling

```
Event Source → Event Node → Signal Output → Action Nodes
```

## Data Transformation Pipeline

### Input Processing

1. **Validation**: Check input types and constraints
2. **Transformation**: Convert data formats if needed
3. **Caching**: Store processed values

### Node Execution

1. **Gather Inputs**: Collect all input values
2. **Execute Logic**: Run node-specific functionality
3. **Generate Outputs**: Produce result values
4. **Emit Signals**: Trigger connected events

### Output Distribution

1. **Update Connections**: Send values to connected inputs
2. **Trigger Dependents**: Notify dependent nodes
3. **Schedule UI Updates**: Queue rendering changes

## State Synchronization

### Local State Flow

```
Node Internal State ← → Node Outputs → Connected Inputs
```

### Global State Flow

```
Global State Store ← → State Nodes ← → Application Nodes
```

### External Data Flow

```
API/Database ← → Data Nodes ← → Application Logic
```

## Performance Optimizations

### Change Detection

- **Reference Equality**: Fast comparison for objects
- **Deep Comparison**: Thorough check when needed
- **Dirty Flagging**: Mark changed nodes for re-evaluation

### Batching

- **Synchronous Updates**: Group immediate changes
- **Asynchronous Updates**: Defer expensive operations
- **Frame Scheduling**: Align with browser rendering

### Memoization

```javascript
class OptimizedNode {
  evaluate() {
    const inputHash = this.getInputHash();
    if (inputHash === this.lastInputHash) {
      return this.cachedOutput; // Skip computation
    }

    this.cachedOutput = this.compute();
    this.lastInputHash = inputHash;
    return this.cachedOutput;
  }
}
```

## Debugging Data Flow

### Flow Visualization

- Visual indicators show active connections
- Animation highlights data propagation
- Debugging panels show current values

### Performance Monitoring

- Execution time tracking
- Update frequency analysis
- Memory usage monitoring

### Common Issues

- **Circular Dependencies**: Detect and prevent infinite loops
- **Performance Bottlenecks**: Identify slow nodes
- **Memory Leaks**: Track unreleased references
