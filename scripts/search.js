import '@babel/polyfill'
import rp from 'request-promise'
import cheerio from 'cheerio'
import inquirer from 'inquirer'

const linkToObject = []

const search = async (name) => {
    const url = 'https://read-comic.com/?s=' + encodeURI(name)
    const options = {
        url,
        transform: body => cheerio.load(body)
    }
    console.log('Searching')
    return rp(options)
        .then($ => {
            const links = $('.post a.front-link')
            for(let i = 0;i < links.length;i++){
                const name = links[i].children[0].data.split('…')[0].trim()
                const link = links[i].attribs.href
                linkToObject.push({name,link})
            }
            const choices = linkToObject.reduce((acc,curr) => {
                acc.push(curr.name)
                return acc
            },[])
            return inquirer.prompt({
                type: 'list',
                name: 'selected',
                message: 'Select one\n Search results:',
                choices
            })
        })
        .then(({selected}) => linkToObject.find(e => e.name === selected).link)
}

export default search