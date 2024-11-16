import { message as antMessage } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import { useCallback, useEffect, useState } from "react";

export function useMessage() {
  const [message, setMessage] = useState<MessageInstance | null>(null);

  useEffect(() => {
    antMessage
      .getContainer()
      .then((instance) => {
        setMessage(instance);
      })
      .catch((error) => {
        console.error("Failed to get message container:", error);
      });

    return () => {
      message?.destroy();
    };
  }, []);

  const showMessage = useCallback(
    (type: keyof MessageInstance, content: string) => {
      if (message && type in message) {
        (message[type] as Function)(content);
      }
    },
    [message]
  );

  return {
    message: {
      success: (content: string) => showMessage("success", content),
      error: (content: string) => showMessage("error", content),
      warning: (content: string) => showMessage("warning", content),
      info: (content: string) => showMessage("info", content),
      loading: (content: string) => showMessage("loading", content),
    },
  };
}
