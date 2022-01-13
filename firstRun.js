const fs = require('fs');
const {config, gameInfo} = require('./info/setupInfo.json');


try {
    if (!fs.existsSync("./" + config.location)) {
        fs.writeFile("./" + config.location, JSON.stringify(config.content, null, 2), function writeJSON(err) {
            if (err) 
                return console.error(`Could not create '${config.location}'`);
            console.log(`Created '${config.location}'`);
        });
    }
} catch (err) {
    console.error(err);
}

try {
    if (!fs.existsSync("./" + gameInfo.location)) {
        //Write .json change to file
        fs.writeFile("./" + gameInfo.location, JSON.stringify(gameInfo.content, null, 2), function writeJSON(err) {
            if (err) 
                return console.error(`Could not create '${gameInfo.location}'`);
            console.log(`Created '${gameInfo.location}'`);
        });
    }
} catch (err) {
    console.error(err);
}