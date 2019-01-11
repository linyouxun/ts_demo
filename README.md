
## 接口备注
- api对应node服务不需要登陆接口
- api2对应node服务需要登陆接口
- xcx对应小程序接口

## mongo数据库操作
1 修改
`
db.getCollection('confightmls').update({'configBase.title': '0元设计效果图'}, {$set:{"isUpdate": false}});
`


## jenkins构建代码
```sh
cd /data/youju_admin
startTime=`date "+%Y-%m-%d %H:%M:%S" | date +%s`
echo "开始" >> log/make.log
echo =========================     "`date`"     ====================== >> log/make.log
echo "安装包" >> log/make.log
echo =========================     "`date`"     ====================== >> log/make.log
yarn >> log/make.log
echo "构建代码" >> log/make.log
echo =========================     "`date`"     ====================== >> log/make.log
yarn run build >> log/make.log
endTime=`date "+%Y-%m-%d %H:%M:%S" | date +%s`
echo "全部安装时间："$(($endTime-$startTime))"秒" >> log/make.log
echo "重启服务器" >> log/make.log
pm2 restart 0 >> log/make.log
```
