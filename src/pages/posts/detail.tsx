import Loader from "components/loader/Loader";
import PostBox from "components/posts/PostBox";
import {PostProps} from "pages/home";
import {useCallback, useEffect, useState} from "react";
import {useParams, } from "react-router-dom";
import {doc, getDoc} from "firebase/firestore";
import {db} from "firebaseApp";

import PostHeader from "../../components/posts/PostHeader";

export default function PostDetailPage(){
    const params = useParams();
    const [post, setPost] = useState<PostProps | null>(null);

    const getPost = useCallback(async () => {
        if(params.id) {
            const docRef = doc(db, "posts", params.id);
            const docSnap = await getDoc(docRef);

            //docSnap data 가져오기 //as PostProps 타입지정
            setPost({...(docSnap?.data() as PostProps), id: docSnap?.id })
        }
    }, [params.id]);
    
    // 페이지 처음 마운트될때 호출
    useEffect(() => {
        if(params.id) getPost();
    }, [getPost, params.id]);
    
    return (
        <div className="post">
            <PostHeader />
            {post ? <PostBox post={post} /> : <Loader />}
        </div>
    );
}