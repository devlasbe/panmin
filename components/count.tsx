"use client";

import useFirebase from "@/hooks/useFirebase";
import { useEffect, useState } from "react";

const Count = () => {
  const [count, setCount] = useState(0);
  const { getTotalCount } = useFirebase();

  useEffect(() => {
    getTotalCount().then((res) => {
      if (res.success) {
        setCount(res.count || 0);
      }
    });
  }, [getTotalCount]);

  return (
    <div className="flex justify-center items-center py-2">
      <p className="text-sm text-neutral-500">
        지금까지 <strong className="text-neutral-800">{count}번</strong> 얼라인 되었어요!!
      </p>
    </div>
  );
};

export default Count;
