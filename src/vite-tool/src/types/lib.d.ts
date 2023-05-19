declare module '*.module.less' {
  const value: React<string, any>;
  export default value;
}

declare module '*.module.css' {
  const value: React<string, any>;
  export default value;
}

declare module '*.png' {
  const value: any;
  export default value;
}
declare module '*.json?inline';
declare module '*.json?raw';
declare module '*.json?url' {
  const value: string;
  export default value;
}

declare module 'virtual:my-module' {
  export const msg: string;
}
