import  EventEmitter from 'node:events';

const myEmitter = new EventEmitter();

let startTime;
let endTime;
let loadingTime;

// Define a 'fetch-progress' event
myEmitter.on('fetch-progress', (payload) => {
  console.log('fetch-progress event fired!', payload);
  startTime = payload.start;
});

// Define a 'fetch-finished' event
myEmitter.on('fetch-finished', (payload) => {
  console.log('fetch-finished event fired!', payload);
  endTime = payload.end;
  loadingTime = end - start;
});


export { myEmitter, loadingTime }