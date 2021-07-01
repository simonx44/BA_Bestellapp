import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: undefined,
    shoppingCart: { restaurantid: undefined, items: {} },
  },
  mutations: {
    addItemToCart(state, payload) {
      const { product } = payload;

      let { items, restaurantid } = state.shoppingCart;
      //Produkt noch nicht vorhanden
      if (!items[product.id]) {
        items[product.id] = product;
        this.state.shoppingCart = Object.assign({}, { restaurantid, items });
      } else {
        //Produkt vorhanden
        items[product.id].amount += product.amount;

        this.state.shoppingCart = Object.assign({}, { restaurantid, items });
      }
    },
    setRestaurantToCart(state, id) {
      this.state.shoppingCart = { restaurantid: id, items: {} };
    },
    deleteShoppingCart() {
      this.state.shoppingCart = { restaurantid: undefined, items: {} };
    },
    deleteItem(state, id) {
      let { items, restaurantid } = state.shoppingCart;
      var newItems = { ...items };
      delete newItems[id];
      this.state.shoppingCart = { restaurantid, items: newItems };
    },
    setCurrentUser(state, payload) {
      this.state.currentUser = payload;
    },
  },
  actions: {},
  modules: {},
  getters: {
    getCurrentUser: (state) => state.currentUser,
    getShoppingCart: (state) => state.shoppingCart,
  },
});
