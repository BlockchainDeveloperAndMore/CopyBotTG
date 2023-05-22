import { Telegraf, Context } from 'telegraf';
import axios from 'axios';

// Здесь необходимо вставить токен вашего бота
const botToken = `5999615892:AAH7UDJgTS_w_-msOIUUanFzpSd8d3CMo8M`;

// Здесь необходимо указать ID двух каналов
const channel1Id = -1001590839912;
const channel2Id = -1001524532739;

// Создание экземпляра бота
const bot = new Telegraf(botToken);

const delay = 5000 // 900000 - 15 min

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runBot() {
    // Запуск бота
    bot.launch();
    console.log('Бот запущен');
  
    // Ожидание некоторого времени
    await sleep(5000);
  
    // Остановка бота
    await bot.stop(); 
    console.log('Бот остановлен');
}

// Функция для пересылки сообщений из канала №1 в канал №2
async function copyMessages(readyMediaCopyMessages: any[]) {
    for (let i = 1; i <= readyMediaCopyMessages.length - 1; i++) {
        await sleep(delay);
        let cell = readyMediaCopyMessages[i];

        if (typeof cell === "number") {

        const response = await axios.post(`https://api.telegram.org/bot${botToken}/copyMessage`, {
            chat_id: channel2Id,
            from_chat_id: channel1Id,
            message_id: readyMediaCopyMessages[i],
        });

        } else {  
            const response = await axios.post(`https://api.telegram.org/bot${botToken}/sendMediaGroup`, {
                chat_id: channel2Id,
                media: readyMediaCopyMessages[i],
            });
        }
        
    }

}

async function result(): Promise< any > {
    const response = await axios.post(`https://api.telegram.org/bot${botToken}/getUpdates`);
    const result = response.data.result;
    return result.length
}

// Функция для пересылки сообщений из канала №1 в канал №2
async function update(): Promise < any[][] > {
    let mediaGroupId: string = "0";
    let readyMedia: any[][] = [[0]];
    let tempMedia: any[] = [];
    let editDate = 0;

    const response = await axios.post(`https://api.telegram.org/bot${botToken}/getUpdates`);
    const result = response.data.result;

    if (result.length == 0) {
        return readyMedia
    }

        for (let n = 0; n <= result.length - 1; n++) {

            let channelPost = result[n].channel_post !== undefined ? result[n].channel_post : result[n].edited_channel_post;

            if (channelPost.chat.id == channel1Id) {
                if(channelPost.media_group_id) {
                    if(mediaGroupId != channelPost.media_group_id) {      
                        mediaGroupId = channelPost.media_group_id;
                        if(tempMedia.length != 0) {
                            readyMedia.splice(readyMedia.length, 1, tempMedia);
                            tempMedia = [];                                
                        }
                    }

                    let newMedia = {
                        type: "photo",
                        media: channelPost.photo[0].file_id,
                        caption: channelPost.caption,
                        caption_entities: channelPost.caption_entities,
                    }

                    if(channelPost.edit_date !== undefined && channelPost.edit_date > editDate){
                        tempMedia.pop();
                        tempMedia.push(newMedia);

                        editDate = channelPost.edit_date
                    } else {
                        tempMedia.push(newMedia);
                    }

                } else {
                    
                    if(tempMedia.length != 0) {
                        readyMedia.splice(readyMedia.length, 1, tempMedia);
                        tempMedia = [];
                    }

                    if(channelPost.edit_date !== undefined && channelPost.edit_date > editDate){
                        readyMedia.pop();
                        readyMedia.push(channelPost.message_id);

                        editDate = channelPost.edit_date
                    } else {
                        readyMedia.push(channelPost.message_id);
                    }
                }

            }       
        }

        if(tempMedia.length != 0) {
            readyMedia.splice(readyMedia.length, 1, tempMedia);
            tempMedia = [];
        }

    return readyMedia
}

async function main() {
    while (true){
        let resultLength = await result();
        let readyMedia: any[][] = await update();
            if (resultLength == 0){
                console.log(`Постов ещё нет, перезапуск через 1 минуту!`)
            } else {
                runBot().catch(err => console.error(err));
                await copyMessages(readyMedia);
                console.log(`Автопостинг завершён!`)
            }
        await sleep(5000);
    }
}

main();