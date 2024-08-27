import { TIMEOUT_SEC } from './config.js';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

//getjson and sendjson in one function
//setting uploadDate to undefined so that we can only define the fetchpro when there is no data
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            //iinformation of the request itself
            'Content-Type': 'application/json', //the data were gonna send its going to be in json format
          },
          body: JSON.stringify(uploadData), //converting the data to json, so that it can be sent
        }) //we put two promises, and as soon as 1 rejects/fulfilled that promise will become the winner
      : fetch(url);
    //we put two promises, and as soon as 1 rejects/fulfilled that promise will become the winner
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; //this gives a promise and in model.js we await that promise
  } catch (err) {
    console.log('err');
  }
};

/*
//getting data from the appi, get request
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    //we put two promises, and as soon as 1 rejects/fulfilled that promise will become the winner
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; //this gives a promise and in model.js we await that promise
  } catch (err) {
    console.log('err');
  }
};

//sending data to the api, post request
export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        //iinformation of the request itself
        'Content-Type': 'application/json', //the data were gonna send its going to be in json format
      },
      body: JSON.stringify(uploadData), //converting the data to json, so that it can be sent
    }); //we put two promises, and as soon as 1 rejects/fulfilled that promise will become the winner
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; //this gives a promise and in model.js we await that promise
  } catch (err) {
    console.error(err);
  }
};
*/
