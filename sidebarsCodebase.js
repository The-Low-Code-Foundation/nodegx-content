module.exports = {
  codebaseSidebar: [
    'overview',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'development-setup',
        'contributing',
        'build-test',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/core-concepts',
        'architecture/data-flow',
      ],
    },
    {
      type: 'category',
      label: 'Codebase Structure',
      items: [
        'structure/folders',
      ],
    },
    {
      type: 'category',
      label: 'Nodes',
      items: [
        'nodes/overview',
        'nodes/definition',
        'nodes/instance',
        'nodes/scope',
        'nodes/context',
        'nodes/dynamic-ports',
        'nodes/frontend-nodes',
        'nodes/visual-states',
      ],
    },
    {
      type: 'category',
      label: 'Development Guides',
      items: [
        'guides/adding-nodes',
      ],
    },
  ],
};
