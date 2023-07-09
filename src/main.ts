//https://www.avito.ru/moskva/telefony/aksessuari/garnitury_i_naushniki-ASgBAgICAkTAB_pNsMENjvw3?p=3&q=airtag

import axios from 'axios';
import jsdom from 'jsdom';
import db, { Ad, Collection } from './helpers/database.js';
import { compareCollections, getDigitsOnly, pause } from './helpers/utils.js';
import { CronJob } from 'cron'
const { JSDOM } = jsdom;

let count = 0

 new CronJob(
  '*/55 * * * * *',
    function() {
        console.log('я працую N', count++);

        (async () => {
          await pause(500);
          let html: string;
          try {
            const resp = await axios.get(
              // 'https://www.olx.pl/d/nieruchomosci/mieszkania/wynajem/warszawa/?search%5Border%5D=created_at:desc',
              'https://www.olx.pl/nieruchomosci/mieszkania/wynajem/warszawa/?search%5Bfilter_float_price:to%5D=1700&search%5Bfilter_float_m:from%5D=20'
            );

            html = resp.data;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.log('errorAxios', error);
            } else {
              console.log('error', error);
            }
          }

          const dom = new JSDOM(html);

          const document = dom.window.document;

          const items = document.querySelectorAll('[data-cy=l-card]');
          const newArrayItems = Array.from(items).filter(
            (item) => !item.querySelector('[data-testid=adCard-featured]'),
          );
          console.log(newArrayItems.length);

          const newAds: Collection<Ad> = {};

          newArrayItems.forEach((node) => {
            const href = node.querySelector('.css-rc5s2u').getAttribute('href');

            const hrefArr = href.split('-');
            const id = hrefArr[hrefArr.length - 1].slice(0, -5);
              // console.log('node.query11111', node.querySelector('[data-testid="ad-price"]').textContent)
             newAds[id] = {
              id: id,
              url: node.querySelector('.css-rc5s2u').getAttribute('href'),

              price: getDigitsOnly(node.querySelector('[data-testid="ad-price"]').textContent),

              title: node.querySelector('.css-16v5mdi.er34gjf0').textContent,
              // url:'url',
              // price: 5,
              // title:'title',
            };

          });
          // console.log('ffff', newAds)
          const saveAds = await db.getSavedAds();

          const newIds = compareCollections(saveAds, newAds);

          for (const id of newIds) {
            await db.setNewAdd(newAds[id]);
            await pause(500);
          }

          console.log('newIds', newIds);

        })();
    },
    null,
    true,
    'America/Los_Angeles'
);
// console.log("job", job)






// console.log("gggggggggg")
// for (let i = 0; i < 15; i++) {
//   (async () => {
//     await pause(500);
//     let html: string;
//     try {
//       const resp = await axios.get(
//         'https://www.olx.pl/d/nieruchomosci/mieszkania/wynajem/warszawa/?search%5Border%5D=created_at:desc',
//       );

//       html = resp.data;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.log('errorAxios', error);
//       } else {
//         console.log('error', error);
//       }
//     }

//     const dom = new JSDOM(html);

//     const document = dom.window.document;

//     const items = document.querySelectorAll('[data-cy=l-card]');
//     const newArrayItems = Array.from(items).filter(
//       (item) => !item.querySelector('[data-testid=adCard-featured]'),
//     );
//     console.log(newArrayItems.length);

//     const newAds: Collection<Ad> = {};

//     newArrayItems.forEach((node) => {
//       const href = node.querySelector('.css-rc5s2u').getAttribute('href');

//       const hrefArr = href.split('-');
//       const id = hrefArr[hrefArr.length - 1].slice(0, -5);
//         console.log('node.query11111', node.querySelector('[data-testid="ad-price"]').textContent)
//        newAds[id] = {
//         id: id,
//         url: node.querySelector('.css-rc5s2u').getAttribute('href'),

//         price: getDigitsOnly(node.querySelector('[data-testid="ad-price"]').textContent),

//         title: node.querySelector('.css-16v5mdi.er34gjf0').textContent,
//         // url:'url',
//         // price: 5,
//         // title:'title',
//       };

//     });
//     // console.log('ffff', newAds)
//     const saveAds = await db.getSavedAds();

//     const newIds = compareCollections(saveAds, newAds);

//     for (const id of newIds) {
//       await db.setNewAdd(newAds[id]);
//       await pause(500);
//     }

//     console.log('newIds', newIds);

//   })();
//   count = count+1
//   console.log("count",count)
//   await pause(30000);
// }
