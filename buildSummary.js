'use strict';

const shell = require('shelljs');
const dateformat = require('dateformat');
const path = require('path');
const debug = require('debug')('logSummary');

const delUnuseLog = function(logList) {
  for(let i=logList.length-1; i>=0; i--){
    if(logList[i].indexOf('commit') === 0
    || logList[i].indexOf('Author') === 0
    || logList[i].trim() === ''){
      logList.splice(i,1);
    }
  }
  return logList;
}

const combileLogByDay = function(usefulLogList){
  let tmpDate = '';
  for(let i=0; i<usefulLogList.length-1; i++){
    if(usefulLogList[i].indexOf('Date') === 0){
      let today = dateformat(new Date(usefulLogList[i].slice(4)),'yyyy-mm-dd');
      if(today === tmpDate){
        usefulLogList.splice(i, 1);
      }else{
        tmpDate = today;
        usefulLogList[i]= `${today}`;
        usefulLogList.splice(i,0,'');
      }
    }
  }
  return usefulLogList;
}

const outLogList = function(logList,dirname){
  if(logList.join().trim() !== ''){
    let folderRelativePath = path.relative(process.cwd(), dirname);
    if(folderRelativePath.trim() === ''){
      folderRelativePath = path.parse(__dirname).name;
    }
    console.log(`==============Welcome to the git logs list of ${folderRelativePath}`);
    console.log(logList.join('\n'));
  }
}

module.exports = function logSummary(dirname) {
  const name = shell.exec('git config user.name', {
    silent: true
  }).stdout.trim();
  const sevenDaysAgo = new Date((new Date()).getTime() - (1000 * 60 * 60 * 24 * 7));
  const dateStr = dateformat(sevenDaysAgo, "yyyy-mm-dd");
  const gitLogCommentToRun = `cd '${dirname}' && git log --after ${dateStr} --author ${name}`;
  const gitLogs = shell.exec(gitLogCommentToRun, {
    silent: true
  }).stdout.trim();

  debug(`dateStr:${dateStr}`);
  debug(`gitLogCommentToRun:${gitLogCommentToRun}`);
  const logArr = gitLogs.split('\n');
  const usefulLogList = delUnuseLog(logArr);
  const combileLogList = combileLogByDay(usefulLogList);
  outLogList(combileLogList,dirname);
};
