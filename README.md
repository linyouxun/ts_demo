
## 接口备注
- api对应node服务不需要登陆接口
- api2对应node服务需要登陆接口
- xcx对应小程序接口

## mongo数据库操作
1 修改
`
db.getCollection('confightmls').update({'configBase.title': '0元设计效果图'}, {$set:{"isUpdate": false}});
`
