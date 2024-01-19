import {FiImage} from "react-icons/fi";
import {Link} from "react-router-dom";
import {FaRegComment, FaUserCircle} from "react-icons/fa";
import {AiFillHeart} from "react-icons/ai";
import PostForm from "../../components/posts/PostForm";
import PostBox from "../../components/posts/PostBox";
import React from "react";

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
}

// 더미데이터
const posts: PostProps[] = [
    {
        id:"1",
        email:"test@test.com",
        content:"내용입니다",
        createdAt:"2024-01-19",
        uid:"123123",
    },{
        id:"2",
        email:"test@test.com2",
        content:"내용입니다222",
        createdAt:"2024-01-19",
        uid:"123123",
    },{
        id:"3",
        email:"test@test.com3",
        content:"내용입니다3",
        createdAt:"2024-01-19",
        uid:"123123",
    },{
        id:"4",
        email:"test@test.com4",
        content:"내용입니다4",
        createdAt:"2024-01-19",
        uid:"123123",
    },{
        id:"5",
        email:"test@test.com5",
        content:"내용입니다5",
        createdAt:"2024-01-19",
        uid:"123123",
    },
]

export default function HomePage(){

    return (
        <div className="home">
            <div className="home_title">Home</div>
            <div className="home_tabs">
                <div className="home_tab home_tab--active">For You</div>
                <div className="home_tab">Following</div>
            </div>
            <PostForm />
            {/* Tweet posts */}
            <div className="post">
                {posts?.map((post) => (
                    <PostBox post={post} key={post.id} />
                ))}
            </div>
        </div>
    )
}