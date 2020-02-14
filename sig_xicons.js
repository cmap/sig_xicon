const PS_FILES = require("./ps_files.json");
const T_300000 = [
    "MCF7",
    "PC3",
    "A549",
    "A375",
    "HT29"
];


const T_100000 = [
    "HA1E",
    "VCAP",
    "YAPC",
    "MCF10A",
    "U2OS",
    "HEPG2",
    "HELA",
    "HCC515",
    "MDAMB231"
];

const T_10GB = [
    "THP1",
    "HEK293",
    "NPC",
    "JURKAT",
    "U251MG",
    "ES2",
    "AGS",
    "BICR6",
    "ASC"
];
const SigXIconLookUp = require("./sig_xicon_lookup_jobs");

async function processPairs(celline_file,output_folder_name, pairs_file,post_fix) {
    const fsp = require('fs').promises;
    await fsp.access(celline_file);

    const lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(celline_file)
    });
    const promises = [];
    for await (const line of lineReader) {
        // Each line in the readline input will be successively available here as
        // `line`.
        let cell = line.trim();
        let memory = 10000;
        if (cell) {
            if (T_300000.includes(cell)) {
                memory = 300000;
            } else if (T_100000.includes(cell)) {
                memory = 100000;
            } else if (T_10GB.includes(cell)) {
                memory = 50000;
            }
            const jobName = cell  + "-sig_xicon_lookup_" + post_fix;
            const options = {
                jobName: jobName,
                cell: cell,
                out_dir: cell + output_folder_name,
                introspect_file: cell + "/" + PS_FILES[cell],
                pairs_file: pairs_file
            };
            const sigXIconLookUp = new SigXIconLookUp(options);
            const p = sigXIconLookUp.runJob(memory);
            promises.push(p);
        }
    }
    lineReader.on('close', function (d) {
        console.log("done reading")
        //console.log(JSON.stringify(data));
    });
    const resolvePs = await Promise.all(promises);
    return "done";
}
const myArgs = process.argv.slice(2);
let pairs_df_file = null;
let cells_file = "cells.txt";

if(myArgs.length < 1 || myArgs.length > 2){
    console.log("Error: specify the name of the pairs file");
    process.exit(1);
}else{
    pairs_df_file = myArgs[0];
    if(!pairs_df_file.toLowerCase().endsWith(".txt")){
        console.log("Error: pairs file must be a txt file");
        process.exit(1);
    }


    if(myArgs.length === 2){
        cells_file = myArgs[1];
        if(!cells_file.toLowerCase().endsWith(".txt")){
            console.error("Error: cells file must be a txt file");
            process.exit(1);
        }
    }
}
const post_fix = pairs_df_file.toLowerCase().replace("_pairs.txt","");
const folderName =   "/" + post_fix;
const p = processPairs(cells_file,folderName, pairs_df_file,post_fix);
p.then(function (data) {
    //console.log('Success');
}).catch(function (err) {
    console.log(err);
    console.log('Failure');
});