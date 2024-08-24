const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Read txt file
const filePath = path.join(__dirname, '83.txt'); // Replace 'linkHere.txt' with your file name
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  
  // Split link
  const links = data.trim().split('\n');
  
  // Create promise lists
  const promises = links.map((link, index) => {
    const outputFileName = `${index + 1}.mp4`;
    const command = `ffmpeg -i "${link}" -codec copy ${outputFileName}`;
    
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error processing ${link}: ${error.message}`);
          return reject(error);
        }
        if (stderr) {
          console.error(`stderr for ${link}: ${stderr}`);
          return reject(new Error(stderr));
        }
        console.log(`Successfully processed ${link}`);
        resolve(stdout);
      });
    });
  });

  // Await promises
  Promise.all(promises)
    .then(() => console.log('All files processed successfully'))
    .catch((err) => console.error('Error processing files:', err));
});
