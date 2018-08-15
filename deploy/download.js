const download = require('download');
const yauzl = require('yauzl');
const path = require('path');
const fs = require('fs');

getFile().then(() => {
    console.log('download FE dist zip file successfully!');
});

async function getFile(){
    let data = await download('https://api.github.com/repos/brummp/front/releases/latest');
    let str = data.toString('utf8');
    let obj = JSON.parse(str);
    let url = obj.assets[0].browser_download_url;

    let file = await download(url);
    fs.writeFileSync('dist.zip',file);

    yauzl.open("dist.zip", {lazyEntries: true}, function(err, zipfile) {
        if (err) throw err;
        zipfile.readEntry();
        zipfile.on("entry", function(entry) {
            if (/\/$/.test(entry.fileName)) {
                // Directory file names end with '/'.
                // Note that entires for directories themselves are optional.
                // An entry's fileName implicitly requires its parent directories to exist.
                zipfile.readEntry();
            } else {
                // file entry
                zipfile.openReadStream(entry, function(err, readStream) {
                    let dirname = path.dirname(entry.fileName);

                    if(!fs.existsSync(dirname))
                        fs.mkdirSync(dirname, 0o775);

                    let writeStream = fs.createWriteStream(entry.fileName);
                    console.log(entry.fileName);

                    if (err) throw err;

                    readStream.on("end", function() {
                        zipfile.readEntry();
                    });
                    readStream.pipe(writeStream);
                });
            }
        });
    });
}
