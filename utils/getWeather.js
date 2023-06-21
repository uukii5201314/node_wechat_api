const axios = require('axios');
async function  getWeather(key, location) {
    const result = await axios.get(`https://devapi.qweather.com/v7/weather/now?location=${location}&key=${key}`);
    //console.log(result);
    return result.data
}
// getWeather(key, location);
module.exports = getWeather;