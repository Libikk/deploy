var express = require("express");
var app = express();
var childProcess = require('child_process');
var bodyParser = require('body-parser')
var fs = require('fs');
var util = require('util');

function logDeployment() {
    var logFile = fs.createWriteStream('deployment_logs.log', { flags: 'a' });
    var logStdout = process.stdout;
    logFile.write(util.format.apply(null, arguments) + '\n');
    logStdout.write(util.format.apply(null, arguments) + '\n');
}

var githubUsername = 'Libikk'

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post("/webhooks/github", function (req, res) {
    console.log('body:', typeof req.body, req.body.sender, req.body)
    var sender = req.body.sender;
    var branch = req.body.ref || '';
    logDeployment(new Date() + 'Start deploying branch: ' + branch + ', sender: ' + sender.login)

    if (branch.indexOf('master') > -1 && sender.login === githubUsername){
        childProcess.exec('cd /home/marekkregiel/deploy && ./deployAP.sh', function(err, stdout, stderr){
            if (err) {
                console.error('deployment error:', err);
                logDeployment(new Date() + 'Error:' + err)
                return res.sendStatus(500);
            }
            console.log('start deploing...')
            logDeployment(new Date() + 'Success')
            res.sendStatus(200);
          });
    } else {
        res.sendStatus(500);
        logDeployment(new Date() + 'Wrong user or not master branch')
        console.error('Wrong user or not master branch')
    }
    logDeployment('-----------------')
})

app.listen(3003, function(err) {
    if (err) throw err;
    console.log('> Ready on http://kregielmarek.com:3003');
});