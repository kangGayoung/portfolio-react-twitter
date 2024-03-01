import {FiImage} from "react-icons/fi";
import React, {useContext, useState} from "react";
import { collection, addDoc } from "firebase/firestore";
import {db, storage} from "firebaseApp";

import {toast} from "react-toastify";
import AuthContext from "context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import {getDownloadURL, ref, uploadString } from "firebase/storage";

export default function PostForm(){
    const [content, setContent] = useState<string>("");
    const [hashTag, setHashTag] = useState<string>("");
    const [imageFile, setImageFile] = useState<string | null>(null);
    // 이미지 업로드 중 확인 //이미지 여러번 업로드 안되게
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [tags, setTags] = useState<string[]>([]);
    const {user} = useContext(AuthContext);

    const handleFileUpload = (e:any) => {
        const {
            target:{files},
        }=e;

        const file = files?.[0];
        const fileReader = new FileReader(); // 업로드된 파일을 읽어줌
        fileReader?.readAsDataURL(file); // 업로드 파일의 인코딩된 데이터 URL

        fileReader.onloadend = (e:any) => {
            const {result} = e?.currentTarget; //구조분해
            setImageFile(result);
        }
    };

    const onSubmit = async (e: any) => {
        setIsSubmitting(true);
        const key = `${user?.uid}/${uuidv4()}`; //uuidv4 랜던 string으로 파일명 생성
        const storageRef = ref(storage, key);
        e.preventDefault();

        try {
            // 이미지 먼저 업로드
            let imageUrl = "";
            if (imageFile){
                const data = await uploadString(storageRef, imageFile, "data_url");
                imageUrl = await getDownloadURL(data?.ref);
            }
            // 업로드된 이미지의 download url 업데이트
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
                imageUrl:imageUrl,
            })
            setTags([]);
            setHashTag("");
            setContent(""); // content 초기화
            toast.success("게시글을 생성했습니다.");
            setImageFile(null);
            setIsSubmitting(false);
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

    const handleDeleteImage = () => {
        setImageFile(null); //setImageFile 초기화
    }

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
                <div className="post-form_image-area">
                    <label htmlFor="file-input" className="post-form_file">
                        <FiImage className="post-form_file-icon"/>
                    </label>
                    <input type="file" name="file-input" id="file-input" accept="image/*"
                           onChange={handleFileUpload}
                           className="hidden"/>
                    {imageFile && (
                        <div className="post-form_attachment">
                            {/*업로드 된 이미지가 스트링 소스가 아니라 이미지로 인코딩 되게 해 줌 */}
                            <img src={imageFile} alt="attachment" width={100} height={100} />
                            <button className="post-form_clear-btn" type="button" onClick={handleDeleteImage}>
                                Clear
                            </button>
                        </div>
                    )}
                </div>
                <input type="submit" value="Tweet" className="post-form_submit-btn"
                       disabled={isSubmitting}/>
            </div>
        </form>
    );
}