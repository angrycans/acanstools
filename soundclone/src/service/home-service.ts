/**
 * Service用来处理逻辑，返回结果给Controller
 */
class HomeService {
  hello() {
    return new Promise((resolve) => resolve("hello world"));
  }

  async test(name) {
    const dynamic = new Function("modulePath", "return import(modulePath)");
    const { Client } = await dynamic("@gradio/client");
    const app = await Client.connect("http://192.168.2.20:7000/", { auth: ["acans", "your_password!"] });
    const result = await app.predict("/generate_seed", {});

    console.log(result.data);
    return Promise.resolve({
      data: `你好，${name}!`,
    });
  }
}

export default new HomeService();
