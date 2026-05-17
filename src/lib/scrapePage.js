const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const allPosts = [];

async function scrapePage(url) {
  console.log(`読み込み中: ${url}`);
  
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    $('.black-text-left ul.list li').each((_, el) => {
      const anchor = $(el).find('a');
      const fullUrl = anchor.attr('href');
      const title = anchor.text();

      const match = fullUrl.match(/\/blog\/((?:\d{4})\/(?:\d{2})\/post-(\d+)\/)/);
      if (match) {
        const path = match[1];
        const id = match[2];

        const rawDate = $(el).text().match(/\((\d{2})\/(\d{2})\/(\d{2})\)/);
        const date = rawDate ? `20${rawDate[1]}-${rawDate[2]}-${rawDate[3]}` : "";

        allPosts.push({ id, title, date, path });
      }
    });

    const nextButton = $('a.next.page-numbers');
    const nextUrl = nextButton.attr('href');

    if (nextUrl) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await scrapePage(nextUrl);
    } else {
      console.log('完了しました');
      console.log(`合計 ${allPosts.length} 件の記事を保存します。`);
      fs.writeFileSync('posts.json', JSON.stringify(allPosts, null, 2));
    }

  } catch (error) {
    console.error(`エラーが発生しました（URL: ${url}）:`, error.message);
    fs.writeFileSync('posts.json', JSON.stringify(allPosts, null, 2));
  }
}

const startUrl = 'https://sanson.urugi.jp/blog/';
scrapePage(startUrl);