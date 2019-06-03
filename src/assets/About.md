### 部署文档(PS: 以项目bar为例)

#### 1. 添加webhooks
    在gitlab项目bar中依次进入settings > Integrations 在Integrations面板中
    添加类型为Tag push events的webhooks，Secret Token 可以随意配置但是切记
    **不能重复，不能重复，不能重复**，建议跟项目的名称保持一致
   
#### 2. 新建项目配置
    点击页面右上角的“+”添加项目，名称对应步骤1中的Secret Token，仓库是项目的gitlab地址，
    脚本是项目的启动文件，说明字段是备注信息，可以写markdown语法
   
#### 3. push tag
    前面两步配置完成后就已经完成了自动化部署的配置，每次push tag会重新部署
    当代码编写完成后，在需要的部署的提交打上tag然后push tag。
   
   
    此时项目部署已经完成，打开浏览器输入http://localhost:8000/即可访问
    注意端口号在项目代码中自行修改配置
   
### 说明
    1. 所有项目测试环境的部署共用同一个接口http://localhost:3000/projects/deploy，
       使用Secret Token作为区分，因此Secret Token不能重复
    2. 不要一次push多个tag，这会导致部署多次，导致不必要的部署，建议一次push一个tag，不需要部署的tag就不要push了
    

   
   
    

