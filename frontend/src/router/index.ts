import { createRouter, createWebHistory } from "vue-router";
import AddWater from "../views/AddWater.vue";
import Login from "../views/Login.vue";
import HomeView from "../views/HomeView.vue";

const routes = [
    {
        name: "Home",
        path: "/",
        component: HomeView,
    },
    {
        name: "Add Water",
        path: "/AddWater",
        component: AddWater,
    },
    {
        name: "Login",
        path: "/Login",
        component: Login,
    },
    // { path: '/about', component: About },
];

// keep it simple for now.
const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHistory(),
    routes, // short for `routes: routes`
});

export default router;
