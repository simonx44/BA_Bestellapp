import Vue from "vue";
import VueRouter from "vue-router";
import CustomerProfil from "@/views/customerViews/CustomerProfil";
import OrderOverview from "@/views/orderViews/OrderOverview";
import OrderDetails from "@/views/orderViews/OrderDetail";
import RestaurantProfil from "@/views/restaurantViews/RestaurantProfil";
import RestaurantMenu from "@/views/restaurantViews/RestaurantMenu";
import RestaurantList from "@/views/customerViews/RestaurantList";
import RestaurantMenuOverview from "@/views/customerViews/RestaurantMenuOverview";
import ShoppingCart from "@/components/mobile/ShoppingCart";
import { Auth } from "aws-amplify";

Vue.use(VueRouter);

const customerRoutes = [
  {
    name: "CustomerProfil",
    path: "/customerprofil",
    component: CustomerProfil,
    meta: { access: { customer: true, restaurant: false } },
  },
  {
    name: "RestaurantMenu",
    path: "/restaurant/:id",
    component: RestaurantMenuOverview,
    meta: { access: { customer: true, restaurant: false } },
  },

  {
    name: "RestaurantList",
    path: "/",
    component: RestaurantList,
    meta: { access: { customer: true, restaurant: false } },
  },
  {
    name: "ShoppingCart",
    path: "/cart",
    component: ShoppingCart,
    meta: { access: { customer: true, restaurant: false } },
  },
];

const restaurantRoutes = [
  {
    name: "RestaurantProfil",
    path: "/restaurantprofil",
    component: RestaurantProfil,
    meta: { access: { customer: false, restaurant: true } },
  },
  {
    name: "Menu",
    path: "/menu",
    component: RestaurantMenu,
    meta: { access: { customer: false, restaurant: true } },
  },
];

const bothRoutes = [
  {
    name: "OrderOverview",
    path: "/orders",
    component: OrderOverview,
    meta: { access: { customer: true, restaurant: true } },
  },
  {
    name: "404",
    path: "*",
    component: () => import(/* webpackChunkName: "about" */ "../views/404.vue"),
  },
  {
    name: "OrderDetails",
    path: "/orders/:id",
    component: OrderDetails,
    meta: { access: { customer: true, restaurant: true } },
  },
];

const router = new VueRouter({
  mode: "history",
  // base: process.env.BASE_URL,
  routes: [...bothRoutes, ...restaurantRoutes, ...customerRoutes],
});

router.beforeEach(async (to, from, next) => {
  const { name } = from;
  const { access } = to.meta;

  if (to.name === "404") {
    return next();
  }

  //Seitenaufruf -> store noch nicht vorhanden
  // Aus Cookie Userdaten lesen
  if (!name) {
    const user = await Auth.currentUserInfo();
    if (user && Object.keys(user).length > 0) {
      const { attributes } = user;
      const isCustomer = attributes["custom:isCustomer"] === "true";
      let defaultPath = isCustomer ? "/" : "/orders";
      isPathAllowed(access, isCustomer, next) ? next() : next(defaultPath);
    } else {
      // Nutzer wird ausgeloggt -> muss sich neu anmelden
      next();
    }
  } else {
    const user = router.app.$store.getters.getCurrentUser;
    let defaultPath = user.isCustomer ? "/" : "/orders";
    isPathAllowed(access, user.isCustomer) ? next() : next(defaultPath);
  }
});

export default router;

function isPathAllowed(access, isCustomer) {
  if (isCustomer) {
    return access.customer;
  } else {
    return access.restaurant;
  }
}
