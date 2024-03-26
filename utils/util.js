const filterReachableWebsites = (validResponses, invalidRespones) => {
   return validResponses.filter(url => !invalidRespones.includes(url));
}

export { filterReachableWebsites } 