/**
 * jscodeshift transform: remove standalone console.log(...) statements
 * - Removes ExpressionStatements that are console.log calls (including optional chaining)
 * - Leaves other console methods (warn, error, info, debug) untouched
 */

module.exports = function removeConsoleLog(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const isConsoleLogCall = (node) => {
    if (!node || node.type !== 'CallExpression') return false;
    const { callee } = node;
    if (!callee) return false;
    // console.log(...)
    if (callee.type === 'MemberExpression') {
      const objectName = callee.object && callee.object.type === 'Identifier' && callee.object.name;
      const propertyName = callee.property && ((callee.property.type === 'Identifier' && callee.property.name) || (callee.property.type === 'Literal' && callee.property.value));
      if (objectName === 'console' && propertyName === 'log') return true;
    }
    // console?.log(...)
    if (callee.type === 'OptionalMemberExpression') {
      const objectName = callee.object && callee.object.type === 'Identifier' && callee.object.name;
      const propertyName = callee.property && ((callee.property.type === 'Identifier' && callee.property.name) || (callee.property.type === 'Literal' && callee.property.value));
      if (objectName === 'console' && propertyName === 'log') return true;
    }
    return false;
  };

  // Remove standalone expression statements like: console.log(...);
  root
    .find(j.ExpressionStatement)
    .filter(path => isConsoleLogCall(path.node.expression))
    .remove();

  return root.toSource({ quote: 'single' });
};


