const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

async function getPostDetail(id) {
  try {
    const filePath = path.join(process.cwd(), 'posts.json');
    if (!fs.existsSync(filePath)) {
      return { status: 500, message: 'posts.json が見つかりません。' };
    }
    
    const allPosts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const postMeta = allPosts.find(p => p.id === id);
    
    if (!postMeta) {
      return { status: 404, message: '指定された記事が見つかりません' };
    }

    const targetUrl = `https://sanson.urugi.jp/blog/${postMeta.path}`;
    const { data } = await axios.get(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      timeout: 5000 
    });
    const $ = cheerio.load(data);

    const entryBox = $('.entry-box');
    if (entryBox.length === 0) {
      return { status: 500, message: 'ブログ本文の解析に失敗しました' };
    }

    let lastChild = entryBox.children().last();
    while (lastChild.length > 0 && lastChild.is('p') && lastChild.text().trim() === '' && lastChild.find('img').length === 0) {
      const prev = lastChild.prev();
      lastChild.remove();
      lastChild = prev;
    }

    const cleanElements = [];

    entryBox.find('p, img').each((_, el) => {
      if (el.name === 'img') {
        let src = el.attribs.src;
        if (src && src.startsWith('/')) {
          src = `https://sanson.urugi.jp${src}`;
        }
        cleanElements.push(`<img src="${src}">`);

      } else if (el.name === 'p') {
        const $el = $(el);
        if ($el.text().trim() !== '' || $el.find('img').length > 0) {
          $el.removeAttr('class').removeAttr('style');
          cleanElements.push($el.toString());
        }
      }
    });

    const contentHtml = cleanElements.join('');
    const dateText = $('.date').text().trim() || postMeta.date;

    return {
      status: 200,
      data: {
        id: postMeta.id,
        title: postMeta.title,
        date: dateText,
        content: contentHtml
      }
    };

  } catch (error) {
    console.error(`スクレイピングエラー [ID: ${id}]:`, error.message);
    return { status: 500, message: '公式ブログからデータを取得できませんでした' };
  }
}

async function getPostImageStream(id) {
  try {
    const filePath = path.join(process.cwd(), 'posts.json');
    if (!fs.existsSync(filePath)) {
      return { status: 500, message: 'posts.json が見つかりません。' };
    }
    
    const allPosts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const postMeta = allPosts.find(p => p.id === id);
    
    if (!postMeta) {
      return { status: 404, message: '指定された記事が見つかりません' };
    }

    const targetUrl = `https://sanson.urugi.jp/blog/${postMeta.path}`;
    const { data } = await axios.get(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      timeout: 5000 
    });
    const $ = cheerio.load(data);

    const entryBox = $('.entry-box');
    if (entryBox.length === 0) {
      return { status: 500, message: 'ブログ本文の解析に失敗しました' };
    }

    const imageUrls = [];
    entryBox.find('img').each((_, el) => {
      let src = el.attribs.src;
      if (src) {
        if (src.startsWith('/')) {
          src = `https://sanson.urugi.jp${src}`;
        }
        imageUrls.push(src);
      }
    });

    return {
      status: 200,
      data: {
        id: postMeta.id,
        title: postMeta.title,
        images: imageUrls,
      }
    };

  } catch (error) {
    console.error(`ストリーム取得エラー [ID: ${id}]:`, error.message);
    return { status: 500, message: '画像ストリームの取得に失敗しました' };
  }
}

module.exports = { getPostDetail, getPostImageStream };