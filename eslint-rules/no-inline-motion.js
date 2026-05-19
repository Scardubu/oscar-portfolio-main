module.exports = {
  create(context) {
    return {
      JSXAttribute(node) {
        const isMotionProp =
          node.name.name === 'initial' ||
          node.name.name === 'animate' ||
          node.name.name === 'exit' ||
          node.name.name === 'variants';

        if (!isMotionProp) return;

        // Only flag INLINE OBJECTS — { opacity: 0 } — not variant name strings ("hidden").
        // A JSXExpressionContainer wrapping an ObjectExpression is the inline-object form.
        const isInlineObject =
          node.value &&
          node.value.type === 'JSXExpressionContainer' &&
          node.value.expression.type === 'ObjectExpression';

        if (isInlineObject) {
          context.report({
            node,
            message:
              'Hoist motion variant objects to named constants outside the component. Use initial="variantName" / animate="variantName" with a shared variants prop instead.',
          });
        }
      },
    };
  },
};
