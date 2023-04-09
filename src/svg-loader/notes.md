# svg 图片处理

webpack 中我们通过 url-loader or asset/inline 将小图片资源编码成 data url 内联方式到 img 标签中，但是 svg 的相关资源 不会通过编码方式处理。
这是因为
