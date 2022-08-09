const { writeFile } = require('fs').promises;
const { join } = require('path');

require('dotenv').config();

const { promisify } = require('util');

const axios = require('axios');
const blend = require('@mapbox/blend');

const blendPromise = promisify(blend);

const {
  greeting = 'Hello',
  who = 'You',
  width = 400,
  height = 500,
  color = 'Pink',
  size = 100,
} = require('minimist')(process.argv.slice(2));


async function fetchImage(message) {
    
  const response = await axios({
    url: `${process.env.CAT_API}${message}?width=${width}&height=${height}&color${color}&s=${size}`,
    responseType: 'arraybuffer'
  });

  console.log('Received response with status:', response.status);

  return response.data;
}


function bindImages(images) {
  const configurations = images.map((image, index) => ({
    buffer: image,
    x: width * index,
    y: 0
  }));

  return blendPromise(configurations, {
    width: width * images.length,
    height: height,
    format: 'jpeg',
  });
}


async function saveToFile(image) {
  const resultFile = join(process.cwd(), process.env.OUTPUT_FILENAME);
  await writeFile(resultFile, image);
  console.log('The file was saved!');
}

(async () => {
  try {
    const images = await Promise.all([
      fetchImage(greeting),
      fetchImage(who)
    ]);
    const mergedImages = await bindImages(images);
    await saveToFile(mergedImages);
  } catch (error) {
    console.error(error);
  }  
})()