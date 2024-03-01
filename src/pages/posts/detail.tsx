import Loader from "components/loader/Loader";
import PostBox from "components/posts/PostBox";
import {PostProps} from "pages/home";
import {useCallback, useEffect, useState} from "react";
import {useParams, } from "react-router-dom";
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "firebaseApp";

import PostHeader from "components/posts/PostHeader";
import CommentForm from "components/comments/CommentForm";
import CommentBox, {CommentProps} from "components/comments/CommentBox";

export default function PostDetailPage(){
    const params = useParams();
    const [post, setPost] = useState<PostProps | null>(null);

    const getPost = useCallback(async () => {
        if(params.id) {
            const docRef = doc(db, "posts", params.id);
            // const docSnap = await getDoc(docRef); 댓글 추가는 되지만 업데이트는 따로 해줘야함
            // 실시간 추가 및 업데이트
            onSnapshot(docRef, (doc) => {
                setPost({...(doc?.data() as PostProps), id:doc.id});
            })

            //docSnap data 가져오기 //as PostProps 타입지정
            //setPost({...(docSnap?.data() as PostProps), id: docSnap?.id }) 댓글 추가는 되지만
            // 업데이트는 따로
            // 해줘야함
        }
    }, [params.id]);
    
    // 페이지 처음 마운트될때 호출
    useEffect(() => {
        if(params.id) getPost();
    }, [getPost, params.id]);
    
    return (
        <div className="post">
            <PostHeader />
            {post ? (
                <>
                    <PostBox post={post} />
                    <CommentForm post={post} />
                    {/*코멘트를 시간순으로 맵핑*/}
                    {post?.comments?.slice(0)?.reverse()?.map((data: CommentProps, index:number) => (
                        <CommentBox data={data} key={index} post={post}/>
                    ))}
                </>
            ): (<Loader />)}
        </div>
    );
}