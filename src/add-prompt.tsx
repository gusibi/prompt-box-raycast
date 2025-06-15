import {
  Form,
  ActionPanel,
  Action,
  showToast,
  Toast,
  popToRoot,
} from "@raycast/api";
import { useState } from "react";
import { createPrompt } from "./api";
import { CreatePromptRequest } from "./types";

interface FormValues {
  title: string;
  content: string;
}

export default function AddPrompt() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: FormValues) {
    if (!values.title.trim() || !values.content.trim()) {
      showToast({
        style: Toast.Style.Failure,
        title: "提交失败",
        message: "标题和内容不能为空",
      });
      return;
    }

    setIsLoading(true);

    try {
      const promptData: CreatePromptRequest = {
        title: values.title.trim(),
        content: values.content.trim(),
      };

      await createPrompt(promptData);

      showToast({
        style: Toast.Style.Success,
        title: "✅ Prompt Added!",
        message: "新的 Prompt 已成功添加",
      });

      // 自动关闭表单
      popToRoot();
    } catch (error) {
      console.error("Failed to add prompt:", error);
      showToast({
        style: Toast.Style.Failure,
        title: "添加失败",
        message: error instanceof Error ? error.message : "未知错误",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="添加 Prompt"
            onSubmit={handleSubmit}
            shortcut={{ modifiers: ["cmd"], key: "enter" }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="title"
        title="标题"
        placeholder="输入 Prompt 标题"
        autoFocus
      />
      <Form.TextArea
        id="content"
        title="内容"
        placeholder="输入 Prompt 内容"
        enableMarkdown
      />
      <Form.Description text="提示：Tags 和 Description 可以稍后在 Web 端添加" />
    </Form>
  );
}