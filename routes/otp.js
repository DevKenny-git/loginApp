function createOTP () {
    let otp = Math.floor(Math.random() * 9000 + 1000);
    return otp
}

module.exports = {
    createOTP
}