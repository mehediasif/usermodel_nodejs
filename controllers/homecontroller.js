const BigPromise = require('../middlewares/bigpromise')

exports.home = BigPromise(async (req, res) => {
    res.status(200).json({
        success: true,
        greeting: "Hellow from APi",
    });
})
exports.homeDummy = (req, res) => {
    res.status(200).json({
        success: true,
        greeting: "Another Dummy route",
    });
};