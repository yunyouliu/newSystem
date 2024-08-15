import NewsPlublish from "@components/news-publish/newsPublish";
import usePublish from "@/components/hooks/CustomHook";

export default function Sunset() {
  const { news, handDelete, contextHolder } = usePublish(3);

  return (
    <div>
      {contextHolder}
      <NewsPlublish data={news} title="删除" callback={handDelete} />
    </div>
  );
}
