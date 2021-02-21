const gtts = require("node-google-tts-api");
const tts = new gtts();
const fs = require("fs");

console.log("- made agent");

if (fs.existsSync(__dirname + "/small_audio.mp3")) {fs.unlinkSync(__dirname + "/small_audio.mp3");}

tts.get({
    text: "tests are fun lol",
    lang: "en"
}).then(function(data) {
    fs.writeFileSync(__dirname + "/small-audio.mp3", data);
    console.log("- test for >200 character strings succeeded!");
}).catch(function(err) {
    console.log(err.stack);
})

if (fs.existsSync(__dirname + "/large_audio.mp3")) {fs.unlinkSync(__dirname + "/large_audio.mp3");}

tts.get({
    text: "A test or examination (informally, exam or evaluation) is an educational assessment intended to measure a test-taker's knowledge, skill, aptitude, physical fitness, or classification in many other topics (e.g., beliefs). A test may be administered verbally, on paper, on a computer, or in a predetermined area that requires a test taker to demonstrate or perform a set of skills.",
    lang: "en",
    limit_bypass: true
}).then(async function(data) {
    var data = await tts.concat(data);
    fs.writeFileSync(__dirname + "/large-audio.mp3", data);
    console.log("- test for 200+ character strings succeeded!");
}).catch(function(err) {
    console.log(err.stack);
})

