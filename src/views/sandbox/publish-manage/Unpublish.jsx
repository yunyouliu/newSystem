import React, { useEffect, useState } from "react";
import NewsPlublish from "@/components/news-publish/newsPublish";
import usePublish from "@/components/hooks/CustomHook";

export default function Unpublish() {
  // 获取待发布的新闻
  const { news, handlPublish,contextHolder } = usePublish(1);
  return (
    <div>
      {contextHolder}
      <NewsPlublish data={news} title="发布" callback={handlPublish} />
    </div>
  );
}
