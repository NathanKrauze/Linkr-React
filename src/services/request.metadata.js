
import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function getTitleFromUrl(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const pageTitle = $('title').text();
        return pageTitle;
    } catch (error) {
        console.error('Erro ao buscar a página:', error);
        return false;
    }
}