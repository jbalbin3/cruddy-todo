const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {

  // read check , initialize counter to what's in the harddrive
  // if no file, then write initial counter to drive

  console.log('1:counter ', counter);
  readCounter(function(err, fileData) {
    counter = fileData;
    console.log('2: counter', counter);
    callback(zeroPaddedNumber(counter));
    if (err) {
      writeCounter(counter, function(err, counterString) {
        console.log('initial counter string written ', counterString);
      });
    } else {
      counter = counter + 1;
      writeCounter(counter, function(err, counterString) {
        console.log('current string counter, will write to next one ', counterString);
      });
    }
  });



  // console.log('3:counter ', counter);
  // return zeroPaddedNumber(counter); // how to make it wait for readCounter value of counter?
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
