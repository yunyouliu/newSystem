import NewsPlublish from "@/components/news-publish/newsPublish";
import usePublish from "@/components/hooks/CustomHook";

export default function Published() {
  // 获取已发布的新闻
  const { news, handleOffline, contextHolder } = usePublish(2);
  return (
    <div>
      {contextHolder}
      <NewsPlublish data={news} title="下线" callback={handleOffline} />
    </div>
  );
}
  