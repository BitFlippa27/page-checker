const filterReachableWebsites = (websites, validResponses) => {  
   try {
      const validUrls = validResponses.map(response => response.url);
      return websites.filter(website => validUrls.includes(website.url));
   } catch (error) {
      console.error(`Error in filterReachableWebsites ${error.message} `)
   }  
   
}


export { filterReachableWebsites } 

