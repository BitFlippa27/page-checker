const filterReachableWebsites = (websites, validResponses) => {    
   const validUrls = validResponses.map(response => response.url);

   return websites.filter(website => validUrls.includes(website.url));
}

export { filterReachableWebsites } 

