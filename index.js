var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fetch = require("node-fetch");


// // Create a request variable and assign a new XMLHttpRequest object to it.
// var request = new XMLHttpRequest()

// // // Open a new connection, using the GET request on the URL endpoint
// request.open('GET', 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/TophBlazeit?api_key=RGAPI-77b83688-c7d7-451e-b4df-5667e8b88bb3', true)

// request.onload = function() {
//     // Begin accessing JSON data here
//     var data = JSON.parse(this.response)
//     console.log(data.name)
  


// }

// // Send request
// request.send()





// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    message = message.toLowerCase();
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        console.log("args:"+args);

        var cmd = args[0];
        console.log("cmd:"+cmd);
        console.log("args[1]:"+args[1]);
        //args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            case 'lol':
                // Replace ./data.json with your JSON feed
                url = 'https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/'+args[1]+'?api_key=RGAPI-77b83688-c7d7-451e-b4df-5667e8b88bb3'
                console.log("url:"+url)
                fetch(url)
                    .then(response => {
                        return response.json()
                    })
                    .then(data => {
                        // Work with JSON data here
                        console.log("Level:"+ data["summonerLevel"])
                        var summonerId = data["id"];
                        console.log("summoner ID:"+ data["id"])
                        newURL = 'https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/'+summonerId+'?api_key=RGAPI-77b83688-c7d7-451e-b4df-5667e8b88bb3'
                        console.log("NEWURL:"+newURL)
                        fetch(newURL)
                            .then(response =>{
                                return response.json()
                            })    
                            .then(data => {
                                console.log(data);
                                console.log("tier: "+data[0]["tier"])
                                bot.sendMessage({
                                to: channelID,
                                message: "Current Summoner's Rift Ranks:\n"+data[0]["queueType"]+' '+data[0]["tier"]+' '+data[0]["rank"]+"\n"+data[1]["queueType"]+' '+data[1]["tier"]+' '+data[1]["rank"]
                                })
                            })
                            .catch(err => {
                                // Do something for an error here
                                bot.sendMessage({
                                to: channelID,
                                message: "Error:"+err
                                })
                            })
                    })
                    .catch(err => {
                    // Do something for an error here
                        bot.sendMessage({
                        to: channelID,
                        message: "Error:"+err
                        })
                    })
            break;
            case 'tft':
                // Replace ./data.json with your JSON feed
                url = 'https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/'+args[1]+'?api_key=RGAPI-77b83688-c7d7-451e-b4df-5667e8b88bb3'
                console.log("url:"+url)
                fetch(url)
                    .then(response => {
                        return response.json()
                    })
                    .then(data => {
                        // Work with JSON data here
                        // console.log(data)
                        var summonerId = data["id"];
                        console.log("summoner ID:"+ data["id"])
                        newURL = 'https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/'+summonerId+'?api_key=RGAPI-77b83688-c7d7-451e-b4df-5667e8b88bb3'
                        console.log("NEWURL:"+newURL)
                        fetch(newURL)
                            .then(response =>{
                                return response.json()
                            })    
                            .then(data => {
                                console.log(data);
                                if (data.length === 0) {
                                    bot.sendMessage({
                                    to: channelID,
                                    message: "Sorry, Data for this Summoner is not available"
                                    })
                                }
                                else {
                                    try {
                                        console.log("tier: "+data[0]["tier"])
                                        bot.sendMessage({
                                        to: channelID,
                                        message: "Current Summoner's Rift Ranks:\n"+data[0]["queueType"]+' '+data[0]["tier"]+' '+data[0]["rank"]+"\n"+data[1]["queueType"]+' '+data[1]["tier"]+' '+data[1]["rank"]
                                        })
                                        
                                    } catch (error) {
                                        bot.sendMessage({
                                        to: channelID,
                                        message: "Error:"+error
                                        })
                                    }
                                }
                            })
                            .catch(err => {
                                // Do something for an error here
                                bot.sendMessage({
                                to: channelID,
                                message: "Error:"+err
                                })
                            })
                    })
                    .catch(err => {
                    // Do something for an error here
                        bot.sendMessage({
                        to: channelID,
                        message: "Error:"+err
                        })
                    })
                break;
            // Just add any case commands if you want to..
        }
    }
});


