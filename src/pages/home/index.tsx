
import PostForm from "../../components/posts/PostForm";
import PostBox from "../../components/posts/PostBox";
import React, {useContext, useEffect, useState} from "react";
import { collection, query, where, onSnapshot,orderBy } from "firebase/firestore";
import AuthContext from "../../context/AuthContext";
import {db} from "../../firebaseApp";

export interface PostProps {
    id:string;
    email:string;
    content:string;
    createdAt:string;
    uid:string;
    profileUrl?: string;
    likes?:string[];
    likeCount?: number;
    comments?: any;
    hashTags?:string[];
}

export default function HomePage(){
    const [posts, setPosts] = useState<PostProps[]>([]);
    const {user} = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            let postsRef = collection(db, "posts");
            let postsQuery = query(postsRef, orderBy("createdAt", "desc"));

            onSnapshot(postsQuery, (snapShot) => {
                let dataObj = snapShot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc?.id,
                }));
                setPosts(dataObj as PostProps[]);
            })
        }
    }, [user]);
    return (
        <div className="home">
            <div className="home_top">
                <div className="home_title">Home</div>
                <div className="home_tabs">
                    <div className="home_tab home_tab--active">For You</div>
                    <div className="home_tab">Following</div>
                </div>
            </div>
            <PostForm/>
            {/* Tweet posts */}
            <div className="post">
                {posts?.length > 0 ? posts?.map((post) => (
                    <PostBox post={post} key={post.id}/>
                )) : (
                    <div className="post_no-posts">
                        <div className="post_text">게시글이 없습니다.</div>
                    </div>
                )}
            </div>
        </div>
    )
}