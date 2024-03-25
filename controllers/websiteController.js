const fetchWebContent = async (url) => {
  let response;

  try {
    //response = new Response();
    response = await fetch(url);
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