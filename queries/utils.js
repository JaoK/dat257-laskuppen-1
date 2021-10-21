function errorMsg(text) {
    return { error: text };
}

function escape(input, match) {

    if (match.includes(input.toLowerCase())) {
        return true;
    }
    return false;
}
function getUserId(request) {
    return parseInt(request.session.userId);
}

function hasSession(request, response) {
    if (request.session.isLoggedIn && request.session.isLoggedIn == true) {
        return true;
    }
    else {
        response.status(400).json(errorMsg("No session. Please log in."));
        return false;
    }
}

function isAdmin(request, response) {
    if (hasSession(request, response) && request.session.role >= 3) {
        return true;
    }
    else {
        response.status(403).json(errorMsg("Forbidden."));
        return false;
    }
}

function isTeacher(request, response) {
    if (hasSession(request, response) && request.session.role >= 2) {
        return true;
    }
    else {
        response.status(403).json(errorMsg("Forbidden."));
        return false;
    }
}

if (!process.env.DATABASE_URL) {
    require("dotenv").config();
}

const { Client } = require("pg");

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect();

module.exports = {
    hasSession,
    escape,
    errorMsg,
    getUserId,
    isAdmin,
    isTeacher,
    client
}
