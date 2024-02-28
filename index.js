#!/usr/bin/env node
"use strict";

const fs = require('fs');
const shell = require('shelljs');
const path = require('path');
const logSummary = require('./buildSummary.js');
const debug = require('debug')('index');

const logList = [];
const pwd = process.cwd();

const isGitRepo = function(dir){
  const execGitRes = shell.exec(`git -C ${dir} rev-parse`,{silent:true}).stderr;
  if(execGitRes === ''){
    return true;
  }else{
    return false;
  }
}

const computePath = function(curPath){
  const dirList = fs.readdirSync(curPath);
  const pathList = [];
  for(let i=0; i<dirList.length; i++){
    if(dirList[i].indexOf('.') != 0){
      const absolutePath = path.join(curPath, dirList[i]);
      if(!fs.statSync(absolutePath).isFile()){
        pathList.push(absolutePath);
      }
    }
  }
  return pathList;
}

if(isGitRepo(pwd)){
  debug('pwd:',pwd)
  logSummary(pwd);
}else{
  const nextLayerFoldArr = computePath(pwd);
  nextLayerFoldArr.forEach(path => {
    if(isGitRepo(path)){
      logSummary(path);
    }
  })
}
