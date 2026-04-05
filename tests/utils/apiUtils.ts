import { APIRequestContext, expect } from "@playwright/test";


class APIUtils {
  private apiContext: APIRequestContext;
  private loginPayload: {userEmail: string; userPassword: string};

  constructor(apiContext: APIRequestContext, loginPayload: {userEmail: string; userPassword: string}) {
    this.apiContext = apiContext;
    this.loginPayload = loginPayload;
  }

  async getToken() {
    const loginRespone = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/auth/login",
      {
        data: this.loginPayload,
      },
    );
    const loginResponseJson = await loginRespone.json();
    if (!loginResponseJson.token) {
  throw new Error("Login failed - no token received");
}
    console.log("Login Response:", loginResponseJson);
    return loginResponseJson.token;
  }

  async createOrder(orderPayload: any) {
    const token = await this.getToken();

    const orderResponse = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/order/create-order",
      {
        data: orderPayload,
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    const orderResponseJson = await orderResponse.json();

    if (!orderResponse.ok()) {
      throw new Error(
        `Failed to create order. Status: ${orderResponse.status()}, Response: ${JSON.stringify(orderResponseJson)}`,
      );
    }

    if (!orderResponseJson.orders?.length) {
      throw new Error("No orders returned");
    }

    console.log(orderResponseJson);
    return { token, orderId: orderResponseJson.orders[0] };
  }
}

export default APIUtils;
