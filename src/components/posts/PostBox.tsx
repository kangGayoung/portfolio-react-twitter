import {Link, useNavigate} from "react-router-dom";
import {FaRegComment, FaUserCircle} from "react-icons/fa";
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai";
import {PostProps} from "../../pages/home";
import {useContext} from "react";
import AuthContext from "../../context/AuthContext";
import {arrayRemove, arrayUnion, deleteDoc, doc, updateDoc} from "firebase/firestore";
import {db, storage} from "firebaseApp";
import { toast } from "react-toastify";
import {deleteObject, ref} from "firebase/storage";
import FollowingBox from "../following/FollowingBox";
import useTranslation from "../../hooks/useTranslation";

interface PostBoxProps {
    post: PostProps;
}
export default function PostBox({post}: PostBoxProps){
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    const imageRef = ref(storage, post?.imageUrl); //"이미지 url"
    const t = useTranslation();

    const toggleLike = async () => {
        const postRef = doc(db, "posts", post.id);

        if(user?.uid && post?.likes?.includes(user?.uid)){
            // 사용자가 좋아요를 미리 한 경우 -> 좋아요를 취소한다.
            await updateDoc(postRef, {
                likes: arrayRemove(user?.uid),
                likeCount: post?.likeCount ? post?.likeCount - 1 : 0,
            });
        } else {
            // 사용자가 좋아요를 하지 않은 경우 -> 좋아요를 추가한다.
            await updateDoc(postRef, {
                likes: arrayUnion(user?.uid),
                likeCount: post?.likeCount ? post?.likeCount + 1 : 1,
            })
        }
    };

    const handleDelete = async () => {
        const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");
        // 윈도우에서 게시글 삭제 확인
        if(confirm){
            // 스토리지 이미지 먼저 삭제
            // 스토리지에서도 파일 삭제
            if(post?.imageUrl){
                deleteObject(imageRef).catch((error) => {
                    console.log(error);
                })
            }

            await deleteDoc(doc(db, "posts", post.id));
            toast.success("게시글을 삭제했습니다.");
            navigate("/");
        }
    };
    return (
        <div className="post_box" key={post?.id}>

            <div className="post_box-profile">
                <div className="post_flex">
                    {post?.profileUrl ? (
                        <img src={post?.profileUrl} alt="prorile"
                             className="post_box-profile-img"/>
                    ) : (
                        <FaUserCircle className="post_box-profile-icon"/>
                    )}
                    <div className="post_flex-between">
                        <div className="post_flex">
                            <div className="post_email">{post?.email}</div>
                            <div className="post_createdAt">{post?.createdAt}</div>
                        </div>
                        <FollowingBox post={post}/>
                    </div>
                </div>
                <Link to={`/posts/${post?.id}`}> {/*해당 게시글로 이동*/}
                    <div className="post_box-content">{post?.content}</div>
                    {/*업로드 된 파일 이미지 보여주기*/}
                    {post?.imageUrl && (
                        <div className="post_image-div">
                            <img
                                src={post?.imageUrl}
                                alt="post img"
                                className="post_image"
                                width={100}
                                height={100}
                            />
                        </div>
                    )}
                    <div className="post-form_hashtags-outputs">
                        {post?.hashTags?.map((tag, index) => (
                            <span className="post-form_hashtags-tag" key={index}>#{tag}</span>
                        ))}
                    </div>
                </Link>
            </div>

            <div className="post_box-footer">
                {/* post.uid === user.uid 일때 */}
                {user?.uid === post?.uid && ( //유저의 아이디가 포스트의 아이디와 일치할때만 삭제
                    <>
                        <button type="button" className="post_delete"
                            onClick={handleDelete}>{t("BUTTON_DELETE")}</button>
                    <button type="button" className="post_edit">
                        <Link to={`/posts/edit/${post?.id}`}>{t("BUTTON_EDIT")}</Link>
                    </button>
                </>
                )}

            <button type="button" className="post_likes" onClick={toggleLike}>
                {user && post?.likes?.includes(user.uid) ? (
                    <AiFillHeart/>
                ) : (
                    <AiOutlineHeart />
                )}

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