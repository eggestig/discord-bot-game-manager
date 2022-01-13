const { deleteGame, gameInfo, logArray, writeToJson } = require("./deleteGameMethods.js");

// https://stackoverflow.com/questions/37271445/convert-string-to-number-node-js
// - tejp124
function cleanInt(x) {
    x = Number(x);
    return x >= 0 ? Math.floor(x) : Math.ceil(x);
};

function cleanInput(uncleanIndex, uncleanLength) {
    var index = 0;
    var length = 0;

    //Check that both parameters are not null and are not leading to out-of-bounds issues
    index = cleanInt(uncleanIndex);
    if(!(index != null && index > 0 && index <= gameInfo.games.length))
        index = 0; //Default value

    length = cleanInt(uncleanLength);
    if(!(length != null && length > 0 && index + length <= gameInfo.games.length))
        length = gameInfo.games.length - index; //Default value

    return {index, length};
}

async function deleteGames(interaction, uncleanInput) {
    let deletes = 0;

    let {index, length} = cleanInput(uncleanInput.uncleanIndex, uncleanInput.uncleanLength);

    let deletedGames    = [];
    let nonDeletedGames = [];

    for(let i = index; i < index + length; length--, deletes++) {
        const fancyTitle = gameInfo.games[i].fancyLabel;
        const title = gameInfo.games[i].label;

        const result = await deleteGame(interaction, fancyTitle, title);

        if(result.deleted) {
            deletedGames.push(result);
            continue;
        }

        nonDeletedGames.push(result);
    }
    
    return {deletedGames, nonDeletedGames};
};


module.exports = {
    deleteGames, logArray, writeToJson
};