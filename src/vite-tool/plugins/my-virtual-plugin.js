/**
 * @export
 * @return {import('vite').Plugin}
 */
export default function myVirtualPlugin() {
  const virtualModuleId = 'virtual:my-module';
  const reslovedVirtualModuleId = '\0' + virtualModuleId;
  return {
    name: 'my-virtual-plugin',
    //
    resolveId(id) {
      if (id === virtualModuleId) {
        return reslovedVirtualModuleId;
      }
    },
    load(id) {
      if (id === reslovedVirtualModuleId) {
        return `export const msg = "form virtual module"`;
      }
    },
  };
}
