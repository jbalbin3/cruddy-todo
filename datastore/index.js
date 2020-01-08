const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
Promise.promisifyAll(fs);

var items = {};



// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  //var id = counter.getNextUniqueId();
  counter.getNextUniqueId(function(resultId) {
    var id;
    id = resultId;
    console.log('ID? ', id);
    items[id] = text;
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
      if (err) {
        throw ('error creating data dir');
      } else {
        console.log('saved todo to file ', `${exports.dataDir}/${id}.txt`);
      }
    });
    callback(null, { id, text });
  });
};

exports.readAll = (callback) => {
  // read the data directory
  // for each file grab the content of each file (which is a todo) and place in an array of todos
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error using fs.readdir for readdir');
    } else {
      var data = [];
      var runReads = [];
      files.forEach(function(filename) {
        runReads.push(fs.readFileAsync(`${exports.dataDir}/${filename}`, 'utf-8').then(function(todo) {
          data.push({id: filename.substr(0, filename.lastIndexOf('.')), text: todo});
        }));
      });

      Promise.all(runReads)
        .then(function() {
          data.sort(function(a, b) {
            return Number(a.id) - Number(b.id);
          });
          callback(null, data);
        });
    }
  });
};

exports.readOne = (id, callback) => {
  // console.log('readOne id ', id);
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, text) => {
    if (err) {
      throw (`No item with id: ${id}`);
    } else {
      text = text.toString();
      callback(null, {id, text});
    }
  });

  // var text = items[id];
  // console.log('TESTING: text ', text, 'id ', id);
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
    if (err) {
      throw (`Could not update todo with id: ${id}`);
    } else {
      callback(null, {id, text});
    }
  });

  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {

  fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      throw (`Could not delete ID: ${id}`);
    } else {
      callback();
    }
  });

  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
