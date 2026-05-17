const { XMLParser } = require('fast-xml-parser');

async function handleSearch(query) {
  if (!query) {
    return { status: 200, data: [] };
  }

  try {
    const targetUrl = `https://sanson.urugi.jp/blog/?s=${encodeURIComponent(query)}&feed=rss2`;

    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`WordPress API returned status: ${response.status}`);
    }

    const xmlText = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      removeNSPrefix: true,
    });
    const jsonObj = parser.parse(xmlText);

    const channel = jsonObj?.rss?.channel;
    const rawItems = channel?.item;

    let itemsArray = [];
    if (Array.isArray(rawItems)) {
      itemsArray = rawItems;
    } else if (rawItems) {
      itemsArray = [rawItems];
    }

    // 必要なプロパティ（id, date, title）のみに絞り込んで配列を生成
    const posts = itemsArray.map(function (item) {
      let formattedDate = '';
      if (item.pubDate) {
        const d = new Date(item.pubDate);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toISOString().split('T')[0];
        }
      }

      let postId = '';
      if (item.link) {
        const pMatch = item.link.match(/p=(\d+)/);
        const idMatch = item.link.match(/post-(\d+)/);

        if (pMatch) {
          postId = pMatch[1];
        } else if (idMatch) {
          postId = idMatch[1];
        } else {
          const genericMatch = item.link.match(/(\d+)\/?$/);
          postId = genericMatch ? genericMatch[1] : encodeURIComponent(item.link);
        }
      } else {
        postId = Math.random().toString();
      }

      return {
        id: postId,
        date: formattedDate,
        title: item.title || ''
      };
    });

  } catch (error) {
    console.error('検索APIエラー:', error);
    return {
      status: 500,
      data: { error: '検索結果の取得に失敗しました' }
    };
  }
}

module.exports = { handleSearch };