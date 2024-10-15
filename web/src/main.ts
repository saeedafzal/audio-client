import "./styles/main.less";

import m from "mithril";
import DashboardView from "./views/dashboardview";

// TODO: Application version from package.json
const environment = import.meta.env.MODE;
console.log(`Audio Client | ${environment} | ${import.meta.env.VITE_VERSION}`);

// No debug logs in production
if (environment === "production") {
    console.debug = () => undefined;
}

// Entry point
m.mount(document.body, DashboardView);
