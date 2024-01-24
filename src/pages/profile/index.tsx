import React, {useContext, useEffect, useState} from "react";
import {PostProps} from "../home";
import PostBox from "../../components/posts/PostBox";
import {collection, onSnapshot, orderBy, query, where} from "firebase/firestore";
import {db} from "../../firebaseApp";
import AuthContext from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";

const PROFILE_DEFAULT_URL = '/logo192.png'; //기본 프로필 URL

export default function ProfilePage(){
    const [posts, setPosts] = useState<PostProps[]>([]);
    const navigate = useNavigate();
    const {user} = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            let postsRef = collection(db, "posts");
            let postsQuery = query(
                postsRef, 
                where("uid", "==", user.uid), // 유저와 같은 아이디일때 게시글 가져오기
                orderBy("createdAt", "desc")
            );

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
                <div className="home_title">Profile</div>
                <div className="profile">
                    <img
                        src={user?.photoURL || PROFILE_DEFAULT_URL}
                        alt="profile"
                        className="profile_image"
                        width={100}
                        height={100}
                    />
                    <button
                        type="button"
                        className="profile_btn"
                        onClick={() => navigate("/profile/edit")}
                    >
                        프로필 수정
                    </button>
                </div>
                <div className="profile_text">
                    <div className="profile_name">{user?.displayName || "사용자님"}</div>
                    <div className="profile_email">{user?.email}</div>
                </div>
                <div className="home_tabs">
                    <div className="home_tab home_tab--active">For You</div>
                    <div className="home_tab">Likes</div>
                </div>
                <div className="post">
                    {posts?.length > 0 ? (
                        posts?.map((post) => <PostBox post={post} key={post.id} />)
                    ) : (
                        <div className="post_no-posts">
                            <div className="post_text">게시글이 없습니다.</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}