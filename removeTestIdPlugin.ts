import { Compiler, NormalModule } from 'webpack';

export class removeTestIdPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(removeTestIdPlugin.name, (compilation, compilationParams) => {
      console.log('This is an example plugin! tapped before compiler');
      const isWebpackV5 = compiler.webpack && compiler.webpack.version >= '5';

      if (!isWebpackV5) {
        throw new Error('only support webpack@5');
      }

      const modifiedModules: string[] = []
      NormalModule.getCompilationHooks(compilation).beforeLoaders.tap(removeTestIdPlugin.name, (_,normalModule) => {
        const { userRequest = '' } = normalModule
        // safety guard
        const startIndex =
          userRequest.lastIndexOf('!') === -1
            ? 0
            : userRequest.lastIndexOf('!') + 1;

        const moduleRequest = userRequest
          .slice(startIndex)
          .replace(/\\/g, '/');

        if (modifiedModules.includes(moduleRequest)) {
          return;
        }

        const isTsx = /\.(t|j)sx$/.test(moduleRequest);

        if (isTsx) {
          normalModule.loaders.push({
            loader: require.resolve('./removeTestIdLoader')
          } as any)
          modifiedModules.push(moduleRequest)
        }

      })
    });
  }
};