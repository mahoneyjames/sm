exports.publishStory = function(event, context, callback) {
    callback(null, "Success");
};

exports.publishStoryAsync = async (event, context) => {
    return "Success async";
};
