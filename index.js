const discordjs = require("discord.js");
const fs = require("fs");
if (!fs.existsSync(__dirname + "/config.json")) {
    console.log("[ERR] make a config.json file! a template is being generated!");
    var template = {
        "token": "",
        "id": "",
        "prefix": "t!",
        "autoTranslate": false,
        "defaultLang": "en"
    }
    fs.writeFileSync(__dirname + "/config.json", JSON.stringify(template));
    console.log("you can find it @ " + __dirname + "/config.json");
    console.log();
    console.log("if you need more information of help on how to start, go here: https://github.com/normanlol/discord-tts-bot/tree/main/docs#configuration")
    return;
}
const config = JSON.parse(fs.readFileSync(__dirname + "/config.json"));
const bot = new discordjs.Client();
const gtts = require("node-google-tts-api");
const tts = new gtts();
const languages = require('@vitalets/google-translate-api/languages');
const translate = require("@vitalets/google-translate-api");

bot.login(config.token);

bot.on("ready", function () {
    if (!config.id) {
        config.id = bot.user.id;
        fs.writeFileSync(__dirname + "/config.json", JSON.stringify(config)); 
        console.log("invite the bot here - https://discord.com/oauth2/authorize?client_id=" + config.id + "&scope=bot&permissions=8");
    }
    console.log("- ready");
});

bot.on("guildCreate", function(guild) {
    var array = guild.channels.cache.map(x => [
        x.id,
        x.type
    ]);
    for (var c in array) {
        if (array[c][1] == "text") {
            var embed = new discordjs.MessageEmbed();
            embed.setColor("00ecff");
            embed.setAuthor("Welcome to TTSBot!");
            embed.setDescription("Please have a moderator respond '" + config.prefix + "setChannelId <channel id>' to get started!");
            guild.channels.cache.get(array[c][0]).send(embed); 
            return;
        } else {continue;}
    }
})

bot.on("message", async function (message) {
    if (message.author.bot) {return;}
    if (message.content.startsWith(config.prefix)) {
        var args = message.content.substring(config.prefix.length).split(" ");
        switch(args[0]) {
            case "ping":
                message.channel.send("Pong.");
            return;

            case "setChannelId": 
                if (message.guild) {
                    var id = message.content.split(config.prefix + "setChannelId ")[1];
                    if (message.guild.channels.cache.get(id) !== undefined && message.guild.channels.cache.get(id).type == "text") {
                        if (fs.existsSync(__dirname + "/db.json")) {
                            var json = JSON.parse(fs.readFileSync(__dirname + "/db.json"));
                            json[message.guild.id].channel = id;
                            if (!json[message.guild.id]) {json[message.guild.id] = {};}
                            fs.writeFileSync(__dirname + "/db.json", JSON.stringify(json))
                        } else {
                            var json = {};
                            if (!json[message.guild.id]) {json[message.guild.id] = {};}
                            json[message.guild.id].channel = id;
                            fs.writeFileSync(__dirname + "/db.json", JSON.stringify(json))
                        }
                        var embed = new discordjs.MessageEmbed();
                        embed.setAuthor("Success! The channel is set.");
                        embed.setColor("00c610");
                        message.channel.send(embed);
                    } else {
                        var embed = new discordjs.MessageEmbed();
                        embed.setAuthor("Failed! The channel could not be set!");
                        embed.setDescription("Either the ID was invalid or is not visible to the bot. Try again using the same command.");
                        embed.setColor("fc1b1f");
                        message.channel.send(embed);
                    }
                } else {
                    var embed = new discordjs.MessageEmbed();
                    embed.setAuthor("This command cannot be done in DMs!");
                    embed.setColor("fc1b1f");
                    message.channel.send(embed);
                    return;
                }
            return;

            case "languages": 
                if (message.guild) {
                    message.channel.send("The list of compatible languages is being sent to you to prevent spam.");
                    var language = "";
                    for (var c in languages) {
                        if (languages[c].code == undefined) {continue;}
                        var language = language + languages[c].name + " (" + languages[c].code + ")\n";
                    }
                    message.author.send(language);
                } else {
                    var language = "";
                    for (var c in languages) {
                        if (languages[c].code == undefined) {continue;}
                        var language = language + languages[c].name + " (" + languages[c].code + ")\n";
                    }
                    message.author.send(language);
                }
            return;

            case "setLanguage": 
                if (message.guild) {
                    var lang = message.content.split(config.prefix + "setLanguage ")[1];
                    if (languages.getCode(lang) !== false) {
                        var json = JSON.parse(fs.readFileSync(__dirname + "/db.json"));
                        if (!json[message.guild.id]) {json[message.guild.id] = {};}
                        json[message.guild.id].lang = languages.getCode(lang);
                        fs.writeFileSync(__dirname + "/db.json", JSON.stringify(json));
                        var embed = new discordjs.MessageEmbed();
                        embed.setAuthor("Success! The language is set to " + lang + ".");
                        embed.setColor("00c610");
                        message.channel.send(embed);
                    } else if (languages.isSupported(lang) !== false) {
                        var json = JSON.parse(fs.readFileSync(__dirname + "/db.json"));
                        if (!json[message.guild.id]) {json[message.guild.id] = {};}
                        json[message.guild.id].lang = lang;
                        fs.writeFileSync(__dirname + "/db.json", JSON.stringify(json));
                        var embed = new discordjs.MessageEmbed();
                        embed.setAuthor("Success! The language is set to " + lang + ".");
                        embed.setColor("00c610");
                        message.channel.send(embed);
                    } else {
                        var embed = new discordjs.MessageEmbed();
                        embed.setAuthor("Failed! The language could not be set!");
                        embed.setDescription("Either the language could not be found or it is invalid.");
                        embed.setColor("fc1b1f");
                        message.channel.send(embed);
                    }
                } else {
                    var embed = new discordjs.MessageEmbed();
                    embed.setAuthor("This command cannot be done in DMs!");
                    embed.setColor("fc1b1f");
                    message.channel.send(embed);
                    return;
                }
            return;

            case "setTranslation": 
                if (message.guild) {
                    var opt = message.content.split(config.prefix + "setTranslation ")[1];
                    if (opt !== undefined || opt == "true" || opt == "false") {
                        var json = JSON.parse(fs.readFileSync(__dirname + "/db.json"));
                        if (!json[message.guild.id]) {json[message.guild.id] = {};}
                        json[message.guild.id].autoTrans = opt;
                        fs.writeFileSync(__dirname + "/db.json", JSON.stringify(json));
                        var embed = new discordjs.MessageEmbed();
                        embed.setAuthor("Success! The translation is set to " + opt + ".");
                        embed.setColor("00c610");
                        message.channel.send(embed);
                    } else {
                        var embed = new discordjs.MessageEmbed();
                        embed.setAuthor("Failed! The channel could not be set!");
                        embed.setDescription("Either the ID was invalid or is not visible to the bot. Try again using the same command.");
                        embed.setColor("fc1b1f");
                        message.channel.send(embed);
                    }
                } else {
                    var embed = new discordjs.MessageEmbed();
                    embed.setAuthor("This command cannot be done in DMs!");
                    embed.setColor("fc1b1f");
                    message.channel.send(embed);
                    return;
                }
            return;

            case "info":
                var embed = new discordjs.MessageEmbed();
                embed.setTitle("TTSBot Project Page")
                embed.setAuthor("This is TTSBot!");
                embed.setDescription("An open-sourced text-to-speech bot written in NodeJS.");
                embed.setURL("https://github.com/normanlol/discord-tts-bot")
                embed.setColor("00ecff");
                message.channel.send(embed);
            return;

            case "commands":
                var embed = new discordjs.MessageEmbed();
                embed.setTitle("Commands list is here!");
                embed.setDescription("Above is the link to the commands list for TTSBot.")
                embed.setURL("https://github.com/normanlol/discord-tts-bot/tree/main/docs#commands")
                message.channel.send(embed);
            return;
        }
    } else if (fs.existsSync(__dirname + "/db.json")) {
        if (!message.guild) {
            var embed = new discordjs.MessageEmbed();
            embed.setAuthor("TTS messages are not supported in DMs!");
            embed.setColor("fc1b1f");
            message.channel.send(embed);
            return;
        }
        var db = JSON.parse(fs.readFileSync(__dirname + "/db.json"));
        if (!fs.existsSync(__dirname + "/data/")) {fs.mkdirSync(__dirname + "/data/");}
        if (db[message.guild.id].lang) {var lang = db[message.guild.id].lang;} else {var lang = config.defaultLang;}
        if (db[message.guild.id].autoTrans) {var autoTrans = db[message.guild.id].autoTrans;} else {var autoTrans = config.autoTranslate;}
        if (db[message.guild.id] && db[message.guild.id].channel == message.channel.id) {
            if (autoTrans == "true") {
                translate(message.cleanContent, {to: lang}).then(function(res) {
                    var msg = res.text.toString();
                    if (msg.length > 199) {
                        tts.get({
                            text: msg,
                            lang: lang,
                            limit_bypass: true
                        }).then(async function(data) {
                            if (message.member.voice.channel) {var connection = await message.member.voice.channel.join();}
                            var data = tts.concat(data);
                            fs.writeFileSync(__dirname + "/data/" + message.id + ".mp3", data);
                            if (connection) {
                                await message.channel.send("" , {files: [__dirname + "/data/" + message.id + ".mp3"]});
                                var d = await connection.play(__dirname + "/data/" + message.id + ".mp3");
                                d.on("finish", function () {
                                    d.destroy();
                                });
                                d.on("close", function () {
                                    d.destroy();
                                    fs.unlinkSync(__dirname + "/data/" + message.id + ".mp3");
                                });
                            } else {
                                await message.channel.send("" , {files: [__dirname + "/data/" + message.id + ".mp3"]});
                                fs.unlinkSync(__dirname + "/data/" + message.id + ".mp3");
                            }
                        }).catch(function(err) {
                            message.channel.send("```" + err.stack + "```");
                            message.channel.send("Please report this to the devs @ <https://github.com/normanlol/discord-tts-bot>");
                        });
                    } else {
                        tts.get({
                            text: msg,
                            lang: lang
                        }).then(async function(data) {
                            if (message.member.voice.channel) {var connection = await message.member.voice.channel.join();}
                            fs.writeFileSync(__dirname + "/data/" + message.id + ".mp3", data);
                            if (connection) {
                                await message.channel.send("" , {files: [__dirname + "/data/" + message.id + ".mp3"]});
                                var d = await connection.play(__dirname + "/data/" + message.id + ".mp3");
                                d.on("finish", function () {
                                    d.destroy();
                                });
                                d.on("close", function () {
                                    d.destroy();
                                    fs.unlinkSync(__dirname + "/data/" + message.id + ".mp3");
                                });
                            } else {
                                await message.channel.send("" , {files: [__dirname + "/data/" + message.id + ".mp3"]});
                                fs.unlinkSync(__dirname + "/data/" + message.id + ".mp3");
                            }
                        }).catch(function(err) {
                            message.channel.send("```" + err.stack + "```");
                            message.channel.send("Please report this to the devs @ <https://github.com/normanlol/discord-tts-bot>");
                        });
                    }
                }).catch(function(err) {
                    message.channel.send("```" + err.stack + "```");
                    message.channel.send("Please report this to the devs @ <https://github.com/normanlol/discord-tts-bot>");
                });
            } else {
                var msg = message.cleanContent.toString();
                if (msg.length > 199) {
                    tts.get({
                        text: msg,
                        lang: lang,
                        limit_bypass: true
                    }).then(async function(data) {
                        if (message.member.voice.channel) {var connection = await message.member.voice.channel.join();}
                        var data = tts.concat(data);
                        fs.writeFileSync(__dirname + "/data/" + message.id + ".mp3", data);
                        if (connection) {
                            await message.channel.send("" , {files: [__dirname + "/data/" + message.id + ".mp3"]});
                            var d = await connection.play(__dirname + "/data/" + message.id + ".mp3");
                            d.on("finish", function () {
                                d.destroy();
                            });
                            d.on("close", function () {
                                d.destroy();
                                fs.unlinkSync(__dirname + "/data/" + message.id + ".mp3");
                            });
                        } else {
                            await message.channel.send("" , {files: [__dirname + "/data/" + message.id + ".mp3"]});
                            fs.unlinkSync(__dirname + "/data/" + message.id + ".mp3");
                        }
                    }).catch(function(err) {
                        message.channel.send("```" + err.stack + "```");
                        message.channel.send("Please report this to the devs @ <https://github.com/normanlol/discord-tts-bot>");
                    });
                } else {
                    tts.get({
                        text: message.cleanContent.toString(),
                        lang: lang
                    }).then(async function(data) {
                        if (message.member.voice.channel) {var connection = await message.member.voice.channel.join();}
                        fs.writeFileSync(__dirname + "/data/" + message.id + ".mp3", data);
                        if (connection) {
                            await message.channel.send("" , {files: [__dirname + "/data/" + message.id + ".mp3"]});
                            var d = await connection.play(__dirname + "/data/" + message.id + ".mp3");
                            d.on("finish", function () {
                                d.destroy();
                            });
                            d.on("close", function () {
                                d.destroy();
                                fs.unlinkSync(__dirname + "/data/" + message.id + ".mp3");
                            });
                        } else {
                            await message.channel.send("" , {files: [__dirname + "/data/" + message.id + ".mp3"]});
                            fs.unlinkSync(__dirname + "/data/" + message.id + ".mp3");
                        }
                    }).catch(function(err) {
                        message.channel.send("```" + err.stack + "```");
                        message.channel.send("Please report this to the devs @ <https://github.com/normanlol/discord-tts-bot>");
                    });
                }
            }
            return;
        }
    }
})