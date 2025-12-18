// Rendering the main page
const main = async (request, response) => {
    try {
        if (request.method === 'GET') {
            response.json({
                "name": 'Shafqat',
                "id": 'id1',
                "class": 4,
            });
        } else {
            response.send("Not a GET method!");
        }
    }
    catch (error) {
        console.log("An error occured on man page!");
    }
}


// Exporting all controllers
module.exports = {
    main,
}

