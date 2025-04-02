# Elimination-of-asynchronous-infection

## 消除异步传染性原理

1. 任务中断是使用抛出错误的方式来实现的
2. 其底层原理是重写了fetch：而新fetch内部实现了一版”同步版的promise“的这种缓存机制；
   1. 当请求失败了就抛出当前fetch的promise，并将错误传递到新fetch外；
   2. 当请求成功时就将结果缓存起来，方便下一次重新调用时拿值。
3. 外部先替换全局fetch，然后使用try...catch来执行对应的函数；
4. 第一次因为是异步，所以一定会失败，从而进入catch代码块内
5. 然后就可以使用promise.finally来保证当结果获得值后，无论成功失败，都能执行finally代码块；而finall代码内则是再去调用对应的函数，拿到最终的结果值。
6. 上述逻辑执行完后，恢复环境的fetch函数。
