"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://eu1.prisma.sh/r00bal-1cfa75/siccccccccck-fits/dev/backend/dev`
});
exports.prisma = new exports.Prisma();
var models = [
  {
    name: "User",
    embedded: false
  }
];
