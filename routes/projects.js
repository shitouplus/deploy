const express = require('express')
const path = require('path')
const fs = require('fs')

const router = express.Router()
const ecosystem = {
  name: '',
  script: 'app.js',
  instances: 1,
  autorestart: true,
  watch: false,
  max_memory_restart: '1G',
  env: {
    NODE_ENV: 'development'
  },
  env_production: {
    NODE_ENV: 'production'
  },
  repository: '',
  readme: ''
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
router.post('/', function(req, res) {
  const projectList = require('../ecosystem.config')
  const project = Object.assign({}, ecosystem, req.body)

  projectList.apps.push(project)

  const EcosystemConfig = `module.exports = ${JSON.stringify(projectList, null, 2)}`

  fs.writeFile(path.resolve('ecosystem.config.js'), EcosystemConfig, err => {
    const response = {
      success: !err,
      message: err ? err.message : '成功'
    }

    res.send(response);
  })
});

module.exports = router;
