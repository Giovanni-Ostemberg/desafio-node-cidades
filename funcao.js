import { promises as fs } from 'fs';
import readline from 'readline';
import { Console } from 'console';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

var cities = [];
var states = [];
start();

async function start() {
  cities = await createCitiesJson();
  states = await createStateJson();
  for (let element of states) {
    prepareJson(cities, element);
  }
  for await (const line of rl) {
    numberOfCities();
  }
  await orderByNumberOfCities();
  await longestNameCities();
}

async function createStateJson() {
  return await JSON.parse(await fs.readFile('Estados.json'));
}

async function createCitiesJson() {
  return await JSON.parse(await fs.readFile('Cidades.json'));
}

async function prepareJson(cities, element) {
  let citiesByState = await filterCities(element);
  const path = './estados/' + element.Sigla + '.json';
  await createJson(path, citiesByState);
}

async function filterCities(element) {
  return await cities.filter((city) => {
    return city.Estado === element.ID;
  });
}

async function createJson(path, citiesByState) {
  //let citiesJson = await JSON.parse(citiesByState);
  return await fs.writeFile(path, JSON.stringify(citiesByState));
}

async function numberOfCities() {
  rl.question('UF desejada: ', async (uf) => {
    const stateUf = await questionUF(uf);

    let state = await findStateByUf(stateUf);
    let number = await countNumberOfCities(state);
    rl.close();
    console.log('Número de cidades para o estado ' + stateUf.toUpperCase() + ': ' + number);
  });
}

async function questionUF(uf) {
  return uf.toUpperCase();
}

async function findStateByUf(uf) {
  let pathState = './estados/' + uf.toUpperCase() + '.json';
  let state = await fs.readFile(pathState);
  return await JSON.parse(state);
}

async function countNumberOfCities(state) {
  let number = 0;
  for (let city of state) {
    number++;
  }
  /*let number = state.reduce((acc, curr) => {
    return acc + 1;
  }, 0);*/
  return number;
}

async function orderByNumberOfCities() {
  const stateXcities = await mountOrderedArray();
  return stateXcities;
}

async function mountOrderedArray() {
  let mountOrderedArray = [];
  let mountInverseOrderedArray = [];
  let numberOfCities = 0;

  mountOrderedArray = (await mountArray()).sort((a, b) => {
    return b.Cidades - a.Cidades;
  });

  mountInverseOrderedArray = mountOrderedArray.slice(22, 27).sort((a, b) => {
    return b.Cidades - a.Cidades;
  });

  console.log('Mais cidades:\n', mountOrderedArray.slice(0, 5));
  console.log('\n\nMenos cidades:\n', mountInverseOrderedArray);

  return mountOrderedArray;
}

async function mountArray() {
  let array = [];
  for (let element of states) {
    let state = await findStateByUf(element.Sigla);
    let number = await countNumberOfCities(state);
    array.push({ Sigla: element.Sigla, Cidades: number });
  }
  return array;
}

async function longestNameCities() {
  let longestNameOfAll = '';
  let longestNameOfAllState = '';

  let shortestNameOfAll = '';
  let shortestNameOfAllState = '';

  let arrayLongestName = [];
  let arrayShortestName = [];

  for (let currentState of states) {
    let state = await findStateByUf(currentState.Sigla);
    let longestName = await findLongestName(state);
    arrayLongestName.push(longestName + ' - ' + currentState.Sigla);
    if (longestName.length >= longestNameOfAll.length) {
      if (longestNameOfAll <= longestName.length) {
        if (longestName.length === longestNameOfAll.length && longestName.localeCompare(longestNameOfAll) == 1) {
          longestNameOfAll = longestName;
        } else {
          if (longestName.length < longestNameOfAll.length || longestName === '') {
            longestNameOfAll = longestName;
          }
        }
      }
      longestNameOfAll = longestName;
      longestNameOfAllState = currentState.Sigla;
    }
  }

  for (let currentState of states) {
    let state = await findStateByUf(currentState.Sigla);
    let shortestName = await findShortestName(state);
    arrayShortestName.push(shortestName + ' - ' + currentState.Sigla);

    if (shortestName.length <= shortestNameOfAll.length || shortestNameOfAll === '') {
      if (shortestName.length === shortestNameOfAll.length && shortestName.localeCompare(shortestNameOfAll) === -1) {
        shortestNameOfAll = shortestName;
        shortestNameOfAllState = currentState.Sigla;
      }
      if (shortestName.length !== shortestNameOfAll.length) {
        shortestNameOfAll = shortestName;
        shortestNameOfAllState = currentState.Sigla;
      }
    }
  }

  console.log('\n\nNomes mais longos:\n', arrayLongestName);

  console.log('\n\nNomes mais curtos:\n', arrayShortestName);

  console.log('\n\nMaior nome de todos:\n', longestNameOfAll + ' - ' + longestNameOfAllState);

  console.log('\nMenor nome de todos:\n', shortestNameOfAll + ' - ' + shortestNameOfAllState);
}

async function findLongestName(state) {
  let longestName = '';
  for (let currentCity of state) {
    if (currentCity.Nome.length >= longestName.length) {
      if (longestName.length === currentCity.Nome.length && longestName.localeCompare(currentCity.Nome) == 1) {
        longestName = currentCity.Nome;
      } else {
        if (longestName.length < currentCity.Nome.length || longestName === '') {
          longestName = currentCity.Nome;
        }
      }
    }
  }

  return longestName;
}

async function findShortestName(state) {
  let shortestName = '';
  for (let currentCity of state) {
    if (shortestName === '') {
      shortestName = currentCity.Nome;
    }
    if (currentCity.Nome.length <= shortestName.length) {
      if (currentCity.Nome.length === shortestName.lentgh && currentCity.Nome.localeCompare(shortestName) === -1) {
        shortestName = currentCity.Nome;
      } else {
        if (currentCity.Nome.length < shortestName.length) {
          shortestName = currentCity.Nome;
        }
      }
    }
  }
  return shortestName;
}
