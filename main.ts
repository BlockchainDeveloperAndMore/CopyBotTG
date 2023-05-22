import { Telegraf, Context } from 'telegraf';
import axios from 'axios';

// Здесь необходимо вставить токен вашего бота
const botToken = `TOKEN`;

// Здесь необходимо указать ID двух каналов
const channel1Id = -1001334934580;
const channel2Id = -1001763525815;

// Создание экземпляра бота
const bot = new Telegraf(botToken);

const delay = 900000 // 900000 - 15 min
const editTime = 60000; // 1 min
var timeCheck: number = 0;

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

    let channelPost: any = [];
    for (let i = 0; i < result.length; i++) {
        if (result[i].channel_post) {
            channelPost.push(result[i].channel_post);
        }
        if (result[i].edited_channel_post) {
            channelPost.push(result[i].edited_channel_post);
        }
    }

    channelPost.sort((a: any, b: any) => a.date - b.date);

        for (let n = 0; n <= channelPost.length - 1; n++) {
                      
            if (channelPost[n].chat.id == channel1Id && channelPost[n].date > timeCheck) {
                if(channelPost[n].media_group_id) {
                    if(mediaGroupId != channelPost[n].media_group_id) {      
                        mediaGroupId = channelPost[n].media_group_id;

                        if(tempMedia.length != 0) {
                            readyMedia.splice(readyMedia.length, 1, tempMedia);
                            tempMedia = [];                                
                        }
                    }

                    let newMedia = {
                        type: "photo",
                        media: channelPost[n].photo[0].file_id,
                        caption: channelPost[n].caption,
                        caption_entities: channelPost[n].caption_entities,
                    }

                    if(channelPost[n].edit_date !== undefined && channelPost[n].edit_date > editDate){
                        tempMedia.pop();
                        tempMedia.push(newMedia);

                        editDate = channelPost[n].edit_date
                    } else {
                        tempMedia.push(newMedia);
                    }

                } else {
                    
                    if(tempMedia.length != 0) {
                        readyMedia.splice(readyMedia.length, 1, tempMedia);
                        tempMedia = [];
                    }

                    if(channelPost[n].edit_date !== undefined && channelPost[n].edit_date > editDate){
                        readyMedia.pop();
                        readyMedia.push(channelPost[n].message_id);

                        editDate = channelPost[n].edit_date
                    } else {
                        readyMedia.push(channelPost[n].message_id);
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
    while (true) {
        let resultLength = await result();
        let readyMedia: any[][] = await update();
        timeCheck = Date.now();
        console.log(`timeCheck = ${timeCheck}`)
            if (resultLength == 0){
                console.log(`Постов ещё нет, перезапуск через 1 минуту!`)
                await sleep(editTime);
            } else {
                runBot().catch(err => console.error(err));
                await copyMessages(readyMedia);
                console.log(`Автопостинг завершён!`)
            }
    }
}

main();