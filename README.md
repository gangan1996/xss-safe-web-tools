# xss-safe-web-tools
A tool for handling XSS injection security issues

# install
```
npm i xss-safe-web-tools
```

# Usages
导入
```
import { filterXSS } from 'xss-safe-web-tools'
```
支持白名单class
```
filterXSS(html, { whiteClasses: [className] })
```
只支持特定标签（与默认白名单需要同时满足的关系）
```
filterXSS(html, {
    selfWhiteList: { a: ['href'], br: [], div: ['class'] }
  })
```
修改默认白名单
```
filterXSS(html, {
    whiteList: { a: ['href'], br: [], div: ['class'] }
  })
```
修改默认白名单
```
filterXSS(html, {
    whiteList: { a: ['href'], br: [], div: ['class'] }
  })
```
修改默认属性白名单
```
filterXSS(html, {
    whiteAttrList: ['style', 'class', 'id', 'data-*']
  })
```
支持传入url验证方法
```
filterXSS(html, { urlCheckFunc: urlCheckFunc })
```
