/*const retryCheckPageChanges = async (retryCount = 0) => {
  const retryLimit = 20;
  const retryDelay = 5000;

  try {
    //startMonitoring();
  } catch (error) {
    console.error(`Error in checkPageChanges: ${error.message}`);
    if (retryCount < retryLimit) {
      console.log(
        `Retrying checkPageChanges (${retryCount + 1}/${retryLimit})`
      );
      delay(retryDelay);
      retryCheckPageChanges(retryCount + 1);
    } else {
      console.error("checkPageChanges failed after maximum retries");
      //send mail to admin
    }
  }
};

*/