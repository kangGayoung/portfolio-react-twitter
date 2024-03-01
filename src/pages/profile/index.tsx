import React, {useContext, useEffect, useState} from "react";
import {PostProps} from "../home";
import PostBox from "../../components/posts/PostBox";
import {collection, onSnapshot, orderBy, query, where} from "firebase/firestore";
import {db} from "../../firebaseApp";
import AuthContext from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
import {useRecoilState} from "recoil";
import {languageState} from "../../atom";

const PROFILE_DEFAULT_URL = '/logo192.png'; //기본 프로필 URL
type TabType = "my" | "like";

export default function ProfilePage(){
    const [activeTab, setActiveTap] = useState<TabType>("my");
    //const [posts, setPosts] = useState<PostProps[]>([]);
    const [myPosts, setMyPosts] = useState<PostProps[]>([]); // 게시글 카테고리별로 나누기
    const [likePosts, setLikePosts] = useState<PostProps[]>([]);
    const navigate = useNavigate();
    const [language, setLanguage] = useRecoilState(languageState);
    const {user} = useContext(AuthContext);

    const onclickLanguage = () => {
        setLanguage(language === "ko" ? "en" : "ko");
        // localStorage 해당 값을 영속적으로 저장(새로고침해도 사라지지 않음)
        // setItem("language", <- 키값 먼저 설정
        localStorage.setItem("language", language === "ko" ? "en" : "ko");
    }

    useEffect(() => {
        if (user) {
            let postsRef = collection(db, "posts");
            const myPostQuery = query(
                postsRef,
                where("uid", "==", user.uid), // 유저와 같은 아이디일때 게시글 가져오기
                orderBy("createdAt", "desc")
            );
            const likePostQuery = query(
                postsRef,
                where("likes", "array-contains", user.uid), // 유저와 같은 아이디일때 게시글 가져오기
                orderBy("createdAt", "desc")
            );

            onSnapshot(myPostQuery, (snapShot) => {
                let dataObj = snapShot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc?.id,
                }));
                setMyPosts(dataObj as PostProps[]);
            })
            onSnapshot(likePostQuery, (snapShot) => {
                let dataObj = snapShot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc?.id,
                }));
                setLikePosts(dataObj as PostProps[]);
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
                    <div className="profile_flex">
                        <button
                            type="button"
                            className="profile_btn"
                            onClick={() => navigate("/profile/edit")}
                        >
                            프로필 수정
                        </button>
                        <button
                            type="button"
                            className="profile_btn-language"
                            onClick={onclickLanguage}
                        >
                            {language === "ko" ? "한국어" : "English"}
                        </button>
                    </div>
                </div>
                <div className="profile_text">
                    <div className="profile_name">
                        {user?.displayName || "사용자님"}
                    </div>
                    <div className="profile_email">{user?.email}</div>
                </div>
                <div className="home_tabs">
                    {/*기본적으로 홈탭을 보여주고 액티브 탭이 "마이" 일때 액티브 적용*/}
                    <div
                        className={`home_tab ${activeTab === "my" && "home_tab-active"}`}
                        onClick={() => {
                            setActiveTap("my");
                        }}
                    >
                        For You
                    </div>
                    <div
                        className={`home_tab ${activeTab === "like" && "home_tab-active"}`}
                        onClick={() => {
                            setActiveTap("like");
                        }}
                    >
                        Likes
                    </div>
                </div>
                {activeTab === "my" && (
                    <div className="post">
                        {myPosts?.length > 0 ? (
                            myPosts?.map((post) => <PostBox post={post} key={post.id} />)
                        ) : (
                            <div className="post_no-posts">
                                <div className="post_text">게시글이 없습니다.</div>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === "like" && (
                    <div className="post">
                        {likePosts?.length > 0 ? (
                            likePosts?.map((post) => <PostBox post={post} key={post.id} />)
                        ) : (
                            <div className="post_no-posts">
                                <div className="post_text">게시글이 없습니다.</div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}