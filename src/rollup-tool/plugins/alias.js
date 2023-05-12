function getHookFunction(hook) {
  if (typeof hook === 'function') {
    return hook;
  }
  if (hook && 'handler' in hook && typeof hook.handler === 'function') {
    return hook.handler;
  }
  return null;
}

function resolveCustomResolver(customResolver) {
  if (typeof customResolver === 'function') {
    return customResolver;
  }
  if (customResolver) {
    return getHookFunction(customResolver.resolveId);
  }
  return null;
}

function getEntries({ entries, customResolver }) {
  if (!entries) {
    return [];
  }

  const resolverFunctionFromOptions = resolveCustomResolver(customResolver);

  if (Array.isArray(entries)) {
    return entries.map((entry) => {
      return {
        find: entry.find,
        replacement: entry.replacement,
        resolverFunction:
          resolveCustomResolver(entry.customResolver) ||
          resolverFunctionFromOptions,
      };
    });
  }

  return Object.entries(entries).map(([key, value]) => {
    return {
      find: key,
      replacement: value,
      resolverFunction: resolverFunctionFromOptions,
    };
  });
}

function matches(pattern, importee) {
  if (pattern instanceof RegExp) {
    return pattern.test(importee);
  }
  if (importee.length < pattern.length) {
    return false;
  }
  if (importee === pattern) {
    return true;
  }
  // eslint-disable-next-line prefer-template
  return importee.startsWith(pattern + '/');
}

/**
 * @param {{find:string | RegExp;replacement:string}[]} options
 * @returns {import('rollup').Plugin}
 */
function alias(options) {
  const entries = getEntries(options);
  return {
    name: 'alias',
    resolveId(source, importer, resolveOptions) {
      // console.log(source, importer, resolveOptions);
      const matchedEntry = entries.find((entry) => matches(entry.find, source));
      if (!matchedEntry) return null;
      const updatedId = source.replace(
        matchedEntry.find,
        matchedEntry.replacement
      );

      return this.resolve(
        updatedId,
        importer,
        Object.assign({ skipSelf: true }, resolveOptions)
      ).then((resolved) => resolved || { id: updatedId });
    },
    // async buildStart(inputOptions) {
    //   await Promise.all(
    //     [
    //       ...(Array.isArray(options.entries) ? options.entries : []),
    //       options,
    //     ].map(
    //       ({ customResolver }) =>
    //         customResolver &&
    //         getHookFunction(customResolver.buildStart)?.call(this, inputOptions)
    //     )
    //   );
    // },
  };
}

module.exports = alias;
