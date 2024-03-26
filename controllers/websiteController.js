const fetchWebContent = async (url) => {
  const obs = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log(entry);
    }
  });
  obs.observe({ entryTypes: ['measure'], buffered: true });

  try {
    performance.mark('A');
    const response = await fetch(url);
    performance.mark('B');
    performance.measure('A to B', 'A', 'B');

    return response;
  } catch (error) {
    if (response) {
      console.error(
        `Error in fetchWebContent: Couldn't fetch web content! HTTP Status: ${response.status}`
      );
      return false;
    } else if (!response) {
      console.error(
        `Error in fetchWebContent: Couldn't fetch web content: ${error.message}`
      );
      return false;
    } else {
      console.error(
        `Error in fetchWebContent Couldn't fetch web content: ${error.message}`
      );
      return false;
    }
  }
  finally {
    obs.disconnect();
  }
};

export { fetchWebContent }