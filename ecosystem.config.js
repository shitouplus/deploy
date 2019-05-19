module.exports = {
  "apps": [
    {
      "name": "API",
      "script": "app.js",
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "env": {
        "NODE_ENV": "development"
      },
      "env_production": {
        "NODE_ENV": "production"
      },
      "title": "a",
      "repository": "https://a.git",
      "readme": ""
    },
    {
      "name": "API",
      "script": "app.js",
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "env": {
        "NODE_ENV": "development"
      },
      "env_production": {
        "NODE_ENV": "production"
      },
      "title": "a",
      "repository": "https://a.git",
      "readme": ""
    }
  ]
}