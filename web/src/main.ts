import m from "mithril";
import DashboardView from "./views/dashboard_view";
import "@/styles/main.less";

// Print application data
const environment = import.meta.env.MODE;
console.log(`Audio Client | ${environment} | ${import.meta.env.VITE_VERSION}`);

// Disable debug logs
if ("production" === environment) {
    console.debug = () => undefined;
}

// Entrypoint
m.mount(document.body, DashboardView);