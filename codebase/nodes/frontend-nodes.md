---
id: frontend-nodes
title: Frontend Nodes
---

# Frontend Nodes

Frontend nodes are visual UI components built with React that extend the base node system with rendering capabilities. They are defined in `noodl-viewer-react` and handle DOM elements, styling, and user interactions.

## Purpose

- Render visual UI components
- Handle DOM manipulation and styling
- Support React component integration
- Provide visual hierarchy and layout
- Enable user interactions and events

## Frontend vs Runtime Nodes

### Runtime Nodes

- Located in `packages/noodl-runtime/src/nodes`
- Pure logic and data processing
- No visual representation
- Defined with `defineNode()`
- Examples: Counter, Expression, REST

### Frontend Nodes

- Located in `packages/noodl-viewer-react/src/nodes`
- Visual UI components
- React-based rendering
- Defined with `createNodeFromReactComponent()`
- Examples: Group, Text, Button, Image

## Creating a Frontend Node

Frontend nodes are created using `createNodeFromReactComponent()` which wraps a React component with Noodl node capabilities.

### Basic Structure

```javascript
import { createNodeFromReactComponent } from "@noodl/react-component-node";

const MyVisualNode = createNodeFromReactComponent({
  name: "My.Visual.Node",
  displayName: "My Visual Node",
  category: "Visual",

  getReactComponent() {
    // Return the React component to render
    return "div"; // or a custom React component
  },

  inputProps: {
    // Props passed to React component
  },

  inputCss: {
    // CSS styles applied to component
  },

  outputProps: {
    // Outputs triggered by React props
  },
});

export default MyVisualNode;
```

## Node Definition Structure

### Core Properties

```javascript
{
  name: 'My.Visual.Node',
  displayName: 'My Visual Node',
  displayNodeName: 'Visual Node', // Alternative display name
  category: 'Visual',
  docs: 'https://docs.noodl.net/nodes/my-visual-node',

  // Visual frame configuration
  frame: {
    dimensions: true,      // Width/Height inputs
    position: true,        // Position/Transform inputs
    margins: true,         // Margin inputs
    padding: true,         // Padding inputs
    align: true           // Alignment inputs
  },

  // Visual features
  allowChildren: true,              // Can have child nodes
  allowAsExportRoot: true,          // Can be root of exported component
  visualStates: ['hover', 'pressed'], // Supported visual states
  useVariants: true,                // Support variants

  // React integration
  noodlNodeAsProp: false,          // Pass node instance to React component
  mountedInput: true,              // Include 'Mounted' input

  getReactComponent() {
    return MyReactComponent; // or 'div', 'span', etc.
  }
}
```

## Input Types

### Input Props

Props passed directly to the React component:

```javascript
inputProps: {
  text: {
    type: 'string',
    displayName: 'Text',
    group: 'General',
    default: 'Hello',
    set(value) {
      // Optional: custom setter
      this.props.text = value;
      this.forceUpdate();
    }
  },

  enabled: {
    type: 'boolean',
    default: true,
    // Prop path for nested props
    propPath: 'config'  // Sets this.props.config.enabled
  },

  // Node reference
  targetNode: {
    type: 'node',
    set(node) {
      this.props.target = node;
      this.forceUpdate();
    }
  }
}
```

### Input CSS

CSS styles applied to the component:

```javascript
inputCss: {
  backgroundColor: {
    type: 'color',
    displayName: 'Background Color',
    group: 'Style',
    default: '#ffffff',
    // Maps to CSS property (defaults to input name)
    targetStyleProperty: 'backgroundColor'
  },

  fontSize: {
    type: {
      name: 'number',
      units: ['px', 'em', 'rem'],
      defaultUnit: 'px'
    },
    default: 16
  },

  borderRadius: {
    type: 'number',
    default: 0,
    // Apply to specific styled element
    styleTag: 'container'
  }
}
```

### Default CSS

Set default CSS styles:

```javascript
defaultCss: {
  display: 'flex',
  flexDirection: 'column',
  position: 'relative'
}
```

## Output Types

### Output Props

Outputs triggered by React component callbacks:

```javascript
outputProps: {
  // Signal output from callback
  onClick: {
    type: 'signal',
    displayName: 'Click',
    group: 'Events'
  },

  // Value output from callback
  value: {
    type: 'string',
    displayName: 'Value',
    getValue(event) {
      // Extract value from event
      return event.target.value;
    },
    onChange(value) {
      // Called when output changes
      console.log('Value changed:', value);
    }
  },

  // Multiple props with same callback
  onMouseEvents: {
    type: 'signal',
    props: ['onMouseEnter', 'onMouseLeave'],
    propPath: 'events'
  }
}
```

## Visual Frame

The `frame` property automatically adds standard visual inputs:

```javascript
frame: {
  // Adds Width, Height, Size Mode inputs
  dimensions: true,

  // Adds custom dimension defaults
  dimensions: {
    defaultSizeMode: 'contentSize',
    defaultWidth: 100,
    defaultHeight: 100
  },

  // Adds Position, Rotation, Scale, etc.
  position: true,

  // Adds Margin inputs
  margins: true,

  // Adds Padding inputs
  padding: true,

  // Adds Align inputs
  align: true
}
```

## React Component Integration

### Simple HTML Element

```javascript
getReactComponent() {
  return 'div'; // Renders <div />
}
```

### Custom React Component

```javascript
getReactComponent() {
  class MyComponent extends React.Component {
    componentDidMount() {
      // React lifecycle - runs when component mounts
      console.log('Component mounted');
    }

    componentWillUnmount() {
      // React lifecycle - runs when component unmounts
      console.log('Component unmounting');
    }

    render() {
      const { text, enabled } = this.props;
      return (
        <div className="my-component">
          <span>{text}</span>
        </div>
      );
    }
  }
  return MyComponent;
}
```

### Functional Component

```javascript
getReactComponent() {
  return function MyComponent(props) {
    // Use React hooks for lifecycle
    React.useEffect(() => {
      // Runs after mount and updates
      console.log('Component mounted or updated');

      return () => {
        // Cleanup - runs before unmount
        console.log('Component unmounting');
      };
    }, []); // Empty deps = mount/unmount only

    return (
      <div style={props.style}>
        {props.children}
      </div>
    );
  };
}
```

## Node Instance Methods

Frontend nodes have additional methods for DOM and styling:

### Styling

```javascript
methods: {
  customMethod() {
    // Set styles directly on DOM element
    this.setStyle({
      backgroundColor: '#ff0000',
      color: '#ffffff'
    });

    // Set styles on specific element (by styleTag)
    this.setStyle({
      borderColor: '#000000'
    }, 'container');

    // Remove styles
    this.removeStyle(['backgroundColor', 'color']);

    // Get current style value
    const bgColor = this.getStyle('backgroundColor');
  }
}
```

### Force Update

```javascript
methods: {
  updateUI() {
    // Force React re-render
    this.forceUpdate();
  }
}
```

### DOM Access

```javascript
methods: {
  accessDOM() {
    // Get React component ref
    const ref = this.getRef();

    // Get DOM element
    const element = this.getDOMElement();

    // Access inner React component
    const innerRef = this.innerReactComponentRef;
  }
}
```

## Children Management

Frontend nodes can have visual children:

```javascript
{
  allowChildren: true,

  methods: {
    handleChildren() {
      // Get all children
      const children = this.getChildren();

      // Add child at specific index
      this.addChild(childNode, 0);

      // Remove child
      this.removeChild(childNode);

      // Check if contains node
      const contains = this.contains(someNode);

      // Get child count
      const count = this.childrenCount;
    }
  }
}
```

## Visual States

Visual states allow different styling based on interaction:

```javascript
{
  visualStates: ['hover', 'pressed', 'focused', 'disabled'],

  inputCss: {
    backgroundColor: {
      type: 'color',
      default: '#ffffff',
      allowVisualStates: true  // Can have different values per state
    }
  },

  methods: {
    handleInteraction() {
      // Set current visual states
      this.setVisualStates(['hover', 'pressed']);

      // Get current states
      const states = this._getVisualStates();
    }
  }
}
```

## Lifecycle Hooks

Node-level lifecycle hooks (not React component lifecycle):

```javascript
{
  initialize() {
    // Called when node instance is created
    this._internal.customData = {};
  },

  nodeScopeDidInitialize() {
    // Called after all nodes in component are created
    this.setupConnections();
  },

  _onNodeDeleted() {
    // Called when node is being deleted
    // Clean up resources here
    if (this._internal.timerId) {
      clearInterval(this._internal.timerId);
    }
  }
}
```

For React lifecycle methods, use them inside your React component:

```javascript
{
  getReactComponent() {
    return function MyComponent(props) {
      React.useEffect(() => {
        // Mount logic
        return () => {
          // Unmount logic
        };
      }, []);

      return <div>{props.children}</div>;
    };
  }
}
```

## Complete Example: Custom Button

```javascript
import { createNodeFromReactComponent } from "@noodl/react-component-node";

const CustomButton = createNodeFromReactComponent({
  name: "Custom.Button",
  displayName: "Custom Button",
  category: "Visual",
  docs: "https://docs.noodl.net/nodes/custom-button",

  frame: {
    dimensions: {
      defaultSizeMode: "contentSize",
    },
    position: true,
    margins: true,
    padding: true,
  },

  visualStates: ["hover", "pressed", "disabled"],
  useVariants: true,

  getReactComponent() {
    return "button";
  },

  defaultCss: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "none",
    outline: "none",
  },

  inputProps: {
    label: {
      type: "string",
      displayName: "Label",
      group: "General",
      default: "Button",
      set(value) {
        this.props.children = value;
        this.forceUpdate();
      },
    },

    enabled: {
      type: "boolean",
      displayName: "Enabled",
      group: "General",
      default: true,
      set(value) {
        this.props.disabled = !value;
        this.setVisualStates(value ? [] : ["disabled"]);
        this.forceUpdate();
      },
    },
  },

  inputCss: {
    backgroundColor: {
      type: "color",
      displayName: "Background Color",
      group: "Style",
      default: "#007bff",
      allowVisualStates: true,
    },

    textColor: {
      type: "color",
      displayName: "Text Color",
      group: "Style",
      default: "#ffffff",
      targetStyleProperty: "color",
      allowVisualStates: true,
    },

    fontSize: {
      type: {
        name: "number",
        units: ["px", "em", "rem"],
        defaultUnit: "px",
      },
      displayName: "Font Size",
      group: "Style",
      default: 16,
    },

    borderRadius: {
      type: "number",
      displayName: "Border Radius",
      group: "Style",
      default: 4,
    },
  },

  outputProps: {
    onClick: {
      type: "signal",
      displayName: "Click",
      group: "Events",
    },
  },

  initialize() {
    this._internal.clickCount = 0;

    // Add mouse event handlers
    const addHandlers = () => {
      const element = this.getDOMElement();
      if (!element) return;

      element.addEventListener("mouseenter", () => {
        if (this.getInputValue("enabled")) {
          const states = this._getVisualStates();
          if (!states.includes("hover")) {
            this.setVisualStates([...states, "hover"]);
          }
        }
      });

      element.addEventListener("mouseleave", () => {
        const states = this._getVisualStates().filter(
          (s) => s !== "hover" && s !== "pressed"
        );
        this.setVisualStates(states);
      });

      element.addEventListener("mousedown", () => {
        if (this.getInputValue("enabled")) {
          const states = this._getVisualStates();
          if (!states.includes("pressed")) {
            this.setVisualStates([...states, "pressed"]);
          }
        }
      });

      element.addEventListener("mouseup", () => {
        const states = this._getVisualStates().filter((s) => s !== "pressed");
        this.setVisualStates(states);
      });
    };

    this.scheduleAfterInputsHaveUpdated(addHandlers);
  },

  _onNodeDeleted() {
    // Clean up event listeners
    const element = this.getDOMElement();
    if (element) {
      // Remove all listeners
      const newElement = element.cloneNode(true);
      element.parentNode.replaceChild(newElement, element);
    }
  },

  methods: {
    getClickCount() {
      return this._internal.clickCount;
    },
  },
});

export default CustomButton;
```

## Style Tags

Apply styles to specific nested elements:

```javascript
{
  getReactComponent() {
    return function MyComponent(props) {
      return (
        <div style={props.style}>
          <div noodl-style-tag="header" style={props.styles.header}>
            Header
          </div>
          <div noodl-style-tag="content" style={props.styles.content}>
            {props.children}
          </div>
        </div>
      );
    };
  },

  inputCss: {
    headerBackground: {
      type: 'color',
      styleTag: 'header',
      targetStyleProperty: 'backgroundColor'
    },

    contentPadding: {
      type: 'number',
      styleTag: 'content',
      targetStyleProperty: 'padding'
    }
  }
}
```

## Advanced CSS

Users can write custom CSS:

```javascript
// Automatically added to all frontend nodes
inputs: {
  cssClassName: {
    type: 'string',
    displayName: 'CSS Class',
    group: 'Advanced HTML'
  },

  styleCss: {
    type: {
      name: 'string',
      codeeditor: 'text',
      allowEditOnly: true
    },
    displayName: 'CSS Style',
    group: 'Advanced HTML',
    default: '/* background-color: red; */'
  }
}
```

## Dynamic Ports

Frontend nodes can have dynamic ports:

```javascript
{
  dynamicports: [
    {
      name: "conditionalports/basic",
      condition: "showAdvanced",
      inputs: ["advancedOption1", "advancedOption2"],
    },
  ];
}
```

## Registration

Register the node with Noodl runtime:

```javascript
// In register-nodes.js
import CustomButton from "./nodes/custom-button";

export default function registerNodes(noodlRuntime) {
  noodlRuntime.registerNode(CustomButton);
}
```

## Best Practices

1. **Use frame for standard visuals** - Enable frame features for layout support
2. **Separate logic and styling** - Use inputProps for behavior, inputCss for styling
3. **Handle visual states** - Add appropriate mouse/focus event handlers
4. **Clean up event listeners** - Remove listeners in `_onNodeDeleted`
5. **Use forceUpdate sparingly** - Only when React needs to re-render
6. **Test visual states** - Verify hover, pressed, disabled states work correctly
7. **Support variants** - Enable useVariants for responsive design
8. **Document styling** - Explain how CSS customization works
9. **Optimize re-renders** - Cache computed values when possible
10. **Handle children properly** - Update child indices when children change
11. **Use React lifecycle inside component** - Don't confuse node and React lifecycles

## Common Patterns

### Conditional Rendering

```javascript
getReactComponent() {
  return function MyComponent(props) {
    if (!props.visible) return null;

    return <div style={props.style}>{props.children}</div>;
  };
}
```

### Event Handler Props

```javascript
outputProps: {
  onChange: {
    type: 'string',
    getValue(event) {
      return event.target.value;
    }
  },

  onFocus: {
    type: 'signal'
  },

  onBlur: {
    type: 'signal'
  }
}
```

### Custom React Hooks

```javascript
getReactComponent() {
  return function MyComponent(props) {
    const [state, setState] = React.useState(props.initialValue);

    React.useEffect(() => {
      // Side effect on mount or when dependency changes
      console.log('Effect running');

      return () => {
        // Cleanup
        console.log('Cleanup');
      };
    }, [props.dependency]);

    return <div>{state}</div>;
  };
}
```

## Debugging

```javascript
{
  getInspectInfo() {
    // Return debug info shown in editor
    return {
      props: this.props,
      style: this.style,
      children: this.children.length
    };
  }
}
```

## See Also

- [Node Definition](definition.md) - Base node definition
- [Visual States](visual-states.md) - Visual state system
- [Variants](variants.md) - Variant system
- [Dynamic Ports](dynamic-ports.md) - Dynamic port system
