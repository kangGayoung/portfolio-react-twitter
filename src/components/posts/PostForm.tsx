import {FiImage} from "react-icons/fi";
import React, {useContext, useState} from "react";
import { collection, addDoc } from "firebase/firestore";
import {db} from "firebaseApp";

import {toast} from "react-toastify";
import AuthContext from "context/AuthContext";

export default function PostForm(){
    const [content, setContent] = useState<string>("");
    const [hashTag, setHashTag] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const {user} = useContext(AuthContext);
    const handleFileUpload = () => {};

    const onSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, "posts"),{
                content: content,
                // ?.toLocaleDateString 날짜가져오기 포멧팅
                createdAt: new Date()?.toLocaleDateString("ko",{
                    hour: "2-digit",
                    minute: "2-digit",
                    second:"2-digit"
                }),
                uid: user?.uid,
                email: user?.email,
                hashTags: tags,
            })
            setTags([]);
            setHashTag("");
            setContent(""); // content 초기화
            toast.success("게시글을 생성했습니다.");
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
                    placeholder="해시태그 + 스페이스바 입력"
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
                <input type="submit" value="Tweet" className="post-form_submit-btn"/>
            </div>
        </form>
    );
}