import axios from 'axios';
import {load} from 'react-native-cheerio';
import config, {BASE_URL} from '../config/config';
export const scrapeStreamSB = async id => {
  const result = {
    sources: [],
    subtitles: [],
    audio: [],
    intro: {
      start: 0,
      end: 0,
    },
    outro: {
      start: 0,
      end: 0,
    },
    multiLinks: [],
    // headers: this.headers ?? {},
    downloadURL: null,
  };
  try {
    let url = `${BASE_URL}/${id}`;
    const response = await axios.get(url);
    const $ = load(response.data);

    $('div.anime_muti_link > ul > li').each((i, el) => {
      const server = $(el).attr('class');
      const name = $(el)
        .find('a')
        .text()
        ?.toLowerCase()
        ?.replace('choose this server', '')
        ?.trim();
      const link = $(el).find('a').attr('data-video');
      result.multiLinks.push({
        server,
        name,
        link,
      });
    });

    result.downloadURL = $('li.dowloads > a').attr('href');

    const linkURL = `${$(
      'div.anime_video_body > div.anime_muti_link > ul > li.streamwish > a',
    ).attr('data-video')}`;
    // const serverUrl = new URL(server);
    const vIds = await axios.get(linkURL);
    const $$ = load(vIds.data);
    // console.log($$)

    let scriptContent = '';
    $$('script').each(function () {
      const content = $$(this).html();
      if (content.includes('sources')) {
        scriptContent = content;
        return false; // Exit the loop after finding the script with 'sources'
      }
    });

    const srrc = scriptContent
      ?.replaceAll('\n', '')
      ?.replaceAll('\t', '')
      ?.trim();
    let ts = srrc?.match(/sources:(\s*\[{.*}\])/);

    const parsedData = ts[0]?.replace(/\n/g, '')?.replace(/\s+/g, ' ');
    // console.log(parsedData)
    const regex = /file:"([^"]*)"/;

    // Use the regular expression to find the file URL
    const match = parsedData?.match(regex);
    let matchedURL;

    // If a match is found, the URL will be in the second element of the array
    if (match && match.length > 1) {
      const fileUrl = match[1];
      // console.log(fileUrl);
      matchedURL = fileUrl;
    } else {
      // console.log("File URL not found in the text.");
      matchedURL = null;
    }
    const resppp = await axios.get(matchedURL);
    const resolutions = (await resppp.data).match(
      /(RESOLUTION=)(.*)(\s*?)(\s*.*)/g,
    );
    // console.log(resolutions)

    resolutions?.forEach(res => {
      const quality = res?.split('\n')[0]?.split('x')[1]?.split(',')[0];
      const url = matchedURL;
      result.sources.push({
        url: url + '/' + res.split('\n')[1],
        quality: quality + 'p',
        provider: 'streamwish',
      });
    });
    result.sources.push({
      url: matchedURL,
      quality: 'default',
      provider: 'streamwish',
    });

    // result.headers = resppp.headers;
    // result.config = resppp.config;
    // result.status = resppp.status;
    // result.statusText = resppp.statusText;
    // result.request = resppp.request
    return result;
  } catch (err) {
    //   console.log(err);
    result.error = err;
    return result;
    // return { error: err.message };
  }
};
