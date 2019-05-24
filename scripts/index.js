import '@babel/polyfill'
import download from './downloader'
import inquirer from 'inquirer'
import emojic from 'emojic'
import search from './search'

const message = 'Good day.\nWelcome to Read Comics Downloader\nThanks for using my package'
console.log(message)

inquirer.prompt([
    {
        type: 'list',
        name: 'action',
        messsage: 'What will you like to do today',
        choices: [
            'Download comic from a url',
            'Download a set of comics',
            'Search for a comic and download it'
        ]
    }
]).then(async answers => {
    const { action } = answers
    if(action === 'Download a set of comics'){
        console.log('The feature is coming soon watch this space ' + emojic.grin)
    }else if(action == 'Search for a comic and download it'){
        const answers = await inquirer.prompt({
            name: 'name',
            message: 'Enter name of comic:'
        })
        const url = await search(answers.name)
        download(url)
    }else{
        const { url } = await inquirer.prompt({
            type: 'input',
            name: 'url',
            message: 'Input the url please (Hint: Right click to paste)'
        })
        download(url)
    }
})