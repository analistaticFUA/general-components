export function extractNames(data, entity){
  if(data[entity]){
    return Object.values(data[entity]).map(item => item.name);
  }
}

export function extractStateNames(data) {
  return Object.keys(data);
}

export function extractStatesInfo(data){
  if(data && data.states){
    return data.states;
  }
  return {};
}

export function extractNamesAndCodes(data, entity) {
  if (data[entity]) {
    return Object.values(data[entity]).map(item => [item.name, item.code]);
  } else {
    return [];
  }
}
