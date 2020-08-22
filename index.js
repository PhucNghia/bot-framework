var schedule = require('node-schedule');
const restify = require('restify');
const botbuilder = require('botbuilder');

var cronExpress = '*/2 * * * * * *';
var rule = new schedule.RecurrenceRule();
rule.minute = 1;

// schedule.scheduleJob(cronExpress, function(fireDate){
//   console.log('running job!');
//   console.log(fireDate)
// });

// Create bot adapter, which defines how the bot sends and receives messages.
var adapter = new botbuilder.BotFrameworkAdapter({
    appId: "d2df0fd8-3ff3-4ec0-99ae-14adfb685866",
    appPassword: "-E5UJDO~S~z5hXj3U2dz5m9gT3lcwmp_3J"
});

// Create HTTP server.
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 7070, function () {
    console.log(`\n${server.name} listening to ${server.url}`);
    console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
});

// Listen for incoming requests at /api/messages.
server.post('/api/messages', (req, res) => {
    // Use the adapter to process the incoming web request into a TurnContext object.
    adapter.processActivity(req, res, async (turnContext) => {
        let activity = turnContext.activity;
        console.log("activity type: " + activity.type);
        switch(activity.type) {
            case "conversationUpdate":
              await turnContext.sendActivity("Welcome!");
              break;
            case "message":
              // Get the user's text
              const utterance = activity.text;
              await turnContext.sendActivity(`Every new day is a new opportunity. Good Morning. (happyeyes) `);
              await turnContext.sendActivity(`I heard you say: ${ utterance }`);
              break;
            case "schedule":
              break;
            default:
                break;
        }
    });
});