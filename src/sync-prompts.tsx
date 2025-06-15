import { showToast, Toast, closeMainWindow } from "@raycast/api";
import { fetchPrompts } from "./api";
import { setCachedPrompts, getLastSyncTime } from "./storage";

export default async function SyncPrompts() {
  try {
    // 显示开始同步的提示
    await showToast({
      style: Toast.Style.Animated,
      title: "正在同步...",
      message: "从服务端获取最新数据",
    });

    // 从 API 获取最新数据
    const prompts = await fetchPrompts();

    // 保存到本地缓存
    await setCachedPrompts(prompts);

    // 获取同步时间
    const lastSync = await getLastSyncTime();
    const syncTime = lastSync ? lastSync.toLocaleString() : "刚刚";

    // 显示成功提示
    await showToast({
      style: Toast.Style.Success,
      title: "同步完成",
      message: `已同步 ${prompts.length} 个 Prompts (${syncTime})`,
    });

    // 关闭 Raycast 窗口
    await closeMainWindow();
  } catch (error) {
    console.error("Sync failed:", error);
    
    await showToast({
      style: Toast.Style.Failure,
      title: "同步失败",
      message: error instanceof Error ? error.message : "请检查网络连接和 API Key",
    });
  }
}