const request = require('request');
var schedule = require('node-schedule');
const restify = require('restify');
const botbuilder = require('botbuilder');

// Bot-reminder (containt clientId)
var clientSecret = {
  clientId: "a27f1a12-e74a-40cb-8141-479c794a9316",
  secretId: "816007f2-0b63-4bef-bac0-20973af1f06b",
  value: "_.93i_HFH31y1-fuG5m2PIs.V3h2Qba122"
};

// Bot-reminder
var adapter = new botbuilder.BotFrameworkAdapter({
  appId: clientSecret.clientId,
  appPassword: clientSecret.value
});

// Create HTTP server
let server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 7070, function () {
  console.log(`\n${server.name} listening to ${server.url}`);
  console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
});

// Listen for incoming requests at /api/messages.
server.post('/api/messages', (req, res) => {
  console.log("\n" + new Date() + "-------------------\n");
  console.log("id: " + req.params.id);
  console.log("conversation_id: " + req.params.conversation.id);
  console.log("from_id: " + req.params.from.id)
  console.log("from_name: " + req.params.from.name)
 
  adapter.processActivity(req, res, async (turnContext) => {
    let activity = turnContext.activity;
    console.log(new Date() + ": activity type: " + activity.type);
    switch(activity.type) {
      case "conversationUpdate":
        try {
          // await turnContext.sendActivity("Xin chào cả nhà!");
          // await turnContext.sendActivity("Em là bot mới đc tạo. Em qua đây để giúp mọi người nhớ thời gian log work vào Thứ 5 hàng tuần ạ. Em sẽ nhắc mọi người vào 9h và 16h ạ (happyeyes)");
          console.log(new Date() + ": Add bot to group");
        } catch (error) {
          console.log(new Date() + ": Removed this Bot");
        }
        break;
      case "message":
        const utterance = activity.text;
        if(!utterance.includes("all")) {
          // await turnContext.sendActivity(`Chúc bạn một ngày tốt lành (happyeyes). Mình đã nghe thấy bạn nói: ${ utterance.replace('reminder ', '') }`);
          console.log(new Date() + ": Replied, content: " + utterance);
          await turnContext.sendActivity(`Xin chào bạn ${ req.params.from.name } nhé (happyeyes)`);
        } else {
          console.log(new Date() + ": Bot is Reloaded, content: " + utterance);          
        }
        break;
      default:
        break;
    }
    console.log("\n-------------------\n");
  });
});

// ========================================================

server.use(restify.plugins.bodyParser({ mapParams: true }));
server.use(restify.plugins.acceptParser(server.acceptable));

server.get('/', (req, res) => {
  processJob(req.boby.content, req.boby.conversiationId);
  res.send("Hello");
});

var cronExpressMorning = '0 00 09 * * THU';
var cronExpressAfternoon = '0 00 16 * * THU';
var cronExpressFinalOfWeek = '0 00 08 * * FRI';
var cronExpress = '*/10 * * * * * *';  // 15s chạy 1 lần

// schedule.scheduleJob(cronExpress, function(fireDate) {
//   let content = "test";
//   processJob(content);
//   console.log("send content is empty: " + fireDate);
// });
let conversiationReminderId = '19:2cb0f313075e4f7995ff346e3e96a569@thread.skype'; // Bot-reminder
schedule.scheduleJob(cronExpressMorning, function(fireDate) {
  let content = "Hôm nay là thứ 5 rồi. Cả nhà log work nhé (tropicalfish)";
  processJob(content, conversiationReminderId);
  console.log("run schedule morning: " + fireDate);
});

schedule.scheduleJob(cronExpressAfternoon, function(fireDate) {
  let content = "Sắp tới giờ về rồi. Cả nhà đừng quên log work nhé (dolphin)";
  processJob(content, conversiationReminderId);
  console.log("run schedule afternoon: " + fireDate);
});

schedule.scheduleJob(cronExpressFinalOfWeek, function(fireDate) {
  let content = "Còn ai chưa log work thì tranh thủ log luôn đi nhé (unicorn)";
  processJob(content, conversiationReminderId);
  console.log("run schedule thriday's morning: " + fireDate);
});


var processJob = function(content, conversiationId) {
  try {
    request.post('http://localhost:7070/api/notification', {form: {content: content, conversiationId: conversiationId}})  
  } catch (error) {
    console.log(new Date() + ": Job is has error" + error);
  }
}

server.post('/api/notification', (req, res) => {
  let content = req.body.content;
  let conversiationId = req.body.conversiationId;
  console.log("\n" + new Date() + "-------------------\n");
  console.log("conversionId: " + conversiationId);
  console.log("Content: " + content);

  let token = "";
  request.post('https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token', {
    form: {
      "grant_type": "client_credentials",
      "client_id": clientSecret.clientId,
      "client_secret": clientSecret.value,
      "scope": "https://api.botframework.com/.default"
    }
  }, function (err, httpResponse, body) {
    // ONE-Home group
    body = JSON.parse(body);
    token = 'Bearer ' + body.access_token;
    console.log("token: " + token);

    data = {
      "type": "message",
      "text": content
    }
    var oneHomeGroup = {
      method: 'POST',
      body: data,
      json: true,
      url: 'https://smba.trafficmanager.net/apis/v3/conversations/' + conversiationId + '/activities/1607959826425',
      headers: {
        'Authorization': token
      }
    };
    request.post(oneHomeGroup, function(err, httpResponse, body) {
    });
    console.log("\n-------------------\n");
    res.send("sent: " + content);
  });
});


