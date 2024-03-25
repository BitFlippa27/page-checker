const fetchWebContent = async (url) => {
  try {
    //response = new Response();
    const response = await fetch(url);
    
    return response;
  } catch (error) {
    if (response) {
      console.error(
        `Error in fetchWebContent: Couldn't fetch web content! HTTP Status: ${response.status}`
      );
    } else if (!response) {
      console.error(
        `Error in fetchWebContent: Couldn't fetch web content: ${error.message}`
      );
    } else {
      console.error(
        `Error in fetchWebContent Couldn't fetch web content: ${error.message}`
      );
    }
  }
};

export { fetchWebContent }