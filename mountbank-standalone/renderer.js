// require('@electron/remote/main').initialize()
// const app = require('@electron/remote').app;

var app = require('electron').remote.app;
var node = require("child_process").fork(
  `${app.getAppPath()}/app/bin/server.js`,
  [],
  {
    stdio: ["pipe", "pipe", "pipe", "ipc"]
  });


function strip(s) {
  // regex from: http://stackoverflow.com/a/29497680/170217
  return s.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ""
  );
}

function redirectOutput(x) {
  let lineBuffer = "";

  x.on("data", function (data) {
    lineBuffer += data.toString();
    let lines = lineBuffer.split("\n");

    for (let l of lines) {
      if (l !== "") {
        var child = document.createElement('p');
        child.innerHTML = strip(l);
        document.getElementById('serverLog').appendChild(child);
      }
    }

    lineBuffer = lines[lines.length - 1];
  });
}

node.on('error', (err) => {
  console.log("\n\t\tERROR: spawn failed! (" + err + ")");
  node.kill('SIGHUP');
});

redirectOutput(node.stdout);
redirectOutput(node.stderr);
