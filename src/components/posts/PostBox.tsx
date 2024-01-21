import {Link} from "react-router-dom";
import {FaRegComment, FaUserCircle} from "react-icons/fa";
import {AiFillHeart} from "react-icons/ai";
import {PostProps} from "../../pages/home";
import {useContext} from "react";
import AuthContext from "../../context/AuthContext";

interface PostBoxProps {
    post: PostProps;
}
export default function PostBox({post}: PostBoxProps){
    const {user} = useContext(AuthContext);
    const handleDelete = () => {};

    return (
        <div className="post_box" key={post?.id}>
            <Link to={`/posts/${post?.id}`}>
                <div className="post_box-profile">
                    <div className="post_flex">
                        {post?.profileUrl ? (
                            <img src={post?.profileUrl} alt="prorile"
                                 className="post_box-profile-img"/>
                        ) : (
                            <FaUserCircle className="post_box-profile-icon"/>
                        )}
                        <div className="post_email">{post?.email}</div>
                        <div className="post_createdAt">{post?.createdAt}</div>
                    </div>
                    <div className="post_box-content">{post?.content}</div>
                </div>
            </Link>
            <div className="post_box-footer">
                {/* post.uid === user.uid 일때 */}
                {user?.uid === post?.uid && ( //유저의 아이디가 포스트의 아이디와 일치할때만 삭제
                <>
                    <button type="button" className="post_delete"
                            onClick={handleDelete}>Delete</button>
                    <button type="button" className="post_edit">
                        <Link to={`/posts/edit/${post?.id}`}>Edit</Link>
                    </button>
                </>
                )}

            <button type="button" className="post_likes">
                <AiFillHeart/>
                {post?.likeCount || 0}
            </button>
            <button type="button" className="post_comment">
                <FaRegComment/>
                {post?.comments?.length || 0}
            </button>
        </div>
    </div>
    );
}