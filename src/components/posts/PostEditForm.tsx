import {FiImage} from "react-icons/fi";
import React, {useCallback, useContext, useEffect, useState} from "react";
import { updateDoc, doc, getDoc  } from "firebase/firestore";
import {db} from "../../firebaseApp";
import {toast} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import {PostProps} from "../../pages/home";

export default function PostEditForm(){
    const [hashTag, setHashTag] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
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

            //게시글 가져올때 작성됐던 해시태그도 가져오기
            setTags(docSnap?.data()?.hashTags);
        }
    },[params.id])

    const onSubmit = async (e: any) => {
        e.preventDefault();

        try {
            if(post){
                const postRef = doc(db, "posts", post?.id);
                await updateDoc(postRef, {
                    content:content,
                    hashTag: tags,
                });
                navigate(`/posts/${post?.id}`);
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

    //클릭시 해당태그 삭제 (클릭된 태그 == tag 같은 값은 삭제)
    const removeTag = (tag: string) => {
        setTags(tags?.filter((val) => val !== tag));
    };

    const onChangeHashTag = (e: any) => {
        setHashTag(e?.target?.value?.trim());
    };

    const handleKeyUp = (e: any) => {
        // 해당키가 스페이스 바인지 확인
        if (e.keyCode === 32 && e.target.value.trim() !== "") {
            // 만약 같은 태그가 있다면 에러를 띄운다
            // 아니라면 태그를 생성해준다
            if (tags?.includes(e.target.value?.trim())) {
                toast.error("같은 태그가 있습니다.");
            } else {
                setTags((prev) => (prev?.length > 0 ? [...prev, hashTag] : [hashTag]));
                setHashTag("");
            }
        }
    };

    return(
        <form className="post-form" onSubmit={onSubmit}>
            <textarea className="post-form_textarea" required name="content" id="content"
                      placeholder="What is happening?" onChange={onChange} value={content}/>
            <div className="post-form_hashtags">
                <span className="post-form_hashtags-outputs">
                  {tags?.map((tag, index) => (
                      <span
                          className="post-form_hashtags-tag"
                          key={index}
                          onClick={() => removeTag(tag)}
                      >
                          #{tag}
                      </span>
                  ))}
                </span>
                <input
                    className="post-form_input"
                    name="hashtag"
                    id="hashtag"
                    onChange={onChangeHashTag}
                    onKeyUp={handleKeyUp}
                    value={hashTag}
                />
            </div>
            <div className="post-form_submit-area">
                <label htmlFor="file-input" className="post-form_file">
                    <FiImage className="post-form_file-icon"/>
                </label>
                <input type="file" name="file-input" accept="image/*" onChange={handleFileUpload}
                       className="hidden"/>
                <input type="submit" value="수정" className="post-form_submit-btn"/>
            </div>
        </form>
    );
}