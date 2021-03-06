const fs = require("fs");
const path = require("path");

const isProd = process.env.NODE_ENV === "production";
const rootPath = fs.realpathSync(process.cwd());
module.exports = {
    isProd,
    rootPath,

    devProtocol: "https",
    devHost: process.env.HOST || "localhost",
    devPort: process.env.PORT || 8080,
    buildPath: path.resolve(rootPath, "./dist"),
    examplesPath: path.resolve(rootPath, "./examples")
};
