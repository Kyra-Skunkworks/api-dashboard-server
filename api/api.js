const express = require('express');
const router = express.Router();
const { promisify } = require('util');
const fs = require('fs');

const readDirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);

async function listApiFiles() {
  let list = [];
  try {
    list = await readDirAsync('./api-files');
  } catch (err) {
    console.error(err);
    throw new Error();
  }

  list = list.filter((entry) => entry !== '.gitignore');

  return list;
}

async function getFilesInfo(fileNameArray) {
  return Promise.all(
    fileNameArray.map(async (fileName) => {
      const file = await readFileAsync(`./api-files/${fileName}`, 'utf8');
      const contents = JSON.parse(file);
      if (contents.info && contents.info.title) {
        const title = contents.info.title;
        return { title, fileName };
      } else {
        return null;
      }
    })
  );
}

router.get('/list', async (req, res) => {
  const fileNameArray = await listApiFiles();
  const filesInfo = await getFilesInfo(fileNameArray);
  res.send(filesInfo);
});

module.exports = router;
