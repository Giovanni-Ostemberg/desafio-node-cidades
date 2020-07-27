import {promises as fs} from "fs";

createStateJson();

async function createStateJson(){
    const states = JSON.parse(await fs.readFile("Estados.json"));
    console.log(states);

    states.forEach(element => {
         createJson(element);
    });
}
async function createJson(element){
    const path = './estados/' + element.Sigla + '.json';
    await fs.writeFile(path, JSON.stringify(element));
}