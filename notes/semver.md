#

pnpm npm 使用 semver 规范作为依赖的版本管理芳芳
semver semantic versioning 翻译过来就是语义化版本规范
semver 版本格式一般分为 major.minor.patch 三位
这三位的意义话解释
major: 重大的不向后兼容的 api 修改
minor: 向后兼容的的功能添加
patch: 向后兼容的 api 修复

我们开发的时候不会不会直接修改这些版本，一般都是发布先行版本
比如我们要开发 1.0.0
开发的时候一般都是 迭代 先行版本
开发 A 添加这个版本某个功能
发布 1.0.0-alpha.0 版本
B
发布 1.0.0-alpha.1 版本
...
开发完成
|

发布测试环境

发布 1.0.0-beta.0 版本
...
测试阶段结束

进入 A 环境 或者叫预发布环境吧

1.0.0-rc.0

预发布结束
可以上线了
发布正式版本
1.0.0

pnpm 也提供了命令帮我们迭代迭代版本

pnpm version major 主版本 +1
pnpm version minor 次版本 +1
pnpm version patch 修订版本 + 1

开发人员用的先行版本
pnpm version prerelease --preid=alpha 开发阶段
pnpm version prerelease --preid=beta 测试阶段
pnpm version prerelalse --preid=rc 预发布阶段
