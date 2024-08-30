import { useSelector } from 'react-redux';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useGetPostsQuery, selectPostIds, selectHasNextPage } from './postsSlice';
import PostsExcerpt from './PostsExcerpt';

const PostsList = () => {
  const [page, setPage] = useState(1);
  const orderedPostIds = useSelector(selectPostIds) || [];
  const hasNextPage = useSelector(selectHasNextPage);
  const { data, isLoading, isSuccess, isError, error } = useGetPostsQuery(page);

  const fetchMoreData = () => {
    if (hasNextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  let content;

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = <p>{error.message}</p>;
  } else if (isSuccess) {
    content = (
      <InfiniteScroll
        dataLength={orderedPostIds.length}
        next={fetchMoreData}
        hasMore={hasNextPage}
        loader={<p>Loading more posts...</p>}
        endMessage={<p>No more posts to show.</p>}
      >
        {orderedPostIds.map((postId) => (
          <PostsExcerpt key={postId} postId={postId} />
        ))}
      </InfiniteScroll>
    );
  }

  return <section>{content}</section>;
};

export default PostsList;