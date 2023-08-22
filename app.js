const fs = require("fs");
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

const groupToScrapp = "group name";

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

const getChats = async () => {
  const chats = await client.getChats();
  return chats.filter((chat) => chat.isGroup);
};

client.on("ready", async () => {
  console.log("client is ready");
  const groupChats = await getChats();
  const group = groupChats.filter((chat) => chat.name === groupToScrapp);
  console.log(JSON.stringify(group));
  const messages = await group[0].fetchMessages(200, true);
  messages.forEach(async (el, i) => {
    // console.log(el.mediaKey);
    // console.log(el.type);
    if (el.hasMedia) {
      const media = await el.downloadMedia();
      //   console.log(media.mediak);
      if (media.mimetype === "image/webp") {
        fs.writeFile(
          "./upload/" + "media " + i,
          media.data,
          "base64",
          function (data) {
            const filename =
              media.filename !== undefined ? media.filename : "Media " + i;
            console.log("Downloading" + filename);
          },
          function (err) {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    }
  });
});

client.initialize();
