import '@babel/polyfill'
import rp from 'request-promise'
import cheerio from 'cheerio'
import downloader from 'image-downloader'
import fs from 'fs'
import imagetopdf from 'images-to-pdf'

let title,length;
const images = [];

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

const download = (url) => {
    const options = {
        url,
        transform: body => cheerio.load(body)
    }
    console.log('Accessing site')
    rp(options)
    .then($ => {
        title = $('.pinbin-copy h1')[0].children[0].data
        const images = $('.pinbin-copy img');
        title = title.split('…')[0].trim();
        console.log(`You're downloading ${title}\nIt is ${images.length} pages long\nSit back and enjoy`)
        const links = []
        length = images.length
        for(let i = 1;i < images.length - 1;i++){
            links.push(images[i].attribs.src)
        }
        try{
            fs.mkdirSync(`./images/${title}`)
        }catch(err){
        }
        downloadImages(links,title)
    })
}

export default download