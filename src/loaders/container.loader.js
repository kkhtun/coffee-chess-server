const awilix = require("awilix");

function loadModels(container) {
    let mapping = {
        UsersModel: require("../models/users.model"),
        GamesModel: require("../models/games.model"),
    };
    Object.keys(mapping).forEach((key) => {
        let model = mapping[key];
        container.register({
            [key]: awilix.asValue(model),
        });
    });
}

function loadServices(container) {
    let mapping = {
        FirebaseService: require("../services/firebase.service"),
        UsersService: require("../services/users.service"),
        GamesService: require("../services/games.service"),
    };
    Object.keys(mapping).forEach((key) => {
        let service = mapping[key];
        container.register({
            [key]: awilix.asFunction(service),
        });
    });
}

function loadControllers(container) {
    let mapping = {
        UsersController: require("../controllers/users.controller"),
        GamesController: require("../controllers/games.controller"),
    };
    Object.keys(mapping).forEach((key) => {
        let controller = mapping[key];
        container.register({
            [key]: awilix.asFunction(controller),
        });
    });
}

function loadHandlers(container) {
    let mapping = {
        UsersHandler: require("../handlers/users.handler"),
        GamesHandler: require("../handlers/games.handler"),
        SocketHandler: require("../handlers/sockets.handler"),
    };
    Object.keys(mapping).forEach((key) => {
        let handler = mapping[key];
        container.register({
            [key]: awilix.asFunction(handler),
        });
    });
}

function loadRoutes(container) {
    let mapping = {
        UsersRouter: require("../routes/users.route"),
        GamesRouter: require("../routes/games.route"),
    };
    Object.keys(mapping).forEach((key) => {
        let route = mapping[key];
        container.register({
            [key]: awilix.asFunction(route),
        });
    });
}

function loadConstants(container) {
    let mapping = {
        ...require("../constants/errors.constants"),
    };
    Object.keys(mapping).forEach((key) => {
        let constant = mapping[key];
        container.register({
            [key]: awilix.asValue(constant),
        });
    });
}

function loadHelpers(container) {
    let mapping = {};
    Object.keys(mapping).forEach((key) => {
        let helper = mapping[key];
        container.register({
            [key]: awilix.asFunction(helper),
        });
    });
}

function initContainer(layers = []) {
    const container = awilix.createContainer();
    const layerMapping = {
        models: loadModels,
        services: loadServices,
        controllers: loadControllers,
        handlers: loadHandlers,
        routes: loadRoutes,
        constants: loadConstants,
        helpers: loadHelpers,
    };

    const definedLayers = Object.keys(layerMapping);
    layers = layers.filter((l) => definedLayers.includes(l));
    layers.forEach((key) => layerMapping[key](container)); // Above functions are called here, and layers are injected
    return container;
}

module.exports = initContainer;
