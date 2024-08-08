const { Console } = require("console");
const fs = require("fs");
const { env } = require("process");
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

const data = JSON.parse(fs.readFileSync("information.json"));
const GROUP_TO_SCRAPP = data.group_name;

const LIMIT_MESSAGES_TO_SCRAPP = 1000;

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

const getMessagesWithMedia = (messages) => {
  if (!messages) {
    console.error("Group not found");
    return [];
  }
  return messages.filter((message) => message.hasMedia);
};

const saveMedia = (el, media) => {
  const mediaName = "media " + el.id.id.slice(0, 5);
  fs.writeFile(
    "./upload/" + mediaName + ".png", // remove .png to save them in webp format
    media.data,
    "base64",
    function (data) {
      console.log("Downloading " + mediaName);
    },
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
};

const downloadAndSaveStickers = async (messages) => {
  getMessagesWithMedia(messages).forEach(async (msg) => {
    const media = await msg.downloadMedia();
    //only save stickers
    if (media !== undefined) {
      if (media.mimetype === "image/webp") {
        saveMedia(msg, media);
      }
    }
  });
};

client.on("ready", async () => {
  console.log("client is ready");
  const groupChats = await getChats();
  const group = groupChats.filter((chat) => chat.name === GROUP_TO_SCRAPP);

  const messages = await group[0]?.fetchMessages({
    limit: LIMIT_MESSAGES_TO_SCRAPP,
  });

  await downloadAndSaveStickers(messages);
});

client.initialize();
