(function () {
    "use strict";

    const LOCAL_API_BASE_URL = "http://localhost:8080";

    // Set this when the production backend is deployed.
    // Example format: "https://api.example.com"
    const PRODUCTION_API_BASE_URL = "";

    const localHosts = new Set(["localhost", "127.0.0.1"]);
    const isLocalDevelopment = localHosts.has(window.location.hostname);

    const apiBaseUrl = isLocalDevelopment
        ? LOCAL_API_BASE_URL
        : PRODUCTION_API_BASE_URL;

    window.Survival72Config = Object.freeze({
        apiBaseUrl
    });
})();
