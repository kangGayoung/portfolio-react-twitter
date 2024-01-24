import Loader from "components/loader/Loader";
import PostBox from "components/posts/PostBox";
import {PostProps} from "pages/home";
import {useCallback, useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {doc, getDoc} from "firebase/firestore";
import {db} from "firebaseApp";

import {IoIosArrowBack} from "react-icons/io";

export default function PostDetailPage(){
    const params = useParams();
    const navigate = useNavigate();
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
            <div className="post_header">
                {/*뒤로가기*/}
                <button type="button" onClick={()=> navigate(-1)}>
                    <IoIosArrowBack className="post_header-btn" />
                </button>
            </div>
            {post ? <PostBox post={post} /> : <Loader />}
        </div>
    );
}