const regExForUrl = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
const regExForName = /[A-Za-zА-Яа-яЁё\s-]+/;

module.exports = regExForUrl;
module.exports = regExForName;
