import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectPostById } from './postsSlice';
import { useParams, useNavigate } from 'react-router-dom';

import { selectAllUsers } from "../users/usersSlice";
import { useUpdatePostMutation, useDeletePostMutation } from "./postsSlice";

const EditPostForm = () => {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [updatePost, { isLoading }] = useUpdatePostMutation();
    const [deletePost] = useDeletePostMutation();

    const post = useSelector((state) => selectPostById(state, postId));
    const users = useSelector(selectAllUsers);

    const [title, setTitle] = useState(post?.title || '');
    const [content, setContent] = useState(post?.body || '');
    const [userId, setUserId] = useState(post?.userId || '');

    useEffect(() => {
        if (post) {
            setTitle(post.title || '');
            setContent(post.body || '');
            setUserId(post.userId || '');
        }
    }, [post]);

    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        );
    }

    const onTitleChanged = e => setTitle(e.target.value);
    const onContentChanged = e => setContent(e.target.value);
    const onAuthorChanged = e => setUserId(e.target.value);

    const canSave = [title, content, userId].every(Boolean) && !isLoading;
    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                await updatePost({ _id: post._id, title, body: content }).unwrap();
                navigate(`/post/${postId}`);
            } catch (err) {
                console.error('Failed to save the post', err);
            }
        }
    };

    const usersOptions = users.map(user => (
        <option key={user._id} value={user._id}>
            {user.name}
        </option>
    ));

    const onDeletePostClicked = async () => {
        try {
            await deletePost({ id: post._id }).unwrap();
            navigate('/');
        } catch (err) {
            console.error('Failed to delete the post', err);
        }
    };

    return (
        <section>
            <h2>Edit Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option value="">Select an author</option>
                    {usersOptions}
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >
                    Save Post
                </button>
                <button
                    type="button"
                    onClick={onDeletePostClicked}
                >
                    Delete Post
                </button>
            </form>
        </section>
    );
};

export default EditPostForm;
