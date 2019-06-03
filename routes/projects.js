const express = require('express')
const path = require('path')
const lodash = require('lodash')
const fs = require('fs')
const { exec } = require('child_process')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
const mkdirAsync = promisify(fs.mkdir)
const execAsync = promisify(exec)
const router = express.Router()
const ecosystem = {
  name: '',
  repository: '',
  readme: '',
  script: ''
}

/* GET 查询全部 */
router.get('/', function(req, res) {
  const projectList = require('../ecosystem.config')

  res.send({
    success: true,
    message: '成功',
    result: projectList.apps
  });
});

/* POST 新增  */
router.post('/', async function (req, res) {
  const projectList = require('../ecosystem.config')
  const project = Object.assign({}, ecosystem, req.body)
  const { name } = project

  projectList.apps.push(project)

  const EcosystemConfig = `module.exports = ${JSON.stringify(projectList, null, 2)}`

  const p1 = writeFileAsync(path.resolve('ecosystem.config.js'), EcosystemConfig)
  const p2 = readFileAsync(path.resolve('ecosystem.config.template.txt')).then(data => {
    data = lodash.template(data.toString())(req.body)
    return mkdirAsync(`../${name}/`).then(() => writeFileAsync(`../${name}/ecosystem.config.js`, data))
  })

  Promise.all([p1, p2])
    .then(() => {
      return execAsync('pm2 deploy production setup', { cwd: `../${name}` })
    })
    .then(() => {
      res.send({
        success: true,
        message: '新建成功'
      })
    })
    .catch(err => {
      res.send({
        success: false,
        message: err.message
      })
    })
  })

/* POST 部署 */
router.post('/deploy', async function (req, res) {
  const projectList = require('../ecosystem.config')
  const name = req.headers['x-gitlab-token']
  const project = projectList.apps.find(item => item.name === name)

  if (!project) {
    return res.send({
      success: false,
      message: '项目不存在'
    })
  }

  const tag = req.body.ref.split('/')[2]

  project.tag = tag

  const EcosystemConfig = `module.exports = ${JSON.stringify(projectList, null, 2)}`

  const p1 = writeFileAsync(path.resolve('ecosystem.config.js'), EcosystemConfig)

  const p2 = execAsync(`pm2 deploy ecosystem.config.js production ref ${tag} tags/${tag} --force`, { cwd: `../${name}` })

  Promise.all([p1, p2])
    .then(() => {
      res.send({
        success: true,
        message: '部署成功'
      })
    })
    .catch(err => {
      res.send({
        success: false,
        message: err.message
      })
    })
})

/* POST 部署特定的版本 */
router.post('/deploy/tag', function (req, res) {
  const { name, tag } = req.body
  const projectList = require('../ecosystem.config')
  const project = projectList.apps.find(item => item.name === name)

  project.tag = tag

  const EcosystemConfig = `module.exports = ${JSON.stringify(projectList, null, 2)}`

  const p1 = writeFileAsync(path.resolve('ecosystem.config.js'), EcosystemConfig)

  const p2 = execAsync(`pm2 deploy ecosystem.config.js production ref ${tag} tags/${tag} --force`, { cwd: `../${name}` })

  Promise.all([p1, p2])
    .then(() => {
      res.send({
        success: true,
        message: '部署成功'
      })
    })
    .catch(err => {
      res.send({
        success: false,
        message: err.message
      })
    })
})

/* GET 查询项目配置 */
router.get('/config', function (req, res) {
  const name = req.query.name

  readFileAsync(path.resolve(`../${name}/ecosystem.config.js`))
    .then(data => {
      res.send({
        success: true,
        message: data.toString()
      })
    })
    .catch(err => {
      res.send({
        success: false,
        message: err.message
      })
    })
})

/* POST 修改项目配置 */
router.post('/config', function (req, res) {
  const { config, name } = req.body

  writeFileAsync(path.resolve(`../${name}/ecosystem.config.js`), config)
    .then(() => {
      const projectList = require('../ecosystem.config')
      const project = projectList.apps.find(item => item.name === name)
      const tag = project.tag

      if (!tag) { return }

      return execAsync(`pm2 restart ../${name}/ecosystem.config.js --update-env`)
    })
    .then(() => {
      res.send({
        success: true,
        message: '配置项目成功'
      })
    })
    .catch(err => {
      res.send({
        success: false,
        message: err.message
      })
    })
})

/* GET 查询项目tag */
router.get('/tags', function (req, res) {
  const { repository } = req.query

  execAsync(`git ls-remote --tags ${repository}`)
    .then(data => {
      // 服务器node版本较低不支持后行断言 /(?<=refs\/tags\/)[\w.]+/g
      const tags = data.stdout.match(/(?:refs\/tags\/)[\w.]+/g).map(item => item.replace(/refs\/tags\//, ''))
      res.send({
        success: true,
        message: tags
      })
    })
    .catch(err => {
      res.send({
        success: false,
        message: err.message
      })
    })
})

/* POST 删除项目 */
router.post('/delete', function (req, res) {
  let projectList = require('../ecosystem.config')
  const name = req.body.name

  projectList.apps = projectList.apps.filter(item => item.name !== name)

  const EcosystemConfig = `module.exports = ${JSON.stringify(projectList, null, 2)}`

  const p1 = writeFileAsync(path.resolve('ecosystem.config.js'), EcosystemConfig)
  const p2 = execAsync(`pm2 delete ecosystem.config.js`, { cwd: `../${name}` })
    .then(() => {
      return execAsync(`rm -rf ../${name}`)
    })

  Promise.all([p1, p2])
    .then(() => {
      res.send({
        success: true,
        message: `已下线并删除${name}`
      })
    })
    .catch(err => {
      res.send({
        success: false,
        message: err.message
      })
    })
})

/* GET 查询端口号 */
router.get('/port', function (req, res) {
  let { port } = req.query

  execAsync(`lsof -i:${port}`)
    .then(data => {
      res.send({
        success: true,
        message: data.stdout
      })
    })
    .catch(err => {
      res.send({
        success: true,
        message: ''
      })
    })

})

module.exports = router;
