import { useStore } from "@/store";
import { request } from "@tarojs/taro";
import { useEffect, useState } from "react";


/** HTTP 请求方法 */
interface Method {
  /** HTTP 请求 OPTIONS */
  OPTIONS;
  /** HTTP 请求 GET */
  GET;
  /** HTTP 请求 HEAD */
  HEAD;
  /** HTTP 请求 POST */
  POST;
  /** HTTP 请求 PUT */
  PUT;
  /** HTTP 请求 DELETE */
  DELETE;
  /** HTTP 请求 TRACE */
  TRACE;
  /** HTTP 请求 CONNECT */
  CONNECT;
}
interface requestOptions {
  url: string;
  method?: keyof Method | undefined;
  params?: any;
}

interface configOptions {
  manual?: boolean;
}

export const useTaroRequest = (
  { url, method = "GET", params = {} }: requestOptions,
  reqConfig?: configOptions
) => {

  const { manual } = reqConfig || { manual: true };
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { state, updateState } = useStore();
  

  //const { baseUrl, header, ...otherConfig } = config || {};

  const run = async (reqParams?: any) => {
    try {
      if (reqParams) {
        method = "POST"
        params = reqParams;
      }
      console.log("useTaroRequest", url, method, params, manual);

      setLoading(true);
      const response = await request({
        method,
        data: params,
        url,
        header: {
          contentType: "application/json",
          Authorization: state.userInfo ? state.userInfo.token : "",
        },
      });

      console.log("response", response)

      setData(
        response.data
          ? response.data.data
            ? response.data.data
            : response.data
          : response.data
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    !manual && run();
  }, [manual]);

  return { data, error, loading, run };
};
