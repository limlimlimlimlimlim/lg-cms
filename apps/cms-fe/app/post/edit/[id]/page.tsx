'use client';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import PostForm from '../../post-form';
import { getPostDetail } from '../../../../api/post';

export default function PostEdit() {
  const { id } = useParams();
  const [postData, setPostData] = useState();

  const fetchData = useCallback(async () => {
    const data = await getPostDetail(id);
    setPostData(data.data);
  }, [id]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return <PostForm data={postData} />;
}