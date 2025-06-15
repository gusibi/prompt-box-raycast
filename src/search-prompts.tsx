// @ts-nocheck
import {
  List,
  Detail,
  ActionPanel,
  Action,
  showToast,
  Toast,
  Clipboard,
} from "@raycast/api";
import { useState, useEffect } from "react";
import { getCachedPrompts } from "./storage";
import { Prompt } from "./types";

interface Preferences {
  apiKey: string;
}

function PromptDetail({ prompt }: { prompt: Prompt }) {
  const markdown = `# ${prompt.title}

${prompt.description ? `**描述:** ${prompt.description}\n\n` : ""}**内容:**\n\n\`\`\`\n${prompt.content}\n\`\`\`\n\n${prompt.tags && prompt.tags.length > 0 ? `**标签:** ${prompt.tags.join(", ")}` : ""}`;

  // @ts-ignore
  return (
    <Detail
      markdown={markdown}
      actions={
        // @ts-ignore
        <ActionPanel>
          <Action.CopyToClipboard
            title="复制内容"
            content={prompt.content}
            shortcut={{ modifiers: ["cmd"], key: "c" }}
          />
          <Action.CopyToClipboard
            title="复制标题"
            content={prompt.title}
            shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
          />
          <Action.OpenInBrowser
            title="在浏览器中打开"
            url={`https://pb.onlinestool.com/prompt`}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
          />
        </ActionPanel>
      }
    />
  );
}

export default function SearchPrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadPrompts();
  }, []);

  async function loadPrompts() {
    try {
      const cachedPrompts = await getCachedPrompts();
      setPrompts(cachedPrompts);
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "加载失败",
        message: "无法加载 Prompts，请检查网络连接",
      });
    } finally {
      setLoading(false);
    }
  }

  const filteredPrompts = prompts.filter((prompt) => {
    const searchLower = searchText.toLowerCase();
    return (
      prompt.title.toLowerCase().includes(searchLower) ||
      prompt.content.toLowerCase().includes(searchLower) ||
      (prompt.description && prompt.description.toLowerCase().includes(searchLower)) ||
      (prompt.tags && prompt.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
    );
  });

  async function copyToClipboard(content: string) {
    await Clipboard.copy(content);
    showToast({
      style: Toast.Style.Success,
      title: "已复制",
      message: "Prompt 内容已复制到剪贴板",
    });
  }

  async function pasteToFrontmostApp(content: string) {
    await Clipboard.paste(content);
    showToast({
      style: Toast.Style.Success,
      title: "已粘贴",
      message: "Prompt 内容已粘贴到前端应用",
    });
  }

  // @ts-ignore
  return (
    <List
      isLoading={loading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="搜索 Prompts..."
      throttle
    >
      {filteredPrompts.length === 0 && !loading ? (
        <List.EmptyView
          title="没有找到 Prompts"
          description={searchText ? "尝试使用不同的关键词搜索" : "请先同步数据或添加新的 Prompt"}
        />
      ) : (
        filteredPrompts.map((prompt, index) => (
          <List.Item
            key={prompt.id || index}
            title={prompt.title}
            subtitle={prompt.description}
            accessories={[
              ...(prompt.tags || []).map((tag) => ({ text: tag })),
            ]}
            actions={
              // @ts-ignore
              <ActionPanel>
                <Action
                  title="复制到剪贴板"
                  onAction={() => copyToClipboard(prompt.content)}
                  icon="📋"
                />
                <Action
                  title="粘贴到前端应用"
                  onAction={() => pasteToFrontmostApp(prompt.content)}
                  shortcut={{ modifiers: ["cmd"], key: "enter" }}
                  icon="📝"
                />
                <Action.Push
                  title="查看详情"
                  target={<PromptDetail prompt={prompt} />}
                  shortcut={{ modifiers: ["cmd"], key: "d" }}
                  icon="👁"
                />
                <Action.CopyToClipboard
                  title="复制标题"
                  content={prompt.title}
                  shortcut={{ modifiers: ["cmd"], key: "c" }}
                />
                <Action.OpenInBrowser
                  title="在浏览器中打开"
                  url={`https://pb.onlinestool.com/prompt`}
                  shortcut={{ modifiers: ["cmd"], key: "o" }}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}