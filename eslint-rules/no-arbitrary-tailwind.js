module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow arbitrary Tailwind values',
    },
  },

  create(context) {
    return {
      Literal(node) {
        if (typeof node.value === 'string' && node.value.includes('[')) {
          context.report({
            node,
            message: 'Arbitrary Tailwind values are not allowed. Use design tokens.',
          });
        }
      },
    };
  },
};
