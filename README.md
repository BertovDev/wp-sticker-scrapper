# wp-sticker-scrapper
Stickers scrapper for Whatsapp Web and Android

Search and save the stickers in png or webp format of any whatsapp group you are part of.

Requirements:
- Install adb `sudo apt install adb`
- Connect you phone to the computer

- Create a folder called `upload` in the root directory to store the stickers.
- In `information.json` change `group_name` with the group name you would like to search for stickers.

- `const LIMIT_MESSAGES_TO_SCRAPP = 1000; // replace it with the amount of messages you want to read`

- run `npm run start` and a QR code will be displayed in the console, link your session and wait it to be ready to download the stickers.
- run `python transferImages.py` to create a folder and transfer all the images to your phone.

- Use a sticker app to import the whole folder of stickers to whatsapp.

Todo:
- Autoimport stickers to a wp sticker package -- Any sugestion?


Disclaimer
I created this because I am in multiple whatsapp group that I do not care what they talk but I want their stickers 😎🤙
