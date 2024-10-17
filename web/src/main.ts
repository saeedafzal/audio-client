import "./styles/main.less";

import m from "mithril";
import Container from "./core/container";
import EventBus from "./core/eventbus";
import DashboardView from "./views/dashboardview";
import DashboardModel from "./views/dashboardmodel";

// Log version
const environment = import.meta.env.MODE;
console.log(`Audio Client | ${environment} | ${import.meta.env.VITE_VERSION}`);

// No debug logs in production
if (environment === "production") {
    console.debug = () => undefined;
}

// Create and register objects
const eventbus = new EventBus();
Container.register(eventbus, EventBus);

// Entry point
const dashboardModel = new DashboardModel(eventbus);
const Root = {
    view() {
        return m(DashboardView, { model: dashboardModel });
    }
};
m.mount(document.body, Root);
