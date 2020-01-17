const express = require('express');
const router = express.Router();
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const readDirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);

async function listApiFiles(next) {
  let list = [];
  try {
    list = await readDirAsync(path.join(__dirname, '..', 'api-files'));
  } catch (err) {
    console.error(err);
    next(err);
  }

  list = list.filter((entry) => entry !== '.gitignore');

  return list;
}

async function readAndParseFile(fileName, next) {
  try {
    const file = await readFileAsync(
      path.join(__dirname, '..', 'api-files', fileName),
      'utf8'
    );
    const contents = JSON.parse(file);
    return contents;
  } catch (err) {
    next(err);
  }
}

async function getFilesInfo(fileNameArray, next) {
  return Promise.all(
    fileNameArray.map(async (fileName) => {
      try {
        const contents = await readAndParseFile(fileName, next);
        if (contents.info && contents.info.title) {
          const title = contents.info.title;
          return { title, fileName };
        } else {
          return null;
        }
      } catch (err) {
        next(err);
      }
    })
  );
}

router.get('/list', async (req, res, next) => {
  const fileNameArray = await listApiFiles(next);
  const filesInfo = await getFilesInfo(fileNameArray, next);
  res.send(filesInfo);
});

router.use(express.static(path.join(__dirname, '..', 'api-files')));

module.exports = router;
