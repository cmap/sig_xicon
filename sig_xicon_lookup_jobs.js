const utils = require("./utils");

class SigXIconLookUp {

    constructor(options) {
        this.cell = options.cell;
        this.jobName = options.jobName;
        this.macchiato_big = "Macchiato-big-X";
        this.introspect_file = options.introspect_file;
        this.pairs_file = options.pairs_file;
        this.out_dir = options.out_dir;
    }

    /**
     *
     * @param data
     */
    async handleJob(params) {
        const self = this;
        const batch = utils.getBatchInstance();
        try {
            const responseData = await batch.submitJob(params).promise();
            //console.log(self.jobName + " completed successfully");
            return responseData;
        } catch (err) {
            console.log(self.cell);
            //console.log(err, err.stack);
            return "done"
            //throw (err);
        }
    }
    /**
     *
     * @param data
     */
    async runJob(memory_in_MB) {
        const self = this;
        const params = {
            jobDefinition: "CMAP-sig_xicon_lookup_tool",
            jobName: self.jobName,
            jobQueue: self.macchiato_big,

            containerOverrides: {
                command: [
                    "--ds",  "/input/" + self.introspect_file,
                    "--pairs_df","/expected_associations/" + self.pairs_file,
                    "--row_val_field", "pert_id_1",
                    "--col_val_field","pert_id_2",
                    "--ds_chunk_size", "100",
                    "--out", "/output/" + self.out_dir
                ],
                memory : memory_in_MB,
            },
            retryStrategy: {
                attempts: 1
            }
        };
        const resp = await self.handleJob(params);
        return resp;
    }
}
module.exports = SigXIconLookUp;