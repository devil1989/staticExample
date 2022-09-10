let fs=require("fs");
let yargs=require("yargs");
let config=require("./config");
let localAddress=config.localAddress,hmr=config.hmr,workingDir=config.workingDir,argv=yargs.argv;

module.exports={
    getPages:function(folder){
        let pages = [];
        let directories = fs.readdirSync(`${workingDir}/${folder}`);
        for (let dir of directories) {
            if (!dir.startsWith('.')) {
                pages.push(`${folder}/${dir}`);
            }
        }

        return pages;
    },
    getEntries:function(pages, isHMR ){
        var isHMR=typeof isHMR ==="undefined"?true:isHMR;
        let entries = {};
        for(let page of pages){
            let key = page;
            let value = `./${key}/app.js`;
            if(!argv.dev){
                entries[key] = value;
            } else {
                if (isHMR) {
                    entries[key] = [value, hmr];
                } else {
                    entries[key] = value;
                }
            }
        }
        return entries;
    }
}
