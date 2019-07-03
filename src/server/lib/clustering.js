/**
 * * Setting up the clustering module
 */

 //Dependencies
 const cluster = require('cluster')

 let workers = []


 const setUpworkerProcesses = () => {
     //getting the number of CPU of the os
     let numCores = require('os').cpus().length;
     console.log(`Master cluster setting up ${numCores } workers`);

    for (let i = 0; i < numCores ; i++) {
        //add reference of this worker to the workers list
        let worker = cluster.fork()
        workers.push(worker);
        //Recieve message  from other process
        workers[i].on('message',message => {
            console.log(message)
        })
        
        
    }
     // process is clustered on a core and process id is assigned
     cluster.on('online', function(worker) {
        console.log(`Worker ${worker.process.pid} is listening`);
    });

    // if any of the worker process dies then start a new one by simply forking another one
    cluster.on('exit', function(worker, code, signal) {
        console.log(`Worker  ${worker.process.pid} died with code:  ${code} , and signal:  ${signal}`);
        console.log('Starting a new worker');
        setTimeout(cluster.fork(),2000)
        workers.push(cluster.fork());
        // to receive messages from worker process
        workers[workers.length-1].on('message', function(message) {
            console.log(message);
        });
    });

 }

 module.exports = function(appBootstrap){
      // if it is a master process then call setting up worker process
    if( cluster.isMaster) {
        setUpworkerProcesses();
    } else {
        // to setup server configurations and share port address for incoming requests
        appBootstrap();
    }

 }