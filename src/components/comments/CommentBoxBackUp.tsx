import {PostProps} from "pages/home";
import {useContext} from "react";
import AuthContext from "context/AuthContext";
import {arrayRemove, doc, updateDoc} from "firebase/firestore";
import {db} from "firebaseApp";
import {toast} from "react-toastify";

import style from "./Comment.module.scss";

export interface CommentProps {
    comment:string;
    uid: string;
    email:string;
    createdAt: string;
}

interface CommentBoxProps {
    data: CommentProps;
    post:PostProps; //타입 가져오기
}

// 코멘트가 보여지는 부분
export default function CommentBox({ data, post }: CommentBoxProps ){
    const { user } = useContext(AuthContext);

    const handleDeleteComment = async () => {
        if (post){ // post있을때 댓글 삭제 -> 댓글은 포스트 안에 코멘트 배열로 존재
            try {
                const postRef = doc(db, "posts", post?.id);
                await updateDoc(postRef, {
                    comments: arrayRemove(data),
                });
                toast.success("댓글을 삭제했습니다.");
            } catch (e){
                console.log(e);
            }
        }
    };

    return (
        <div key={data?.createdAt} className="comment">
            <div className="comment_border-box">
                <div className="comment_img-box">
                    <div className="comment_flex-box">
                        <img src={`/logo192.png`} alt="profile"/>
                        <div className="comment_email">{data?.email}</div>
                        <div className="comment_createdAt">{data?.createdAt}</div>
                    </div>
                </div>
                <div className="comment_content">{data?.comment}</div>
            </div>
            <div className="comment_submit-div">
                {data?.uid === user?.uid && (
                    <button type="button" className="comment_delete-btn"
                            onClick={handleDeleteComment}>
                        삭제
                    </button>
                )}
            </div>
        </div>
    );
}