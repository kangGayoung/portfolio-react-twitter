import {FiImage} from "react-icons/fi";
import React, {useCallback, useContext, useEffect, useState} from "react";
import { updateDoc, doc, getDoc  } from "firebase/firestore";
import {db} from "../../firebaseApp";
import {toast} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import {PostProps} from "../../pages/home";

export default function PostEditForm(){
    // url id 값을 확인하기 위해 파람 만들기
    const params = useParams();
    //console.log(params); // id 확인
    const [post, setPost] = useState<PostProps | null>(null);
    const [content, setContent] = useState<string>("");
    const navigate = useNavigate();
    const handleFileUpload = () => {};

    const getPost = useCallback(async() =>{
        if(params.id){
            const docRef = doc(db, "posts", params.id);
            const docSnap = await getDoc(docRef);
            //console.log(docSnap.data(), docSnap.id);
            setPost({...(docSnap?.data() as PostProps), id:docSnap.id});
            setContent(docSnap?.data()?.content);
        }
    },[params.id])

    const onSubmit = async (e: any) => {
        e.preventDefault();

        try {
            if(post){
                const postRef = doc(db, "post", post?.id);
                await updateDoc(postRef, {
                    content:content,
                });
                navigate(`posts/${post?.id}`);
                toast.success("게시글을 수정했습니다.");
            }
        } catch (e:any){
            console.log(e);
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const {
            target: {name, value},
        } = e;
        //console.log(name, value);

        if (name === "content"){
            setContent(value);
        }
    };

    useEffect(()=>{
        if(params.id) getPost();
    },[getPost]);

    return(
        <form className="post-form" onSubmit={onSubmit}>
            <textarea className="post-form_textarea" required name="content" id="content" placeholder="What is happening?" onChange={onChange} value={content} />
            <div className="post-form_submit-area">
                <label htmlFor="file-input" className="post-form_file">
                    <FiImage className="post-form_file-icon" />
                </label>
                <input type="file" name="file-input" accept="image/*" onChange={handleFileUpload} className="hidden"/>
                <input type="submit" value="수정" className="post-form_submit-btn"/>
            </div>
        </form>
    );
}