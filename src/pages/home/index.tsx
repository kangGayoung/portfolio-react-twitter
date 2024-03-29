
import PostForm from "../../components/posts/PostForm";
import PostBox from "../../components/posts/PostBox";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {
    collection,
    query,
    onSnapshot,
    orderBy,
    doc,
    where,
} from "firebase/firestore";
import AuthContext from "../../context/AuthContext";
import {db} from "../../firebaseApp";
import useTranslation from "../../hooks/useTranslation";

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
    imageUrl?: string;
}

interface UserProps {
    id:string;
}

type tabType = "all" | "following";

export default function HomePage(){
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [followingPosts, setFollowingPosts] = useState<PostProps[]>([]);
    const [followingIds, setFollowingIds] = useState<string[]>([""]); //배열안에 내용이 항상 있어야함 ""
    const [activeTab, setActiveTab] = useState<tabType>("all");
    const {user} = useContext(AuthContext);
    const t = useTranslation();

    // following 탭 구현
    // 실시간 동기화로 user의 팔로잉 id 배열 가져오기
    const getFollowingIds = useCallback(async () => {
        if(user?.uid){
            // 참조 가져오기
            const ref = doc(db, "following", user?.uid);
            onSnapshot(ref, (doc) => {
                setFollowingIds([""]);
                doc?.data()?.users?.map((user: UserProps) =>
                    setFollowingIds((prev: string[]) => //string 배열로 아이디를 가져 옴
                        prev ? [...prev, user?.id] : []
                    )
                );
            });
        }
    },[user?.uid])

    useEffect(() => {
        if (user) {
            let postsRef = collection(db, "posts");
            let postsQuery = query(postsRef, orderBy("createdAt", "desc"));
            let followingQuery = query(
                postsRef,
                where("uid", "in", followingIds),
                orderBy("createdAt", "desc")
            )

            onSnapshot(postsQuery, (snapShot) => {
                let dataObj = snapShot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc?.id,
                }));
                setPosts(dataObj as PostProps[]);
            })

            onSnapshot(followingQuery, (snapShot) => {
                let dataObj = snapShot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc?.id,
                }));
                setFollowingPosts(dataObj as PostProps[]);
            })
        }
    }, [followingIds, user]);

    // followingIds 호출
    useEffect(() => {
        if(user?.uid) getFollowingIds();
    }, [getFollowingIds, user?.uid]);

    return (
        <div className="home">
            <div className="home_top home_top-bg">
                <div className="home_title">{t("MENU_HOME")}</div>
                <div className="home_tabs">
                    <div
                        className={`home_tab ${activeTab === "all" && "home_tab-active"}`}
                        onClick={() => {
                            setActiveTab("all");
                        }}
                    >   {t("TAB_ALL")}
                    </div>
                    <div
                        className={`home_tab ${
                            activeTab === "following" && "home_tab-active"
                        }`}
                        onClick={() => {
                            setActiveTab("following");
                        }}
                    >   {t("TAB_FOLLOWING")}
                    </div>
                </div>
            </div>
            <PostForm />
            {activeTab === "all" && (
                <div className="post">
                    {posts?.length > 0 ? (
                        posts?.map((post) => <PostBox post={post} key={post.id} />)
                    ) : (
                        <div className="post_no-posts">
                            <div className="post_text">{t("NO_POSTS")}</div>
                        </div>
                    )}
                </div>
            )}
            {activeTab === "following" && (
                <div className="post">
                    {followingPosts?.length > 0 ? (
                        followingPosts?.map((post) => (
                            <PostBox post={post} key={post.id} />
                        ))
                    ) : (
                        <div className="post_no-posts">
                            <div className="post_text">{t("NO_POSTS")}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}