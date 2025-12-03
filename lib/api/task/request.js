import BaseApi from "../_base.api";

export default class TASKAPI {
  static async addTask(payload) {
    try {
      const res = await BaseApi.post(
        process.env.NEXT_PUBLIC_API_URL + "/tasks",
        payload
      );
      return res;
    } catch (err) {
      throw err;
    }
  }

  static async getTasks(params = {}) {
    try {
      const res = await BaseApi.get(
        process.env.NEXT_PUBLIC_API_URL + "/tasks",
        {
          params, // pass the params object directly
        }
      );
      return res;
    } catch (err) {
      throw err;
    }
  }
}
