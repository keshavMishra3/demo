import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";

const PostsExcerpt = ({ postId }) => {
    const post = useSelector(state => selectPostById(state, postId));

    if (!post) return <p>Loading...</p>; // Handle case where post might not be available

    return (
        <article>
            <h2>{post.title}</h2>
            <p className="excerpt">{post.body.substring(0, 75)}...</p>
            <p className="postCredit">
                <Link to={`post/${post._id}`}>View Post</Link>
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButtons post={post} />
        </article>
    );
};

export default PostsExcerpt;
