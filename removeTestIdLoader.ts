import { parse } from '@babel/parser';
import generate from "@babel/generator";
import traverse from '@babel/traverse';
import { LoaderContext } from 'webpack';

export default function removeTestIdLoader(this: LoaderContext<any>, source) {
  const options = this.getOptions();
  const ast = parse(source, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'typescript'
    ]
  });
  traverse(ast, {
    JSXAttribute(path) {
      if (path.node?.name?.name === 'data-testid') {
        path.remove();
      }
    }
  })
  const hydratedCode = generate(ast, {}, source);
  return hydratedCode.code;
};