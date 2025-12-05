---
id: overview
title: Nodes System Overview
---

# Nodes System Overview

The Noodl nodes system is the foundation of the runtime. Nodes are the building blocks that users connect together to create applications. This section documents the architecture and APIs for working with nodes.

## Core Concepts

- **Node Definition**: The blueprint that describes a node's inputs, outputs, and behavior
- **Node Instance**: A runtime instance of a node created from its definition
- **Node Scope**: The container managing all node instances within a component
- **Node Register**: The registry that stores and creates node definitions
- **Node Context**: The shared runtime environment for all nodes

## Key Files

- `node.js` - Base class for all node instances
- `nodedefinition.js` - API for defining new node types
- `noderegister.js` - Registry for node definitions
- `nodescope.js` - Manages node instances within components
- `nodecontext.js` - Shared runtime context and lifecycle

## Node Lifecycle

1. **Registration** - Node definitions are registered with the NodeRegister
2. **Creation** - Node instances are created from definitions via NodeScope
3. **Connection** - Inputs and outputs are connected between nodes
4. **Execution** - Nodes update when inputs change or they're flagged dirty
5. **Deletion** - Nodes are cleaned up when removed from the graph

## Documentation Structure

- [Node Definition](definition.md) - How to define new node types
- [Node Instance](instance.md) - Runtime node instance behavior
- [Inputs & Outputs](inputoutputs.md) - Port system and data flow
- [Registration](register.md) - Node registry and lifecycle
- [Node Scope](scope.md) - Component-level node management
- [Node Context](context.md) - Runtime environment and services
- [Lifecycle Hooks](hooks.md) - Initialization and cleanup
- [Dynamic Ports](dynamic-ports.md) - Runtime port generation
- [Visual States](visual-states.md) - State-based parameter system
- [Variants](variants.md) - Node variant system
