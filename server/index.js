const Koa = require('koa');
const app = new Koa();

const koaStatic = require('koa-static'); // static
app.use(koaStatic(__dirname + '/../static'))
app.use(koaStatic(__dirname + '/../doc'))
// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});

app.listen(3100);
