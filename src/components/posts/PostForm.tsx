import {FiImage} from "react-icons/fi";
import React, {useContext, useState} from "react";
import { collection, addDoc } from "firebase/firestore";
import {db} from "firebaseApp";

import {toast} from "react-toastify";
import AuthContext from "context/AuthContext";

export default function PostForm(){
    const [content, setContent] = useState<string>("");
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
            })
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

    return(
        <form className="post-form" onSubmit={onSubmit}>
            <textarea className="post-form_textarea" required name="content" id="content" placeholder="What is happening?" onChange={onChange} value={content} />
            <div className="post-form_submit-area">
                <label htmlFor="file-input" className="post-form_file">
                    <FiImage className="post-form_file-icon" />
                </label>
                <input type="file" name="file-input" accept="image/*" onChange={handleFileUpload} className="hidden"/>
                <input type="submit" value="Tweet" className="post-form_submit-btn"/>
            </div>
        </form>
    );
}