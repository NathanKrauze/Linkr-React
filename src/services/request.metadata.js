import urlMetadata from "url-metadata";


export async function urlMeta (urlPost) {
    const options = {
        requestHeaders: {
          'User-Agent': 'url-metadata/3.0 (npm module)',
          'From': 'example@example.com',
        },
        cache: 'no-cache',
        mode: 'no-cors',
        timeout: 10000,
        descriptionLength: 750,
        ensureSecureImageRequest: true,
        includeResponseBody: false
      };

    try {
      const metadata = await urlMetadata(urlPost,options);
      console.log('fetched metadata:', metadata)
      
    } catch(err) {
      console.log('fetch error:', err);
    }
  };