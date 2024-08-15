import React, { useEffect, useState } from "react";
import axios from "axios";
export default function News() {
  const [news, setnews] = useState([]);
  const [categoryList, setcategoryList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const [news, categoryList] = await Promise.all([
        axios("/news?publishState=2"),
        axios("/categories"),
      ]);

      setcategoryList(categoryList.data);
      setnews(news.data);
    };
  }, []);

  return <div>news</div>;
}
