const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');
const fetch = require('node-fetch');

let settings = {method: "Get"};
let items;

function readItemData() {
  fs.readFile('items.json', (err, data) => {
      if (err) throw err;
      items = JSON.parse(data);
      //console.log("Read in " + items.length + " items.")
  });
}

//try {
//	var token = fs.readFileSync('token.txt', 'utf8');
//} catch {
	//error
//}

client.login(config.token);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  readItemData();
});

client.on('message', msg => {
  //dont answer our own messages
  if (msg.author.bot) return;
  //Checking for prefix
  if (msg.content.indexOf(config.prefix) !== 0) return;
  //get input data
  const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  //react to commands
  switch (command) {
    case("ping") :
      msg.reply('Pong!');
      break;
    case("gettest") :
      var url = "https://www.albion-online-data.com/api/v2/stats/prices/T4_BAG@3?locations=FortSterling&qualities=2";
      fetch(url, settings)
      .then(res => res.json())
      .then((json) => {
        msg.channel.send("Price: " + json[0].sell_price_min + " in " + json[0].city);
      });
      break;
  case("get") :
    if(args[0]) {
      var name = args[0];
    } else {
      msg.channel.send("Please enter item name");
    }

    var msgctr = 0;
    var poss = ["Possibilities: "];

    for(let i = 0; i < items.length-1; i++) {
      if(items[i].LocalizedNames) {
        if(items[i].UniqueName === name) {
          //var url = "https://www.albion-online-data.com/api/v2/stats/prices/" + name + "?locations=FortSterling&qualities=0";
          var url = "https://www.albion-online-data.com/api/v2/stats/prices/" + name + "?locations=FortSterling,Lymhurst,Bridgewatch,Martlock,Thetford,Carleon";
          fetch(url, settings)
          .then(res => res.json())
          .then((json) => {
              json.sort(function(a, b) {
                return a.sell_price_min - b.sell_price_min;
              });
              while(json[0].sell_price_min === 0) {
                json.shift();
              }

            msg.channel.send("Price " + name + ": " + json[0].sell_price_min + " in " + json[0].city);
          });
          msgctr = -1;
          break;
        } else if (items[i].LocalizedNames["EN-US"].toLowerCase().indexOf(name.toLowerCase()) !== -1) {
            if(poss[msgctr].length > 1850) {
              msgctr++;
              poss[msgctr] = items[i].UniqueName + "\n";
            } else {
              poss[msgctr] += items[i].UniqueName + "\n";
            }
          }
        }
      }

    if(poss[0].length > 15) {
      for(let i = 0; i <= msgctr; i++) {
    	  msg.channel.send(poss[i]);
      }
    }

    break;
  }
});
