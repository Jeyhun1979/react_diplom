import { configureStore } from "@reduxjs/toolkit";
import type { Middleware } from "redux";
import createSagaMiddleware from "redux-saga";
import cartReducer from "./cartSlice";
import shopReducer from "./shopSlice";
import { rootSaga } from "./sagas";
import type { CartItem } from "../types";

const CART_STORAGE_KEY = "ra16-cart";

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch {
    return [];
  }
};

const cartPersistenceMiddleware: Middleware =
  (storeAPI) => (next) => (action) => {
    const result = next(action);

    if (
      typeof action === "object" &&
      action !== null &&
      "type" in action &&
      typeof (action as any).type === "string" &&
      [
        "cart/addToCart",
        "cart/removeFromCart",
        "cart/clearCart",
        "cart/placeOrderSuccess",
      ].includes((action as any).type)
    ) {
      const state = storeAPI.getState();
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          CART_STORAGE_KEY,
          JSON.stringify(state.cart.items),
        );
      }
    }

    return result;
  };

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    shop: shopReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(
      sagaMiddleware,
      cartPersistenceMiddleware,
    ),
  preloadedState: {
    cart: {
      items: loadCartFromStorage(),
      orderStatus: "idle" as const,
      orderError: null as string | null,
    },
  },
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
