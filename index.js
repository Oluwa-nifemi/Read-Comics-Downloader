const rp = require('request-promise')
const cheerio = require('cheerio')
const downloader = require('image-downloader')
const fs = require('fs')
const imagetopdf = require('images-to-pdf')

const options = {
    url: 'https://read-comic.com/justice-league-015/',
    transform: body => cheerio.load(body)
} 

let title,length;
const images = [];


rp(options)
    .then($ => {
        title = $('.pinbin-copy h1')[0].children[0].data
        const images = $('.separator img');
        title = title.split('…')[0].trim();
        console.log(`You're downloading ${title}\nIt is ${images.length} pages long\nSit back and enjoy`)
        const links = []
        // images.length = 2
        length = images.length
        for(let i = 0;i < images.length;i++){
            links.push(images[i].attribs.src)
        }
        try{
            fs.mkdirSync(`./images/${title}`)
        }catch(err){
        }
        downloadImages(links,title)
    })

const downloadImages = async (links,title,i = 1) => {
    const url = links.shift()
    const options = {
        url,
        dest: `./images/${title}/${i}.jpg`
    }
    const { filename } = await downloader.image(options)
    console.log(`Page ${i} downloaded`)
    images.push(filename)
    if(i === length){
        await imagetopdf(images,`./${title}.pdf`)
        //Tentative I'll save on Desktop or Downloads when it becomes a command line tool sha
        console.log(`Your file is ready.It's named ${title}.pdf you can find it in the same folder as this package`) 
        return
    }else{
        downloadImages(links,title,i + 1)
    }
}

const promiseRead = (path, options) => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, options, (error, data) => {
        error ? reject(error) : resolve(data);
        });
    })
}
