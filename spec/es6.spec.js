import { expect } from "chai";

const transform = (str) => {
  return require("babel").transform(str, {
    plugins: [require("../es6/modules"), require("../es6/arrow-functions")],
    blacklist: ["es6.modules", "es6.arrowFunctions"],
  }).code.replace("\"use strict\";\n\n", "")
}

describe('CommonJS -> ES6 imports', () => {
  it('converts a standard statement', () => {
    const code = 'var React = require("react");';
    expect(transform(code)).to.equal('import React from "react";');
  });

  it('converts an assignment', () => {
    const code = 'React = require("react");';
    expect(transform(code)).to.equal('import React from "react";');
  })

  it('converts a require without assignment', () => {
    const code = 'require("react");';
    expect(transform(code)).to.equal('import "react";');
  })
});

describe('Arrow functions', () => {
  it('converts FunctionExpression to arrow', () => {
    const code = '(function() {})';
    expect(transform(code)).to.equal('() => {};');
  });

  it('with parameters', () => {
    const code = '(function(a, b) {})';
    expect(transform(code)).to.equal('(a, b) => {};');
  });

  it('with return', () => {
    const code = '(function(a, b) { return a + b; })';
    expect(transform(code)).to.equal(`(a, b) => {\n  return a + b;\n};`);
  });

  it('bails out when `this` is used', () => {
    const code = '(function() { this.a })';
    expect(transform(code)).to.equal(code);
  })
});
