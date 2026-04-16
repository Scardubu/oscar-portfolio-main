module.exports = {
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.name === 'initial' || node.name.name === 'animate') {
          context.report({
            node,
            message: 'Use shared motion variants only.',
          });
        }
      },
    };
  },
};
