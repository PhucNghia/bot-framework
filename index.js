const request = require('request');
var schedule = require('node-schedule');
const restify = require('restify');
const botbuilder = require('botbuilder');

const conversiationScheduleId = '19:ceb3d4c7ea254528b50769ec922a8e72@thread.skype'; // Pet for schedule (STC - Chém gió)
const CAP_NHAT_BAO_CAO_TUAN_GROUP_ID = 'xxx'; // Id của group Cập nhật Báo Cáo Tuần
const MOBILE_TEAM_GROUP_ID = '19:c79c6819227c48f185873e16d2aa4ec2@thread.skype'; // Id của group Mobile Team

// Pet
var clientSecret = {
  clientId: "c3a25c8a-6019-40d5-a548-3f7a31f75415",
  secretId: "e05fe993-f0a0-4414-817f-047b253fedd8", // ko dung
  value: "Td-8Q~MbbX2YufJBXOUZ9Y.McUNqNRrhQwA13bQ0"
};


// Pet
var adapter = new botbuilder.BotFrameworkAdapter({
  appId: clientSecret.clientId,
  appPassword: clientSecret.value
});

// Create HTTP server
let server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 6060, function () {
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
          if(req.params.from.name.includes("Đặng Quí Long") || req.params.from.name.includes("Bui Minh Yen")) {
            await turnContext.sendActivity("Hê's lô phó's lãnh đạo " + `${ req.params.from.name } (happyeyes)`);  
          } else if(req.params.from.name.includes("Trung Nguyen")) {
            await turnContext.sendActivity("Hê's lô sếp " + `${ req.params.from.name } (happyeyes)`);  
          } else {
            await turnContext.sendActivity("Hê's lô bạn " + `${ req.params.from.name } (happyeyes)`);
          }
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
  res.send("Hello");
});

var cronExpressMorning = '0 00 09 * * THU';
var cronExpressAfternoon = '0 00 16 * * THU';
var cronExpressFinalOfWeek = '0 15 08 * * FRI';         // log work
var cronExpressDailyMorning = '00 30 08 * * MON-FRI';   // cập nhật covid
var cronExpressDailyAftenoon = '00 30 15 * * MON-FRI';  // cập nhật covid
var cronExpressDailyAftenoon2 = '00 10 16 * * MON-FRI';  // cập nhật covid
var cronExpressDailyexercise = '00 00 17 * * MON-FRI';  // tập thể dục
var cronExpressDailyMeeting = '00 45 16 * * MON-FRI';  // daily meeting one home
var cronExpress = '*/10 * * * * * *';  // 15s chạy 1 lần

// schedule.scheduleJob(cronExpress, function(fireDate) {
//   let content = "test";
//   processJob(content);
//   console.log("send content is empty: " + fireDate);
// });
schedule.scheduleJob(cronExpressFinalOfWeek, function(fireDate) {
  let content = "Hôm nay là thứ 6 rồi. Cả nhà log work nhé\n(tropicalfish)(tropicalfish)(tropicalfish)";
  processJob(content, conversiationScheduleId);

  console.log("run schedule morning: " + fireDate);
});

schedule.scheduleJob(cronExpressDailyMeeting, function(fireDate) {
  let content = "Mọi người cập nhật trạng thái công việc ngày hôm nay nhé\nhttps://docs.google.com/spreadsheets/d/1yvAJp93nd6WdTkCMnQ0ZQRBZew2gmxL0hbPfWtT0Io4/edit#gid=1198474019";
  processJob(content, MOBILE_TEAM_GROUP_ID);

  console.log("run schedule morning: " + fireDate);
});


// schedule.scheduleJob(cronExpressAfternoon, function(fireDate) {
//   let content = "Sắp tới giờ về rồi. Cả nhà đừng quên log work nhé (dolphin)";
//   processJob(content, conversiationScheduleId);
//   console.log("run schedule afternoon: " + fireDate);
// });

// schedule.scheduleJob(cronExpressFinalOfWeek, function(fireDate) {
//   let content = "Còn ai chưa log work thì tranh thủ log luôn đi nhé (unicorn)";
//   processJob(content, conversiationScheduleId);
//   console.log("run schedule thriday's morning: " + fireDate);
// });

// schedule.scheduleJob(cronExpressDailyMorning, function(fireDate) {
//   let day = new Date().getDay();
//   let monthDay = day == 1 ? " T7, CN và " : " ";
//   let content = "ACE cập nhật link covid ngày" + monthDay + "hôm nay nhé \n https://docs.google.com/spreadsheets/d/1lDGO7zbNfFQU7RClmzFORsWRWM4L9RDeTd7vl2-QHco/edit#gid=0";
//   processJob(content, conversiationScheduleId);
//   console.log("run schedule daily: " + fireDate);
// });

// schedule.scheduleJob(cronExpressDailyAftenoon, function(fireDate) {
//   let content = "ACE ai chưa cập nhật link covid thì cập nhật nhé \n https://docs.google.com/spreadsheets/d/1lDGO7zbNfFQU7RClmzFORsWRWM4L9RDeTd7vl2-QHco/edit#gid=0";
//   processJob(content, conversiationScheduleId);
//   console.log("run schedule daily: " + fireDate);
// });

// schedule.scheduleJob(cronExpressDailyAftenoon2, function(fireDate) {
//   let content = "ACE ai chưa cập nhật link covid thì cập nhật nhé \n https://docs.google.com/spreadsheets/d/1lDGO7zbNfFQU7RClmzFORsWRWM4L9RDeTd7vl2-QHco/edit#gid=0";
//   processJob(content, conversiationScheduleId);
//   console.log("run schedule daily: " + fireDate);
// });

// schedule.scheduleJob(cronExpressDailyexercise, function(fireDate) {
//   let content = "Đã tới giờ tập thể dục rồi, ACE hãy nhấc mông dậy tập để nâng cao sức khỏe, đẩy lùi covid nhé (xd)";
//   processJob(content, conversiationScheduleId);
//   console.log("run exercise daily: " + fireDate);
// });

var processJob = function(content, conversiationId) {
  try {
    request.post('http://localhost:6060/api/notification', {form: {content: content, conversiationId: conversiationId}})  
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
