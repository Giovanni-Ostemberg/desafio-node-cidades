import {promises as fs} from "fs";

var cities = [];
var states = [];
start();

async function start(){
    cities = await createCitiesJson();
    states = await createStateJson();
    states.forEach(element => { prepareJson(cities, element) });

}




async function createStateJson(){ 

    return await JSON.parse(await fs.readFile("Estados.json"));
}

async function createCitiesJson(){
    return await JSON.parse(await fs.readFile("Cidades.json"));
}

async function prepareJson(cities, element){
   
        let citiesByState =  await filterCities(element);
        const path = './estados/' + element.Sigla + '.json';
        await createJson(path, citiesByState);

}

async function filterCities(element){
    console.log(element);
    return await cities.filter(city => {return city.Estado === element.ID;});

}

async function createJson(path, citiesByState){
    //let citiesJson = await JSON.parse(citiesByState);
    return await fs.writeFile(path, JSON.stringify(citiesByState));
}

