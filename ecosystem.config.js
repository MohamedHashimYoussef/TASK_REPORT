module.exports = {
  apps: [
    {
      name: `auth_ecosystem_${process.env.NODE_ENV}`,
      script: "./auth/server.js",
      watch: false,
      // out_file: "./out/out.log",
      // error_file: "./out/err.log",
      instance: 2,
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        HOST: "localhost",
      },
    },
    {
      name: `test_ecosystem_${process.env.NODE_ENV}`,
      script: "./testServer/server.js",
      watch: false,
      // out_file: "./out/out.log",
      // error_file: "./out/err.log",
      instance: 2,
      env: {
        NODE_ENV: "development",
        PORT: 3001,
        HOST: "localhost",
      },
    },
    {
      name: `monitor_ecosystem_${process.env.NODE_ENV}`,
      script: "./monitor/server.js",
      watch: false,
      // out_file: "./out/out1.log",
      // error_file: "./out/err1.log",
      env: {
        NODE_ENV: "development",
        PORT: 5000,
        HOST: "localhost",
      },
    },
  ],
};
