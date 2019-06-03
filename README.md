# deploy
> pm2自动部署项目

## 部署命令
```
npm run deploy
```

### 功能
> 1. 查询服务器端口号占用情况
> 2. 在测试环境发布和取消发布项目
> 3. 修改项目pm2配置文件
> 4. 部署项目特定的版本
> 5. 查看当前部署的版本信息

### 说明
> 1. 所有项目部署在机器的project-list目录下 
> 2. 在发布到测试环境前请先使用端口查询功能查看下要使用的端口是否有被占用
> 3. 每次push tag都会将该tag部署到机器上，tag格式建议写成v1.2.3这种风格

### pm2 部署命令说明
```
// ${tag} 表示要部署的tag, tags/${tag} 表示服务器上部署的名称, 这两个参数为必填项否则无法切换tag
pm2 deploy ecosystem.config.js production ref ${tag} tags/${tag} --force
```

