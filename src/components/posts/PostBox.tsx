import {Link, useNavigate} from "react-router-dom";
import {FaRegComment, FaUserCircle} from "react-icons/fa";
import {AiFillHeart} from "react-icons/ai";
import {PostProps} from "../../pages/home";
import {useContext} from "react";
import AuthContext from "../../context/AuthContext";
import {deleteDoc, doc} from "firebase/firestore";
import { db } from "firebaseApp";
import { toast } from "react-toastify";

interface PostBoxProps {
    post: PostProps;
}
export default function PostBox({post}: PostBoxProps){
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleDelete = async () => {
        const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");
        // 윈도우에서 게시글 삭제 확인
        if(confirm){
            await deleteDoc(doc(db, "posts", post.id));
            toast.success("게시글을 삭제했습니다.");
            navigate("/");
        }
    };
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
                    <div className="post-form_hashtags-outputs">
                        {post?.hashTags?.map((tag, index) => (
                            <span className="post-form_hashtags-tag" key={index}>#{tag}</span>
                        ))}
                    </div>

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
            <button type="button" className="post_comments">
                <FaRegComment/>
                {post?.comments?.length || 0}
            </button>
        </div>
    </div>
    );
}