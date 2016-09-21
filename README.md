# fresh.js

## Intro

```
上下滑动插件1.0,支持上下滑动,顶部向下滑动刷新,底部向上滑动加载
```

## Example

**Visit the [demo page](http://s.codepen.io/N-feng/debug/bwBYrp/)**

## Options

```js
/**
 * swipe 
 * @param {[Boolean]} 			top					顶部向下拉刷新,默认开启,false关闭
 * @param {[Boolean]} 			bottom 				底部向上拉加载,默认开启,false关闭
 * @param {[String]} 			url 				ajax地址,默认false,传地址即可加载ajax
 * @param {[Object]} 			ajaxSetup 			ajax参数,默认null,可传字段进行ajax跟后台交互
 * @param {[String]} 			html 				静态dom,默认false,支持加载静态dom
 */
```

## Attention

```
依赖body原生式的滚动条,只要body设置height:100%;overflow:auto;就会出现卡顿现象,目前还没好的解决方案
```

## Future

```
1、考虑要不要加入回调函数
```