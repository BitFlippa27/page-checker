const Diff = require('diff');
require('colors')




  const response = await fetch('https://bingo-game-phi.vercel.app/');

  const newContent = await response.text();
  console.log(typeof newContent);
  if (site.content !== newContent) {
    const changes = diff.diffChars(site.content, newContent);
    
    console.log("Bingo! The content has changed");
  }
  

  
  const one = 'beep boop';
  const other = 'beep boob blah';
  
  const diff = Diff.diffChars(one, other);
  
  diff.forEach((part) => {
    // green for additions, red for deletions
    let text = part.added ? part.value.bgGreen :
               part.removed ? part.value.bgRed :
                              part.value;
    process.stderr.write(text);
  });
  
  console.log();