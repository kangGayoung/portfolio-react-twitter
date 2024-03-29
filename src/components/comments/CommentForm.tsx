import {PostProps} from "../../pages/home";
import {useContext, useState} from "react";
import {addDoc, arrayUnion, collection, doc, updateDoc} from "firebase/firestore";
import {db} from "../../firebaseApp";
import AuthContext from "../../context/AuthContext";
import {toast} from "react-toastify";

export  interface CommentFormProps {
    post: PostProps | null;
}

export default function CommentForm({post}: CommentFormProps) {
    const [comment, setComment] = useState<string>("");
    const {user} = useContext(AuthContext);

    // 댓글 알림 내용 길 경우 - 내용 줄이기
    const truncate = (str: string) => {
        return str?.length > 10 ? str?.substring(0, 10) + "..." : str;
    }

    const onSubmit = async (e: any) => {
        e.preventDefault(); // 내부에 폼이 입력 안되게

        //post 있는 경우에만
        if (post) {
            const postRef = doc(db, "posts", post?.id);

            const commentObj = {
                comment: comment,
                uid: user?.uid,
                email: user?.email,
                createdAt: new Date()?.toLocaleDateString("ko", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                }),
            };

            await updateDoc(postRef, {
                comments: arrayUnion(commentObj), //arrayUnion 배열에 commentObj를 추가
            });

            // 댓글 생성 알림 만들기
            if (user?.uid !== post?.uid){ // 유저와 게시글 작성자 아이디가 같을때 예외처리
                await addDoc(collection(db, "notifications"), {
                    createdAt: new Date()?.toLocaleDateString("ko", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    }),
                    uid: post?.uid, // 게시글 작성자에게 알림
                    isRead: false,
                    url: `/posts/${post?.id}`,
                    content: `"${truncate(post?.content)} 글에 댓글이 작성되었습니다.`, // 알림 내용
                })
            }

            // 댓글 생성 성공
            toast.success("댓글을 생성했습니다.");
            setComment(""); //초기화

            try {
            } catch (e: any) {
                console.log(e);
            }
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const {
            target: { name, value },
        } = e;

        if (name === "comment"){
            setComment(value);
        }
    };

    return (
        <form className="post-form" onSubmit={onSubmit}>
            <textarea
                className="post-form_textarea"
                name="comment"
                id="comment"
                required
                placeholder="What is happening?"
                onChange={onChange}
                value={comment}
            />
            <div className="post-form_submit-area">
                <div />
                <input
                    type="submit"
                    value="Comment"
                    className="post-form_submit-btn"
                    disabled={!comment} //코멘트 없으면 비활성
                />
            </div>
        </form>
    );
}