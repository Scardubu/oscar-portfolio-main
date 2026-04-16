module.exports = {
  meta: { type: 'problem' },

  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.name === 'className') {
          const value = node.value?.value || '';

          // ❌ Block arbitrary spacing
          if (/\[(.*?)\]/.test(value)) {
            context.report({
              node,
              message: 'Arbitrary Tailwind values forbidden.',
            });
          }

          // ❌ Enforce max-width tokens
          if (value.includes('max-w-') && !value.match(/max-w-(hero|heading|prose)/)) {
            context.report({
              node,
              message: 'Use design system max-width tokens only.',
            });
          }
        }
      },
    };
  },
};
