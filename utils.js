let batch = null;
exports.getBatchInstance = function () {
    if (batch) {
        return batch;
    }
    const AWS = require('aws-sdk');
    AWS.config.update({region: 'us-east-1'});
    batch = new AWS.Batch();
    return batch;
}

