import PostBox from "../../components/posts/PostBox";
import React, {useContext, useEffect, useState} from "react";
import {PostProps} from "../home";
import AuthContext from "../../context/AuthContext";
import {db} from "../../firebaseApp";
import {collection, query, where, orderBy, onSnapshot, doc} from "firebase/firestore";


export default function SearchPage(){
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [tagQuery, setTagQuery] = useState<string>(""); //태그를 쿼리로 상태관리
    //console.log(tagQuery);
    const{user} = useContext(AuthContext);

    const onChange = (e:any) => {
        setTagQuery(e?.target?.value?.trim());
    };

    useEffect(() => {
        if(user){
            let postRef = collection(db, "posts");
            let postQuery = query(
                postRef,
                where("hashTags", "array-contains-any", [tagQuery]), //[tagQuery]의 배열의 값을 가지고 있어야한다
                orderBy("createdAt", "desc")
            )

            onSnapshot(postQuery, (snapshot) => {
                let dataObj = snapshot?.docs?.map((doc) => ({
                    ...doc?.data(),
                    id: doc?.id,
                }));

                setPosts(dataObj as PostProps[]);
            })
        }
    },[tagQuery, user])

    return (
        <div className="home">
            <div className="home_top">
                <div className="home_title">
                    <div className="home_title-text">Search</div>
                </div>
                <div className="home_search-div">
                    <input className="home_search" placeholder="해시태그 검색" onChange={onChange}/>
                </div>
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
        </div>
    );
}